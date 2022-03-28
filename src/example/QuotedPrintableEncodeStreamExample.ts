import { QuotedPrintableEncoderStream} from "../QuoatedPrintableEncoderStream";

const dat = 'J\'interdis aux marchands de vanter trop leurs marchandises. Car ils se fonté vite pédagogues et t\'enseignen comme but cse qui n\'est par essence qu\'un moyen, et te trompant ainsi sur la route à suivre les voilà bientôt qui te dégradent, car si leur musique est vulgaire ils te fabriquent pour te la vendre une âme vulgaire. — Antoine de Saint-Exupéry, Citadelle (1948) sssssssssssasd asd as d \r\n';

const encode: QuotedPrintableEncoderStream = new QuotedPrintableEncoderStream();

encode.on('data', () => {})
encode.on('end', () => console.log());

let i = 0;
function a() {
  if (i++ % 100 ==0) {
    console.log(i);
  }
  encode.write(dat, a);
}

a()

