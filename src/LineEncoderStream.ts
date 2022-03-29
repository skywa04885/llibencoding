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

export interface LineEncoderStreamOptions {
  stream?: TransformOptions;
  max_line_length?: number;
  separator?: string;
  encoding?: BufferEncoding;
  buffer_output?: boolean;
}

export class LineEncoderStream extends Transform {
  protected _max_line_length: number; // The max length for a line.
  protected _encoding: BufferEncoding; // The encoding.
  protected _separator: string; // The line separator.
  protected _buffer_output?: boolean; // If we should output a buffer.

  protected _cur_line_length: number; // The length of the current line.

  /**
   * The constructor for a LineEncoderStream.
   * @param options the options for the stream.
   */
  public constructor(options: LineEncoderStreamOptions = {}) {
    // Sets the transform stream options.
    super(options.stream);

    // Sets the options, and their default values.
    this._max_line_length = options.max_line_length ?? 76;
    this._encoding = options.encoding ?? "utf-8";
    this._separator = options.separator ?? '\r\n';
    this._buffer_output = options.buffer_output ?? false;

    // If we're not using a buffer output, set the output encoding.
    if (!this._buffer_output) {
      this.setEncoding(this._encoding);
    }

    // Gives the instance variables their default value.
    this._cur_line_length = 0;
  }

  /**
   * Pushes the given slice to the stream.
   * @param buffer the buffer.
   * @param start the start of slice.
   * @param end the end of slice.
   */
  protected _push_buffer(buffer: Buffer, start?: number, end?: number) {
    if (this._buffer_output) {
      // Allocates the buffer, copies the data and pushes it.
      let buffer_copy: Buffer = Buffer.allocUnsafe(buffer.length);
      buffer.copy(buffer_copy, 0, start, end);
      this.push(buffer_copy);

      // Don't write the string version.
      return;
    }

    // Creates the string version of the buffer, and pushes it.
    const buffer_string: string = buffer.toString(this._encoding, start, end);
    this.push(buffer_string);
  }

  /**
   * Pushes the given string onto the stream.
   * @param str the string to push.
   */
  protected _push_string(str: string) {
    if (this._buffer_output) {
      // Pushes the buffer version of the string.
      this.push(Buffer.from(str, this._encoding));

      // Don't write the string version.
      return;
    }

    // Pushes the full string.
    this.push(str);
  }

  /**
   * Turns the given plain text into lines.
   * @param chunk the chunk.
   */
  protected _lines(chunk: Buffer) {
    let chunk_slice_start: number = 0;

    // Stays in loop as long as we've got more data to read.
    while (chunk_slice_start < chunk.length) {
      // Gets the current remainder of the line.
      const cur_line_remaining: number =
        this._max_line_length - this._cur_line_length;

      // Calculates the length of the new line to be added.
      let chunk_slice_len = chunk.length - chunk_slice_start;
      if (chunk_slice_len > cur_line_remaining) {
        chunk_slice_len = cur_line_remaining;
      }

      // Adds the length to the current line length.
      this._cur_line_length += chunk_slice_len;

      // Gets the end position of the substring.
      const plain_substr_end: number =
        chunk_slice_start + this._cur_line_length;

      // Gets the plain substring.
      const chunk_slice: Buffer = chunk.slice(
        chunk_slice_start,
        plain_substr_end
      );

      // Checks if we need to create a new line, and push else just regular push.
      if (this._cur_line_length === this._max_line_length) {
        this._push_buffer(chunk_slice);
        this._push_string(this._separator);
        this._cur_line_length = 0;
      } else {
        this._push_buffer(chunk_slice);
      }

      // Sets the start to the current end.
      chunk_slice_start = plain_substr_end;
    }
  }

  /**
   * Gets called when there is more data to transform.
   * @param chunk the chunk to transform.
   * @param encoding the original encoding of the chunk.
   * @param callback the callback for when done.
   */
  public _write(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ) {
    // Creates the lines from the chunk.
    this._lines(chunk);

    // Calls the callback to tell we're finished.
    callback();
  }

  /**
   * Gets called when the stream is ending, and in this case adds a newline if needed.
   * @param callback the callback for when done.
   */
  public _flush(callback: TransformCallback) {
    // Checks if the current line length is less than the max line length
    //  if so we need to add a line separator (because the line was never finished).
    if (this._cur_line_length < this._max_line_length) {
      this._push_string(this._separator);
      this._cur_line_length = 0;
    }

    // Calls the callback.
    callback();
  }
}
