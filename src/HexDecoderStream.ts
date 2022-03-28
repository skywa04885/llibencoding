import {LineDecoderStream} from "./LineDecoderStream";
import {TransformCallback} from "stream";

export class HexDecoderStream extends LineDecoderStream {
  protected _hex_remainder?: Buffer;

  /**
   * Decodes a single hex line.
   * @param line
   */
  public decode(line: Buffer): Buffer {
    // If there is a current remainder, add it to the line.
    if (this._hex_remainder) {
      line = Buffer.concat([ this._hex_remainder, line ]);
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
      throw new Error('Invalid HEX data supplied, there MAY not remain a char after decoding.');
    }

    super._flush(callback);
  }
}
