import {LineEncoderStream, LineEncoderStreamOptions} from "./LineEncoderStream";
import {TransformCallback} from "stream";

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
    const base64_chunk: string = chunk.toString("base64");
    this.lines(base64_chunk);

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
      // Creates the base64 remainder, and creates the lines.
      const base64_remainder: string = this._remainder.toString("base64");
      this.lines(base64_remainder);

      // Clears the remainder.
      this._remainder = undefined;
    }

    super._flush(callback);
  }
}