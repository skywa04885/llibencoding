import { describe, it } from 'mocha';
import assert from "assert";
import {quoted_printable_encode_byte} from "../QuoatedPrintableEncoderStream";

describe('QuotedPrintable', function () {
  describe('quoted_printable_encode_char', function () {
    it('should give \'=20\' for a space char.', function () {
      assert.equal(quoted_printable_encode_byte(' '.charCodeAt(0)), '=20');
    });
  });
});