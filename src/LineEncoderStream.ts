import { Transform, TransformCallback, TransformOptions } from "stream";

export interface LineEncoderStreamOptions {
  stream?: TransformOptions;
  max_line_length?: number;
  separator?: Buffer | string;
  encoding?: BufferEncoding;
}

export class LineEncoderStream extends Transform {
  protected _max_line_length: number; // The max length for a line.
  protected _encoding: BufferEncoding; // The encoding.
  protected _separator: Buffer; // The line separator.

  protected _cur_line_length: number; // The length of the current line.

  /**
   * The constructor for a LineEncoderStream.
   * @param options the options for the stream.
   */
  public constructor(options: LineEncoderStreamOptions = {}) {
    super(options.stream ?? {});

    this._max_line_length = options.max_line_length ?? 76;
    this._encoding = options.encoding ?? "utf-8";

    let separator: Buffer | string = options.separator ?? "\r\n";
    if (typeof separator === 'string') {
      separator = Buffer.from(separator, this._encoding);
    }
    this._separator = separator;

    this._cur_line_length = 0;
  }

  /**
   * Turns the given plain text into lines.
   * @param chunk the chunk.
   */
  public lines(chunk: Buffer) {
    let chunk_slice_start: number = 0;

    // Stays in loop as long as we've got more data to read.
    while (chunk_slice_start < chunk.length) {
      // Gets the current remainder of the line.
      const cur_line_remaining: number =
        this._max_line_length - this._cur_line_length;

      // Calculates the length of the new line to be added.
      let chunk_slice_len = chunk.length - chunk_slice_start;
      if (chunk_slice_len > cur_line_remaining) {
        chunk_slice_len = cur_line_remaining;
      }

      // Adds the length to the current line length.
      this._cur_line_length += chunk_slice_len;

      // Gets the end position of the substring.
      const plain_substr_end: number =
        chunk_slice_start + this._cur_line_length;

      // Gets the plain substring.
      const chunk_slice: Buffer = chunk.slice(
        chunk_slice_start,
        plain_substr_end
      );

      // Checks if we need to create a new line, and push else just regular push.
      if (this._cur_line_length === this._max_line_length) {
        this.push(
          Buffer.concat([
            chunk_slice,
            this._separator,
          ])
        );
        this._cur_line_length = 0;
      } else {
        this.push(chunk_slice);
      }

      // Sets the start to the current end.
      chunk_slice_start = plain_substr_end;
    }
  }

  /**
   * Gets called when there is more data to transform.
   * @param chunk the chunk to transform.
   * @param encoding the original encoding of the chunk.
   * @param callback the callback for when done.
   */
  public _write(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ) {
    // Creates the lines from the chunk.
    this.lines(chunk);

    // Calls the callback to tell we're finished.
    callback();
  }

  /**
   * Gets called when the stream is ending, and in this case adds a newline if needed.
   * @param callback the callback for when done.
   */
  public _flush(callback: TransformCallback) {
    // Checks if the current line length is less than the max line length
    //  if so we need to add a line separator (because the line was never finished).
    if (this._cur_line_length < this._max_line_length) {
      this.push(this._separator);
      this._cur_line_length = 0;
    }

    // Calls the callback.
    callback();
  }
}
