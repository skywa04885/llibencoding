import { Readable } from "stream";
import { QuotedPrintableEncodeStream} from "../QuotedPrintableEncodeStream";

(async function () {
  const dat = 'J\'interdis aux marchands de vanter trop leurs marchandises. Car ils se fonté vite pédagogues et t\'enseignen comme but cse qui n\'est par essence qu\'un moyen, et te trompant ainsi sur la route à suivre les voilà bientôt qui te dégradent, car si leur musique est vulgaire ils te fabriquent pour te la vendre une âme vulgaire. — Antoine de Saint-Exupéry, Citadelle (1948) sssssssssssasd asd as d \r\n';

  const encode: QuotedPrintableEncodeStream = new QuotedPrintableEncodeStream();
  
  encode.on('data', () => {})
  Readable.from(dat).pipe(encode);
  
  for await (const chunk of encode) {
    console.log(chunk);
  }
}) ();
