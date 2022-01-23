import wordlist from "./src/dict/wordloader.js";
import Password from "./src/base/base.js";
import Validate from "./src/valid/validate.js";


class PassJS {
    constructor() {
        this.wordlist = {};
        return this;
    }

    async init(path) {
        let res = await wordlist.load(path);
        this.wordlist = wordlist;
        return res;
    }

    make(options) {
        let password = new Password(this.wordlist, options);
        return password.generate(options.amount);
    }

    validate(password, options) {
        let validate = new Validate(options);
        return validate.valid(password);
    }

}

export default PassJS;