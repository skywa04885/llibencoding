/*
    Copyright 2022 Luke A.C.A. Rieff (Skywa04885)

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { Transform, TransformCallback, TransformOptions } from "stream";

export interface LineDecoderStreamOptions {
  stream?: TransformOptions;
  separator?: string;
  encoding?: BufferEncoding;
  buffer_output?: boolean;
}

export class LineDecoderStream extends Transform {
  protected _encoding: BufferEncoding;
  protected _separator: string;
  protected _buffer_output: boolean;

  protected _remainder?: Buffer;

  /**
   * Constructs a new LineDecoderStream.
   * @param options the options.
   */
  public constructor(options: LineDecoderStreamOptions = {}) {
    super(options.stream);

    // Sets the options.
    this._encoding = options.encoding ?? "utf-8";
    this._separator = options.separator ?? '\r\n';
    this._buffer_output = options.buffer_output ?? false;

    // If we're not doing a buffer output, set the stream encoding.
    if (!this._buffer_output) {
      this.setEncoding(this._encoding);
    }
  }

  /**
   * Pushes the given buffer and it's slice onto the stream.
   * @param buffer the buffer.
   * @param start the start of the slice.
   * @param end the end of the slice.
   */
  protected _push_buffer(buffer: Buffer, start?: number, end?: number): void {
    if (this._buffer_output) {
      let buffer_copy: Buffer = Buffer.allocUnsafe(buffer.length);
      buffer.copy(buffer_copy);
      this.push(buffer_copy);
      return;
    }

    this.push(buffer.toString(this._encoding, start, end));
  }

  /**
   * Pushes the given string onto the stream.
   * @param str the string to push.
   */
  protected _push_string(str: string): void {
    if (this._buffer_output) {
      this.push(Buffer.from(str));
      return;
    }

    this.push(str);
  }

  /**
   * Decodes the given buffer.
   * @param buffer the buffer.
   */
  protected _decode(buffer: Buffer): void {
    this._push_buffer(buffer);
  }

  /**
   * Gets called when there is more data to transform.
   * @param chunk the chunk to transform.
   * @param encoding the encoding.
   * @param callback the callback for when done.
   */
  public _write(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    // Appends the remainder if there.
    if (this._remainder) {
      chunk = Buffer.concat([this._remainder, chunk]);
      this._remainder = undefined;
    }

    // Starts looping over the lines, and decoding them.
    let chunk_slice_start: number = 0;
    while (true) {
      // Gets the end of the slice, in this case the location of the separator.
      //  and if it does not exist, break since we don't have a complete line.
      const chunk_slice_end: number = chunk.indexOf(
        this._separator,
        chunk_slice_start,
        this._encoding
      );
      if (chunk_slice_end === -1) {
        break;
      }

      // Gets the chunk slice, and calls the decoding callback.
      const chunk_slice: Buffer = chunk.slice(
        chunk_slice_start,
        chunk_slice_end
      );

      // Decodes the slice.
      this._decode(chunk_slice);

      // Sets the new start of the chunk slice.
      chunk_slice_start = chunk_slice_end + this._separator.length;
    }

    // Creates the remainder if there is a non-complete line.
    if (chunk_slice_start !== chunk.length) {
      this._remainder = chunk.slice(chunk_slice_start, chunk.length);
    }

    // Calls the callback to receive more data.
    callback();
  }

  /**
   * Gets called when the stream ends, and pushes the remainder if there.
   * @param callback the callback to call when done.
   */
  public _flush(callback: TransformCallback) {
    // Checks if there still is a remainder, if so treat it like a line and decode it.
    if (this._remainder) {
      // Decode the remainder.
      this._decode(this._remainder);

      // Remove the remainder.
      this._remainder = undefined;
    }

    // Calls the callback.
    callback();
  }
}
