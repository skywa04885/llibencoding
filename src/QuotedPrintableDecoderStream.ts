import {LineDecoderStream} from "./LineDecoderStream";

export class QuotedPrintableDecoderStream extends LineDecoderStream {
  decode(line: string): Buffer {
    return super.decode(line);
  }
}