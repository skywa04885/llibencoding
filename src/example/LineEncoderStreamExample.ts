import {LineEncoderStream} from "../LineEncoderStream";
import {Readable} from "stream";

const data: string = 'Hello World this is a multiline string test, to check if the line encoder works properly... '
  + 'I hope it does ;) since it would prevent more effort.';

const transform: LineEncoderStream = new LineEncoderStream({
  separator: '<CR><LF>\r\n'
});
transform.pipe(process.stdout);
transform.on('end', () => console.log());

const data_readable: Readable = Readable.from(Buffer.from(data, 'utf-8'));
data_readable.pipe(transform);
