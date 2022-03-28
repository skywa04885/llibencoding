import {Transform, TransformCallback, TransformOptions} from "stream";

export interface LineDecoderStreamOptions {
  stream?: TransformOptions,
  separator?: string;
  input_encoding?: BufferEncoding;
  output_encoding?: BufferEncoding;
}

export class LineDecoderStream extends Transform {
  protected _separator: string;
  protected _input_encoding: BufferEncoding;
  protected _output_encoding: BufferEncoding;

  protected _remainder?: string;

  /**
   * Constructs a new LineDecoderStream.
   * @param options the options.
   */
  public constructor(options: LineDecoderStreamOptions) {
    super(options.stream ?? {});

    this._separator = options.separator ?? "\r\n";
    this._input_encoding = options.input_encoding ?? "utf-8";
    this._output_encoding = options.output_encoding ?? "utf-8";
  }

  /**
   * Decodes the given line.
   * @param line the line.
   */
  public decode(line: string): Buffer {
    return Buffer.from(line, this._output_encoding);
  }

  /**
   * Gets called when there is more data to transform.
   * @param chunk the chunk to transform.
   * @param encoding the encoding.
   * @param callback the callback for when done.
   */
  public _write(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    // Creates string version of the chunk.
    let chunk_str: string = chunk.toString(this._input_encoding);

    // Appends the remainder if there.
    if (this._remainder) {
      chunk_str = `${this._remainder}${chunk_str}`;
      this._remainder = undefined;
    }

    // Starts looping over the lines, and decoding them.
    let chunk_substr_start: number = 0;
    while (true) {
      // Gets the end of the substring, in this case the location of the separator.
      //  and if it does not exist, break since we don't have a complete line.
      const chunk_substr_end: number = chunk_str.indexOf(this._separator, chunk_substr_start);
      if (chunk_substr_end === -1) {
        break;
      }

      // Gets the chunk substring, and calls the decoding callback.
      const chunk_substr: string = chunk_str.substring(
        chunk_substr_start,
        chunk_substr_end
      );

      const chunk_decoded: Buffer = this.decode(chunk_substr);

      // Pushes the decoded chunk to the stream.
      this.push(chunk_decoded);

      // Sets the new start of the chunk substring.
      chunk_substr_start = chunk_substr_end + this._separator.length;
    }

    // Creates the remainder if there is a non-complete line.
    if (chunk_substr_start !== chunk_str.length) {
      this._remainder = chunk_str.substring(
        chunk_substr_start,
        chunk_str.length
      );
    }

    // Calls the callback to receive more data.
    callback();
  }

  /**
   * Gets called when the stream ends, and pushes the remainder if there.
   * @param callback the callback to call when done.
   */
  public _flush(callback: TransformCallback) {
    // Checks if there still is a remainder, if so treat it like a line and decode it.
    if (this._remainder) {
      // Decode the remainder.
      const remainder_decoded: Buffer = this.decode(this._remainder);

      // Pushes the decoded remainder to the stream.
      this.push(remainder_decoded);

      // Remove the remainder.
      this._remainder = undefined;
    }

    // Calls the callback.
    callback();
  }
}