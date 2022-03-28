import {LineEncoderStream, LineEncoderStreamOptions} from "./LineEncoderStream";
import {TransformCallback} from "stream";

export class HexEncoderStream extends LineEncoderStream {
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
    // Creates the hex string of the chunk, and makes the lines.
    const hex_chunk: string = chunk.toString("hex");
    this.lines(hex_chunk);

    // Calls the callback.
    callback();
  }
}