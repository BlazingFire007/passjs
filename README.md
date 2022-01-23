# PassJS
A complete Node.js password generator.

- [PassJS](#passjs)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Word generator mode:](#word-generator-mode)
    - ["Traditional" mode:](#traditional-mode)
  - [Examples:](#examples)
    - [Word generator:](#word-generator)
    - [Traditional:](#traditional)
- [Using a custom dictionary](#using-a-custom-dictionary)
- [PassJS Validator](#passjs-validator)
  - [Usage](#usage-1)
- [Options](#options)
  - [`.make(<options>)`](#makeoptions)
    - [`traditional` - default: `false`](#traditional---default-false)
    - [`min` - default: `8`](#min---default-8)
    - [`words` - default: `4`](#words---default-4)
    - [`separator` - default: `_`](#separator---default-_)
    - [`lower` - default: `false`](#lower---default-false)
    - [`upper` - default: `false`](#upper---default-false)
    - [`number` - default: `false`](#number---default-false)
    - [`symbol` - default: `false`](#symbol---default-false)
    - [`space` - default: `false`](#space---default-false)
    - [`amount` - default: `1`](#amount---default-1)
  - [Validation Options](#validation-options)



## Installation
```sh
npm i passjs
```
## Usage
### Word generator mode:

---

**Note:**
`await` or `.then` is _**only**_ needed for loading the dictionary for word generator mode

---

**With `await`**
```js
import PassJS from "passjs";

const password = new PassJS();

await password.init();
console.log(password.make(options));
```
**With `.then`**
```js
import PassJS from "./index.js";

const password = new PassJS();

password.init().then(() =>
    console.log(password.make(options))
    );

```
### "Traditional" mode:
```js
import PassJS from "passjs";

const options = {traditional: true};
const password = new PassJS();

console.log(password.make(options));
```
## Examples:
### Word generator:
```js
import PassJS from "passjs";
const password = new PassJS();
await password.init();
console.log(password.make({
    words: 3,
    separator: "-",
    amount: 2
}));
```
Output:
```js
[ 'jesuits-chest-hope', 'split-earring-bury' ]
```
### Traditional:
```js
import PassJS from "passjs";
const password = new PassJS();
console.log(password.make({
    traditional: true,
    min: 8,
    lower: true,
    upper: true,
    number: true,
    symbol: true,
    amount: 2
}));
```
Output:
```js
[ 'J*SH7ObM', 'eb%fhbl1' ]
```

# Using a custom dictionary

`PassJS` comes preinstalled with a GZIP'd dictionary of [popular.txt](https://github.com/dolph/dictionary) (words < 4 characters are removed).

`PassJS` can load a custom dictionary file, with each word separated by a newline `\n`

The dictionary file must be either **plaintext** or **GZIP**.
I recommend GZIPing any large dictionaries to save space.

Creating a GZIP:
```js
import { createGzip } from "zlib";
import fs from "fs";

const gzip = createGzip();
/*
uppers.txt.gz:
A
B
C
D
.
.
.
Z
*/

const read = fs.createReadStream("./uppers.txt");
const write = fs.createWriteStream("./uppers.txt.gz");

read.pipe(gzip).pipe(write);
// Creates "./uppers.txt.gz"
```

```js
import PassJS from "passjs";

const password = new PassJS();
await password.init("./uppers.txt");
// OR: "./uppers.txt.gz"
console.log(password.make({
    words: 4,
    amount: 2,
    separator: "-"
}));

```
Example output:
```js
[ 'O_H_E_V', 'L_Z_P_Q' ]
```

# PassJS Validator
`PassJS` comes with a password validator.

## Usage
```js
import PassJS from "passjs";

const password = new PassJS();
const options = {
    number: true,
    lower: true,
    min: 4
}
password.validate("h3llo-world-maker", options);
// true
password.validate("hello-word-maker", options);
// false
```
# Options
## `.make(<options>)`
### `traditional` - default: `false`
```js
/*
Enables traditional mode.
Generates a password of specified min value.

Note: you can also set the words property to 0 for traditional mode.
*/
password.make({
    traditional: true
});
// Example value: "lnzdi9fp"
```
### `min` - default: `8`
```js
/*
Resulting password length.

Note: only applied in traditional mode.
*/
password.make({
    traditional: true, 
    lower: true
    min: 30
});
// Example value: "aoajuovysrtxhuubdfsuvqxciwzymp"
```
### `words` - default: `4`
```js
/*
Specifies the number of words in resulting password.

Note: you can also set the words property to 0 for traditional mode.
*/
password.make({
    words: 2
});
// Example value: "himself_depending"
```
### `separator` - default: `_`
```js
/*
Set the separator for word mode.
Ex: If value is set to `!` result would be `<word>!<word>`

Note: ignored in traditional mode.
*/
password.make({
    separator: "!"
});
// Example value: "single!crashed!seats!unhand"
```
### `lower` - default: `false`
```js
/*
Allows lowercase characters.

Note: ignored in word mode.
*/
password.make({
    lower: false,
    upper: true
});
// Example value: "TGJLFRSZ"
```
### `upper` - default: `false`
```js
/*
Allows uppercase characters.

Note: in word mode, this will capitalize the first letter of the first word.
*/
password.make({
    traditional: true,
    upper: true,
    number: true
});
// Example value: "Q0VOBLIY"
password.make({
    words: 3,
    upper: true
});
// Example value: "Breakwater_canary_racial"
```
### `number` - default: `false`
```js
/*
Inserts a number into a random position in the password.

Note: in word mode, this appends a number to the end of the last word.
*/
password.make({
    traditional: true,
    lower: true,
    number: true
});
// Example value: "4aihgnyl"
password.make({
    words: 2,
    number: true
});
// Example value: "buster_snacks5"
```
### `symbol` - default: `false`
```js
/*
Inserts a symbol into a random position in the password.

Note: in word mode, this appends a symbol to the end of the last word.
*/
password.make({
    traditional: true,
    lower: true,
    symbol: true
});
// Example value: "fpbcc^fj"
password.make({
    words: 2,
    symbol: true
});
// Example value: "accusation_infantile&"
```
### `space` - default: `false`
```js
/*
Inserts a space into a random position in the password.

Note: in word mode, this adds a space to a random word.
*/
password.make({
    words: 0,
    lower: true,
    space: true
});
// Example value: "ctxow ng"
password.make({
    words: 3,
    space: true
});
// Example value: "counselors_headlines_vit al"
```
### `amount` - default: `1`
```js
/*
The amount of passwords to output.
*/
password.make({
    words: 2,
    amount: 2
});
// Example value: [ 'railroad_unintelligible', 'embarrass_claimed' ]
password.make({
    words: 0,
    amount: 2,
    lower: true
});
// Example value: [ 'cuzwxpin', 'lcxalhsa' ]
```
## Validation Options

---

***The validator has the following boolean options:***
- `symbol` - default: `false`
- `upper` - default: `false`
- `lower` - default: `false`
- `number` - default: `false`
- `space` - default: `false`

If enabled, it will return `true` if it is found at least once within the password.

***The validator has the following numerical options:***
- `max` - default: `Infinity`
- `min` - default: `0`

If specified, the validator will return `true` if it is within the boundries.