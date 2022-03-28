import {LineDecoderStream} from "./LineDecoderStream";

export class DotEscapeDecodeStream extends LineDecoderStream {
  /**
   * Gets called when there is a new line to encode.
   * @param line the line to encode.
   */
  public decode(line: Buffer): Buffer {
    // Escapes a dot, making it a double dot.
    if (line.length === 2 && line.at(0) === 46 && line.at(1) === 46) {
      line = Buffer.from([ 46 ]);
    }

    // Returns the encoded line.
    return Buffer.concat([ line, this._separator ])
  }
}