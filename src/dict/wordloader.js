import fs from "fs";
import zlib from "zlib";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wordlist = {
    size: 0,
    words: [],
    load: load
};

function load(file) {
    let result = new Promise((resolve, reject) => {

        let unzip = zlib.createUnzip();
        let dict = file === undefined ? fs.createReadStream(path.join(__dirname, "dict.txt.gz")) : file;
        let chunks = "";

        dict.pipe(unzip);

        unzip.on("data", data => {
            return chunks += data;
        });

        unzip.on("end", () => {
            let words = chunks.split('\n')
            wordlist.size = words.length;
            wordlist.words = words;
            return resolve(true);
        });

    });
    return result;

}

export default wordlist;