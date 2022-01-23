class Password {
    constructor(wordlist, options = {}) {
        this.defaults = {
            traditional: false,
            words: 4,
            min: 8,
            symbol: false,
            upper: false,
            lower: false,
            number: false,
            amount: 1,
            space: false,
            separator: "_"
        };
        this.options = Object.assign({}, this.defaults, options);
        this.wordlist = wordlist || {size: 0, words: [], load: function() {}};
        this.lowers = "abcdefghijklmnopqrstuvwxyz".split('');
        this.uppers = this.lowers.map(letter => letter.toUpperCase());
        this.alphas = this.uppers.concat(this.lowers);
        this.numbers = "0123456789".split('');
        this.alphanumeric = this.alphas.concat(this.numbers);
        this.symbols = `!@#$%^&*()-=_+;:?/"'`.split('');
        this.all = this.alphanumeric.concat(this.symbols);
        return this;
    }
    generate(passwords = 1) {
        if (passwords < 1) return undefined;

        let results = [];

        for (let i = 0; i < passwords; i ++) {
            let randSymbol = -1, randNumber = -1, randSpace = -1;
            if (this.options.symbol) randSymbol = this.randInt(0, this.options.min - 1);
            if (this.options.number) {
                randNumber = this.randInt(0, this.options.min - 1);
                while (randNumber === randSymbol) randNumber = this.randInt(0, this.options.min - 1);
            }

            if (this.options.space) {
                randSpace = this.randInt(0, this.options.min - 1);
                while (randSpace === randSymbol || randSpace === randNumber) {
                    randSpace = this.randInt(0, this.options.min - 1);
                }
            }

            let set = [];
            if (this.options.lower) set = set.concat(this.lowers);
            if (this.options.upper) set = set.concat(this.uppers);

            let password = [];
            if (this.options.traditional || this.options.words === 0) {
                for (let j = 0; j < this.options.min; j ++) {
                    if (j === randSymbol) password.push(this.symbols[this.randInt(0, this.symbols.length - 1)]);
                    else if (j === randNumber) password.push(this.numbers[this.randInt(0, this.numbers.length - 1)]);
                    else if (j === randSpace) password.push(" ");
                    else password.push(set[this.randInt(0, set.length - 1)]);
                }
                results.push(password.join(''));
                password = [];
            } else {
                let words = 0;
                while (words < this.options.words) {
                    let rand = this.randInt(0, this.wordlist.size - 1);
                    let word = this.wordlist.words[rand];
                    password.push(word);
                    words++;
                }
                if (this.options.upper) password[0] = password[0][0].toUpperCase() + password[0].slice(1, password[0].length);
                if (this.options.symbol) password[password.length - 1] += this.symbols[this.randInt(0, this.symbols.length - 1)];
                if (this.options.number) password[password.length - 1] += this.numbers[this.randInt(0, this.numbers.length - 1)];
                let spaceWord = this.randInt(0, password.length - 1);
                let spaceChar = this.randInt(1, password[spaceWord].length - 2);
                if (this.options.space) password[spaceWord] = password[spaceWord].slice(0, spaceChar) + " " + password[spaceWord].slice(spaceChar, password[spaceWord].length);
                results.push(password.join(this.options.separator));
            }
        }
        if (results.length === 1) results = results[0];
        return results;
    }

    randInt(min, max) {
        min = Math.ceil(min);;
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

export default Password;