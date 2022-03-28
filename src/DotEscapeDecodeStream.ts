import {LineDecoderStream} from "./LineDecoderStream";

export class DotEscapeDecodeStream extends LineDecoderStream {
  /**
   * Gets called when there is a new line to encode.
   * @param line the line to encode.
   */
  public decode(line: string): Buffer {
    // Escapes a dot, making it a double dot.
    if (line === '..') {
      line = '.';
    }

    // Returns the encoded line.
    return Buffer.from(`${line}${this._separator}`, this._output_encoding);
  }
}