class Validate {
    constructor(options = {}) {
        this.defaults = {
            min: 0,
            max: Infinity,
            symbol: false,
            upper: false,
            lower: false,
            number: false,
            space: false
        };
        this.lowers = "abcdefghijklmnopqrstuvwxyz".split('');
        this.uppers = this.lowers.map(letter => letter.toUpperCase());
        this.numbers = "0123456789".split('');
        this.symbols = `!@#$%^&*()-=_+;:?/"'`.split('');

        this.options = Object.assign({}, this.defaults, options);
        return this;
    }
    valid (password) {
        if (typeof password !== "string") {
            throw new TypeError("Password object passed to 'valid' is not a string!");
        }
        if (this.options.words > 0 && !this.options.hasOwnProperty("separator")) {
            throw new Error("Password cannot validate in word mode without a separator!");
        }
        let verify = {
            symbol: !this.options.symbol,
            upper: !this.options.upper,
            lower: !this.options.lower,
            number: !this.options.number,
            space: !this.options.space,
            min: true,
            max: true
        };
        if (password.length < this.options.min) verify.min = false;
        if (password.length > this.options.max) verify.max = false;
        password.split('').forEach(letter => {
            if (this.uppers.includes(letter)) verify.upper = true;
            else if (this.lowers.includes(letter)) verify.lower = true;
            else if (this.numbers.includes(letter)) verify.number = true;
            else if (this.symbols.includes(letter)) verify.symbol = true;
            else if (letter === " ") verify.space = true;
            else return false;
        });
        return this.check(verify);
    }
    check (object) {
        let bool = true;
        for (const property in object) {
            if (object[property] === false) bool = false;
        }
        return bool;
    }
}

export default Validate;