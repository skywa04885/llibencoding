# llibencoding (Luke's Encoding Library)

#### Introduction

Luke's encoding library contains many stream implementations for specific types of encoding, most libraries these days
only have one type of encoding, or don't use streams so I decided to create one myself because I need it for some of my
projects.

#### Supported formats

1. Line (Wraps the data into lines, used by other formats)
2. Base64
3. Hex
4. QuotedPrintable
5. Dot Escaping (SMTP/POP3)

#### Usage Example

```ts
import {Readable} from 'stream';
import {Base64EncoderStream} from "llibencoding/dist/Base64EncoderStream";
import {Base64DecoderStream} from "llibencoding/dist/Base64DecoderStream";

const message: string = 'Hello World! A simple multi-line message, with quite some data so it will wrap for sure!';

const encoder: Base64EncoderStream = new Base64EncoderStream();
const decoder: Base64DecoderStream = new Base64DecoderStream();

let encoded: string = '';
let decoded: string = '';

encoder.on('data', (chunk: Buffer): void => {
  encoded += chunk.toString('utf-8');
});

decoder.on('data', (chunk: Buffer): void => {
  decoded += chunk.toString('utf-8');
});

encoder.pipe(decoder); // Decodes everything that get's encoded.

const readable: Readable = Readable.from(Buffer.from(message, 'utf-8'));
readable.pipe(encoder);

```