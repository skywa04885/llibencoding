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

export class HexDecoderStream extends LineDecoderStream {
  protected _hex_remainder?: Buffer;

  /**
   * Decodes a single hex line.
   * @param line
   */
  public decode(line: Buffer): Buffer {
    // If there is a current remainder, add it to the line.
    if (this._hex_remainder) {
      line = Buffer.concat([this._hex_remainder, line]);
      this._hex_remainder = undefined;
    }

    // If the number of chars is not a multiple of two, remove the last one to decode
    //  it later.
    if (line.length % 2 !== 0) {
      this._hex_remainder = line.slice(line.length - 1, line.length);
      line = line.slice(0, line.length - 1);
    }

    // Returns the result.
    return Buffer.from(line.toString(this._encoding), "hex");
  }

  /**
   * Gets called when the stream ends.
   * @param callback gets called when we're done.
   */
  public _flush(callback: TransformCallback) {
    if (this._hex_remainder) {
      throw new Error(
        "Invalid HEX data supplied, there MAY not remain a char after decoding."
      );
    }

    super._flush(callback);
  }
}
