import {Readable} from "stream";
import {HexEncoderStream} from "../HexEncoderStream";
import {HexDecoderStream} from "../HexDecoderStream";

const data: string = 'Hello World this is a multiline string test, to check if the line encoder works properly... '
  + 'I hope it does ;) since it would prevent more effort.';

const decoder: HexDecoderStream = new HexDecoderStream({
  separator: '<CR><LF>\r\n'
})
decoder.pipe(process.stdout)
decoder.on('end', () => console.log());

const encoder: HexEncoderStream = new HexEncoderStream({
  separator: '<CR><LF>\r\n'
});
encoder.pipe(decoder);

const data_readable: Readable = Readable.from(Buffer.from(data, 'utf-8'));
data_readable.pipe(encoder);
