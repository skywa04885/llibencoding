import { Readable } from "stream";
import { QuotedPrintableEncodeStream} from "../QuotedPrintableEncodeStream";

(async function () {
  const dat = `<!DOCTYPE html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><style>.header__top {
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
}

.header__top-left {
    flex: 2;
}

.header__top-left > a > img {
    width: 100%;
}

.header__top-right {
    flex: 4;
}

.header__bottom {
    height: 10px;
    width: 100%;
    display: block;
    background: rgb(255, 12, 12);
    background: -moz-linear-gradient(90deg, rgba(255, 12, 12, 1) 0%, rgba(173, 0, 0, 1) 15%, rgba(113, 0, 0, 1) 38%, rgba(126, 0, 0, 1) 53%, rgba(255, 0, 0, 1) 100%);
    background: -webkit-linear-gradient(90deg, rgba(255, 12, 12, 1) 0%, rgba(173, 0, 0, 1) 15%, rgba(113, 0, 0, 1) 38%, rgba(126, 0, 0, 1) 53%, rgba(255, 0, 0, 1) 100%);
    background: linear-gradient(90deg, rgba(255, 12, 12, 1) 0%, rgba(173, 0, 0, 1) 15%, rgba(113, 0, 0, 1) 38%, rgba(126, 0, 0, 1) 53%, rgba(255, 0, 0, 1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ff0c0c", endColorstr="#ff0000", GradientType=1);
}

.btn {
    padding: 1rem 2rem;
    color: #fff;
    font-size: 0.9rem;
    font-weight: bold;
    background-color: #b80404;
    border-radius: 0.2rem;
}
</style></head><body><header><div class="header__top"><div class="header__top-left"><a href="" title="SysGenesis"><img src="https://iili.io/j5rw5g.png"></a></div><div class="header__top-right"><h1>SysGenesisV4 System Email</h1></div></div><div class="header__bottom"></div></header><div><h1>Your E-Mail address has been set as recovery email address for luke.rieff26@fannst.nl.</h1><p>If this was you, please press the button bellow to <a href="">Verify</a> your recovery email address.</p><p>If this was <em>not</em> you, then press the other button invalidating this recovery email address.</p><hr><div><a class="btn" href="">Verify</a><a class="btn" href="">Undo</a></div></div><div><table><tbody><tr><th>Server</th><td><span>FuckMicrosoftV3</span></td></tr><tr><th>Date</th><td><span>2022-07-05T10:26:38.128Z</span></td></tr></tbody></table></div></body>
`.replace('\n', '\r\n');

  const encode: QuotedPrintableEncodeStream = new QuotedPrintableEncodeStream({
    encoding: 'utf-8'
  });
  
  encode.on('data', () => {})
  Readable.from(dat).pipe(encode);
  
  for await (const chunk of encode) {
    console.log(chunk);
  }
}) ();
