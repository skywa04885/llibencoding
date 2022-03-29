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

import {
  LineEncoderStream,
  LineEncoderStreamOptions,
} from "./LineEncoderStream";
import { TransformCallback } from "stream";

export class Base64EncoderStream extends LineEncoderStream {
  protected _remainder?: Buffer;

  /**
   * Gets called when there is more data to transform.
   * @param chunk the chunk to transform.
   * @param encoding the encoding.
   * @param callback the callback.
   */
  public _write(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ) {
    // Adds the previous remainder to chunk.
    if (this._remainder) {
      chunk = Buffer.concat([this._remainder, chunk]);
      this._remainder = undefined;
    }

    // Gets the number of bytes which will remain after encoding, and
    //  slices the remaining bytes of the chunk, and stores them in the remainder.
    const bytes_remaining: number = chunk.length % 3;
    this._remainder = chunk.slice(chunk.length - bytes_remaining, chunk.length);
    chunk = chunk.slice(0, chunk.length - bytes_remaining);

    // Creates the base64 string of the chunk, and makes the lines.
    this._lines(Buffer.from(chunk.toString("base64"), this._encoding));

    // Calls the callback.
    callback();
  }

  /**
   * Gets called when a stream ends.
   * @param callback the callback for when done.
   */
  public _flush(callback: TransformCallback) {
    // If there is a remainder, write it.
    if (this._remainder) {
      // Creates the lines from the remainder.
      this._lines(
        Buffer.from(this._remainder.toString("base64"), this._encoding)
      );

      // Clears the remainder.
      this._remainder = undefined;
    }

    super._flush(callback);
  }
}
