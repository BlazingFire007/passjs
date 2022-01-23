import wordlist from "./src/dict/wordloader.js";
import Password from "./src/base/base.js";


class PassJS {
    constructor() {
        this.wordlist = {};
        return this;
    }

    async init(path) {
        let res = await wordlist.load();
        this.wordlist = wordlist;
        return res;
    }

    make(options) {
        return new Password(this.wordlist, options);
    }
}

export default PassJS;