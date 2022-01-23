import fs from "fs";
import zlib from "zlib";
import path from "path";
import stream from "stream";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wordlist = {
    size: 0,
    words: [],
    load: load
};

function load(file) {
    /*
    A special thanks to kevva and catdad for making such a neat project!
    https://github.com/kevva/is-gzip/blob/master/index.js
    https://github.com/catdad/is-gzip-stream/blob/master/index.js

    Without these, this lib would ONLY support GZIP dictionaries!

        MIT License
        Copyright (c) Kevin Mårtensson <kevinmartensson@gmail.com> (github.com/kevva)

        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    */
    let result = new Promise((resolve, reject) => {

        let unzip = zlib.createUnzip();
        let dict = file === undefined ? fs.createReadStream(path.join(__dirname, "dict.txt.gz")) : fs.createReadStream(file);
        let rawBuff = [];
        const bufStream = new stream.Readable();
        let chunks = "";
        let gzip = false;

        dict.on("data", data => {
            if (gzip) return bufStream.push(data);
            rawBuff.push(data);
            let all = Buffer.concat(rawBuff);
            if (all.length >= 3) {
                if (all[0] === 0x1F && all[1] === 0x8B && all[2] === 0x08) {
                    bufStream.pipe(unzip);
                    gzip = true;
                    bufStream._read = () => {}
                    bufStream.push(all);
                }
            }
        });

        dict.on("end", () => {
            if (gzip) {
                bufStream.push(null);
                return false;
            }
            let words = rawBuff.map(b => b.toString());
            words = words.join('').split('\n').map(word => word.trimEnd());
            wordlist.size = words.length;
            wordlist.words = words;
            return resolve(true);
        });

        unzip.on("data", data => {
            return chunks += data;
        });

        unzip.on("end", () => {
            let words = chunks.toString().split('\n').map(word => word.trimEnd());
            wordlist.size = words.length;
            wordlist.words = words;
            return resolve(true);
        });

    });
    return result;

}

export default wordlist;