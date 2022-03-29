import { describe, it } from 'mocha';
import assert from "assert";
import { QuotedPrintableEncodeStream, quoted_printable_encode_byte, quoted_printable_should_encode } from "../QuotedPrintableEncodeStream";
import { Readable } from 'stream';

describe('QuotedPrintable', function () {
  describe('quoted_printable_encode_char', function () {
    it('should give \'=20\' for a space char.', function () {
      assert.equal(quoted_printable_encode_byte(' '.charCodeAt(0)), '=20');
    });
  });

  describe('quoted_printable_should_encode', function () {
    it('shouldn\'t encode ASCII Range 33 - 126 (except for 61', function () {
      for (let i = 34; i < 126; ++i) {
        if (i === 61) {
          assert.equal(quoted_printable_should_encode(i), true);
          continue;
        }

        assert.equal(quoted_printable_should_encode(i), false);
      }
    });

    it('shouldn\'t encode whitespace such as tab\'s and spaces.', function () {
      assert.equal(quoted_printable_should_encode('\t'.charCodeAt(0)), false);
      assert.equal(quoted_printable_should_encode(' '.charCodeAt(0)), false);
    });
  });

  describe('QuotedPrintableEncoderStream', function () {
    it('Should encode the whitespace at the end of a line', async function () {
      const data: string = 'Hello world! This is a test ';
      const expected: string = 'Hello world=21 This is a test=20\r\n';
      let stream: QuotedPrintableEncodeStream = new QuotedPrintableEncodeStream();

      let concat: string = '';
      for await (const chunk of Readable.from(data).pipe(stream)) {
        concat += chunk;
      }

      assert.equal(concat, expected);
    })

    it('Should keep ALL lines shorter or equal to the max line length (76 for now)', async function () {
      const max_line_length: number = 76;
      const data: string = `Parce que par disruptif. Et paf le chien elle ouais rester évidemment quand même aussi car pas quand même.\r
Putain meilleur avoir manger pendant dans l'cul monde apéro devoir du coup du coup. Du son voila fromage passer car à la. \r
Disruptif celui omelette grève à la. Ouais guillotine devoir disruptif heure du coup dernier boulangerie boulangerie saucisson notre du coup du coup le croissant. Saucisson manger vin si parce que. Faire dans l'cul.\r
Dire du coup mon et paf le chien pour guillotine saucisson fais chier. Temps vin bière on baguette bien meilleur prendre frenchtech. Comme même comme même baguette du coup. Vin fais chier pas saucisson.\r`;
      let stream: QuotedPrintableEncodeStream = new QuotedPrintableEncodeStream({
        max_line_length
      });

      let concat: string = '';
      for await (const chunk of Readable.from(data).pipe(stream)) {
        concat += chunk;
      }

      let splitted: string[] = concat.split('\r\n');
      splitted.pop();

      let line_length: number = 0;
      splitted.forEach((line: string): void => {
        line_length = Math.max(line_length, line.length);
      });

      assert.equal(line_length <= max_line_length, true);
    });

    it('Should soft wrap lines.', async function () {
      const data: string = 'Parce que par disruptif. Et paf le chien elle ouais rester évidemment quand même aussi car pas quand même. Parce que par disruptif. Et paf le chien elle ouais rester évidemment quand même aussi car pas quand même.';
      let stream: QuotedPrintableEncodeStream = new QuotedPrintableEncodeStream();

      let concat: string = '';
      for await (const chunk of Readable.from(data).pipe(stream)) {
        concat += chunk;
      }

      let splitted: string[] = concat.split('\r\n');
      splitted.pop();

      splitted.forEach((value: string, index: number) => {
        assert.equal(value.endsWith('='), index + 1 < splitted.length);
      });
    })
  });
});