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

import { LineDecoderStream } from "./LineDecoderStream";
import { TransformCallback } from "stream";

export class Base64DecoderStream extends LineDecoderStream {
  protected _base64_remainder?: Buffer;

  /**
   * Decodes a single base64 buffer.
   * @param buffer
   */
  protected _decode(buffer: Buffer): void {
    // If there is a current remainder, add it to the line.
    if (this._base64_remainder) {
      buffer = Buffer.concat([this._base64_remainder, buffer]);
      this._base64_remainder = undefined;
    }

    // Gets the number of chars which will remain after processing.
    const n_remaining: number = buffer.length % 4;

    // If there are remaining chars, store them in the remainder
    //  and remove them from the line.
    if (n_remaining !== 0) {
      this._base64_remainder = buffer.slice(
        buffer.length - n_remaining,
        buffer.length
      );
      buffer = buffer.slice(0, buffer.length - n_remaining);
    }

    // Returns the result.
    this._push_buffer(Buffer.from(buffer.toString(this._encoding), "base64"));
  }

  /**
   * Gets called when the stream ends.
   * @param callback gets called when we're done.
   */
  public _flush(callback: TransformCallback) {
    if (this._base64_remainder) {
      throw new Error(
        "Invalid Base64 data supplied, there MAY not remain a char after decoding, remaining: " +
          this._base64_remainder.length
      );
    }

    super._flush(callback);
  }
}
