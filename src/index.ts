import { LineEncoderStream as _LineEncoderStream } from "./LineEncoderStream";
import { Base64EncoderStream as _Base64EncoderStream } from './Base64EncoderStream';
import { HexEncoderStream as _HexEncoderStream } from './HexEncoderStream';
import { DotEscapeEncodeStream as _DotEscapeEncodeStream } from './DotEscapeEncodeStream';
import { QuotedPrintableEncoderStream as _QuotedPrintableEncoderStream } from './QuoatedPrintableEncoderStream';
import { LineDecoderStream as _LineDecoderStream } from "./LineDecoderStream";
import { HexDecoderStream as _HexDecoderStream } from "./HexDecoderStream";
import { Base64DecoderStream as _Base64DecoderStream } from "./Base64DecoderStream";
import { DotEscapeDecodeStream as _DotEscapeDecodeStream } from "./DotEscapeDecodeStream";

export namespace llibencoding {
    export type LineEncoderStream = _LineEncoderStream;
    export const LineEncoderStream = _LineEncoderStream;

    export type Base64EncoderStream = _Base64EncoderStream;
    export const Base64EncoderStream = _Base64EncoderStream;

    export type HexEncoderStream = _HexEncoderStream;
    export const HexEncoderStream = _HexEncoderStream;

    export type DotEscapeEncodeStream = _DotEscapeEncodeStream;
    export const DotEscapeEncodeStream = _DotEscapeEncodeStream;

    export type QuotedPrintableEncoderStream = _QuotedPrintableEncoderStream;
    export const QuotedPrintableEncoderStream = _QuotedPrintableEncoderStream;

    export type LineDecoderStream = _LineDecoderStream;
    export const LineDecoderStream =_LineDecoderStream;

    export type HexDecoderStream = _HexDecoderStream;
    export const HexDecoderStream = _HexDecoderStream;

    export type Base64DecoderStream = _Base64DecoderStream;
    export const Base64DecoderStream = _Base64DecoderStream;
    
    export type DotEscapeDecodeStream = _DotEscapeDecodeStream;
    export const DotEscapeDecodeStream = _DotEscapeDecodeStream;
}