import {LineDecoderStream} from "./LineDecoderStream";
import {TransformCallback} from "stream";

export class Base64DecoderStream extends LineDecoderStream {
  protected _base64_remainder?: string;

  /**
   * Decodes a single base64 line.
   * @param line
   */
  public decode(line: string): Buffer {
    // If there is a current remainder, add it to the line.
    if (this._base64_remainder) {
      line = `${this._base64_remainder}${line}`;
      this._base64_remainder = undefined;
    }

    // Gets the number of chars which will remain after processing.
    const n_remaining: number = line.length % 4;

    // If there are remaining chars, store them in the remainder
    //  and remove them from the line.
    if (n_remaining !== 0) {
      this._base64_remainder = line.substring(line.length - n_remaining, line.length);
      line = line.substring(0, line.length - n_remaining);
    }

    // Returns the result.
    return Buffer.from(line, "base64");
  }

  /**
   * Gets called when the stream ends.
   * @param callback gets called when we're done.
   */
  public _flush(callback: TransformCallback) {
    if (this._base64_remainder) {
      throw new Error('Invalid Base64 data supplied, there MAY not remain a char after decoding, remaining: ' + this._base64_remainder.length);
    }

    super._flush(callback);
  }
}
