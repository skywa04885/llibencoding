import {Transform, TransformCallback, TransformOptions} from "stream";

/**
 * Checks if the given byte needs to be encoded.
 * @param byte the byte to possibly encode.
 */
export function quoted_printable_should_encode(byte: number): boolean {
  return !((byte > 33 && byte < 126 && byte !== 61) || byte === 9 || byte === 32);
}

/**
 * Encodes the given byte for quoted printable.
 * @param byte the byte to encode.
 */
export function quoted_printable_encode_byte(byte: number) {
  return `=${byte.toString(16)}`;
}

export interface QuotedPrintableEncoderStreamOptions {
  stream?: TransformOptions;
  max_line_length?: number;
  encoding?: BufferEncoding;
  separator?: string;
}

export class QuotedPrintableEncoderStream extends Transform {
  protected _max_line_length: number;
  protected encoding: BufferEncoding;
  protected _separator: string;

  protected _line_remainder?: Buffer;

  public constructor(options: QuotedPrintableEncoderStreamOptions = {}) {
    super(options.stream ?? {});

    this._max_line_length = options.max_line_length ?? 76;
    this.encoding = options.encoding ?? 'utf-8';
    this._separator = options.separator ?? '\r\n';
  }

  public encode_line(line: Buffer) {
    let cur_line: Buffer = Buffer.alloc(this._max_line_length + this._separator.length);
    let cur_line_offset: number = 0;

    const soft_line_break = () => {
      // Gets the line break string we're going to add.
      const line_break: string = `=${this._separator}`;

      // Adds the line break to the line.
      cur_line.write(line_break, cur_line_offset);
      cur_line_offset += line_break.length;

      // Writes the line.
      this.push(cur_line.slice(0, cur_line_offset));

      // Sets the offset to zero, since we're starting a new line.
      cur_line_offset = 0;
    }

    let index = 0;
    for (const byte of line) {
      // Gets the available size in the current line.
      const cur_line_available: number = this._max_line_length - cur_line_offset;

      // Checks if the current byte has to be encoded, and how much space it would take up in the
      //  buffer, so we can decide if we need to make a new line or not.
      const should_encode: boolean = quoted_printable_should_encode(byte) || (index + 1 === line.length);
      const required_size: number = should_encode ? 3 : 1;

      // Checks if we need to create a soft line break, this might be needed if it doesn't
      //  fit in the current line anymore.
      if (required_size >= cur_line_available) {
        soft_line_break();
      }

      // Now since we're either in a new line, or it just fits, add the char/char(s).
      if (should_encode) {
        // Encodes the byte, writes it to the buffer and increases the offset.
        const encoded: string = quoted_printable_encode_byte(byte);
        cur_line.write(encoded, cur_line_offset);
        cur_line_offset += encoded.length;
      } else {
        // Puts the byte in the buffer, and increases the offset (by one).
        cur_line.writeUint8(byte, cur_line_offset);
        ++cur_line_offset;
      }

      // Increments the index.
      ++index;
    }

    // Checks if there is any remaining data in the buffer, if so just push it, it already is encoded proprely.
    if (cur_line_offset > 0) {
      // Writes the newline to the buffer, and increases the offste.
      cur_line.write(this._separator, cur_line_offset);
      cur_line_offset += this._separator.length;

      // Pushes the buffer.
      this.push(cur_line.slice(0, cur_line_offset));
    }
  }

  public _write(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ) {
    // If there is a remainder, add it.
    if (this._line_remainder) {
      chunk = Buffer.concat([ this._line_remainder, chunk ]);
      this._line_remainder = undefined;
    }

    // Starts looping over the lines, and encodes them.
    let chunk_slice_start: number = 0;
    while (true) {
      // Gets the end of the substring, in this case the location of the separator.
      //  and if it does not exist, break since we don't have a complete line.
      const chunk_slice_end: number = chunk.indexOf(this._separator, chunk_slice_start, this.encoding);
      if (chunk_slice_end === -1) {
        break;
      }

      // Gets the line.
      const line: Buffer = chunk.slice(
        chunk_slice_start,
        chunk_slice_end
      );

      // Encodes the line.
      this.encode_line(line);

      // Sets the new start of the chunk substring.
      chunk_slice_start = chunk_slice_end + this._separator.length;
    }

    // Creates the remainder if there is a non-complete line.
    if (chunk_slice_start !== chunk.length) {
      this._line_remainder = chunk.slice(
        chunk_slice_start,
        chunk.length
      );
    }

    // Calls the callback.
    callback();
  }

  /**
   * Gets called when the stream ends, and pushes the remainder if there.
   * @param callback the callback to call when done.
   */
  public _flush(callback: TransformCallback) {
    // Checks if there still is a remainder, if so treat it like a line and decode it.
    if (this._line_remainder) {
      // Encodes the remainder.
      this.encode_line(this._line_remainder);

      // Remove the remainder.
      this._line_remainder = undefined;
    }

    // Calls the callback.
    callback();
  }
}