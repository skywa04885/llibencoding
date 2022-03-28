import {Readable} from "stream";
import {Base64EncoderStream} from "../Base64EncoderStream";

const data: string = 'Hello World this is a multiline string test, to check if the line encoder works properly... '
  + 'I hope it does ;) since it would prevent more effort.';

const transform: Base64EncoderStream = new Base64EncoderStream({
  separator: '<CR><LF>\r\n',
});
transform.pipe(process.stdout);

const data_readable: Readable = Readable.from(Buffer.from(data, 'utf-8'));
data_readable.pipe(transform);
