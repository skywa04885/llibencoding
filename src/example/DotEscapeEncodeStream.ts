import {DotEscapeEncodeStream} from "../DotEscapeEncodeStream";
import {Readable} from "stream";

const data = `From: Some One <someone@example.com>\r
MIME-Version: 1.0\r
Content-Type: multipart/mixed;\r
        boundary="XXXXboundary text"\r
\r
This is a multipart message in MIME format.\r
\r
--XXXXboundary text\r
Content-Type: text/plain\r
\r
this is the body text\r
\r
--XXXXboundary text\r
Content-Type: text/plain;\r
Content-Disposition: attachment;\r
        filename="test.txt"\r
\r
.\r
.\r
.\r
this is the attachment text\r
\r
--XXXXboundary text--\r
`;

const dotEscapeEncodeStream: DotEscapeEncodeStream = new DotEscapeEncodeStream({
        buffer_output: false,
        encoding: 'utf-8'
});
const readable: Readable = Readable.from(data);
readable.pipe(dotEscapeEncodeStream);

(async function () {
        for await (const chunk of dotEscapeEncodeStream) {
                console.log(chunk)
        };
}) ();