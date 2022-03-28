import {Readable} from "stream";
import {HexEncoderStream} from "../HexEncoderStream";
import {HexDecoderStream} from "../HexDecoderStream";
import {Base64DecoderStream} from "../Base64DecoderStream";
import {Base64EncoderStream} from "../Base64EncoderStream";

const data: string = 'Hello World this is a multiline string test, to check if the line encoder works properly... '
  + 'I hope it does ;) since it would prevent more effort.';

const decoder: Base64DecoderStream = new Base64DecoderStream({
  separator: '<CR><LF>\r\n'
})
decoder.pipe(process.stdout)
decoder.on('end', () => console.log());

const encoder: Base64EncoderStream = new Base64EncoderStream({
  separator: '<CR><LF>\r\n'
});
encoder.pipe(decoder);

const data_readable: Readable = Readable.from(Buffer.from(data, 'utf-8'));
data_readable.pipe(encoder);
