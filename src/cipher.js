/*
 * MIT License
 *
 * Copyright (c) 2022 Joey Parrish
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

// Unamiguous or easily-disambiguated letters and numbers for an alphanumeric
// code.
const CODE_ALPHABET    = 'ACDEFHJKMPQRTWXY0123456789';

// English letters.
const ENGLISH_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Turn similar-looking symbols into their canonical versions in the code
// alphabet.  Helps with codes read aloud or written down.
function normalizeCode(code) {
  return translate(code.toUpperCase(), 'OILZSGBN', '0112568M');
}

// Turn a word (or string of English letters) into a code using the code
// alphabet.  Dashes are inserted to make it easier to read groups of letters.
function wordToCode(word) {
  const code = translate(word.toUpperCase(), ENGLISH_ALPHABET, CODE_ALPHABET);
  return code.replace(/.{4}/g, '$&-').replace(/-$/, '');
}

// Turn a code (with or without dashes) into a word (or string of English
// letters).  Will normalize similar-looking symbols into the correct ones for
// the code alphabet.
function codeToWord(code) {
  code = code.replace(/-/g, '');
  return translate(normalizeCode(code), CODE_ALPHABET, ENGLISH_ALPHABET);
}

// Build a time-based key as a string of 5 English letters.  Used to encrypt a
// secret word to keep it from being recognized in the URL.
function timeBasedKey() {
  // Get 24 bits of arbitrary, random-looking time data.  Take 40 bits of the
  // number of ms since 1970 UTC, then fold the lowest 16 over the top.
  const ms = Date.now();
  // Using bitwise math for the top24 results in a negative number, since "ms"
  // is a floating point number larger than 32 bits.  Instead, divide by 2^16.
  const top24 = Math.floor(ms / 65536);
  const bottom16 = ms & 0xffff;
  // The result here has bits that all change fairly frequently.
  let ts24 = top24 ^ (bottom16 << 8);

  // 5 English letters (26^5) is between 23 and 24 bits of data, so our 24-bit
  // number above can generate 5 random-looking letters.  This is used as a key
  // to obscure the secret word.
  let key = '';
  for (let i = 0; i < 5; ++i) {
    const index = ts24 % ENGLISH_ALPHABET.length;
    ts24 = Math.floor(ts24 / ENGLISH_ALPHABET.length);
    key += ENGLISH_ALPHABET.charAt(index);
  }
  return key;
}

// Normalize an alphanumeric code to disambiguate confusing characters.
// Translate an input string using mapping strings "from" and "to".  Characters
// in the "from" set are mapped to the corresponding "to" characters by
// position.  Characters not in the "from" set are left alone.
function translate(input, from, to) {
  console.assert(from.length === to.length);

  let output = '';
  for (const character of input) {
    const index = from.indexOf(character);
    if (index === -1) {
      output += character;
    } else {
      output += to.charAt(index);
    }
  }
  return output;
}

// Create an encryption/decryption table for a Vigenère cipher based on the
// given key.  Uses the English alphabet.  Not meant to be uncrackable.  In
// fact, anyone who knows how to use a JavaScript console could easily cheat.
// Just meant to make it impossible to accidentally read the secret word in a
// URL or accidentally infer something of the word's structure or distribution.
// https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher
function makeTable(key) {
  const startingLetters = ENGLISH_ALPHABET.split('');

  const table = [];
  for (let i = 0; i < key.length; ++i) {
    table[i] = [];

    const keyIndex = ENGLISH_ALPHABET.indexOf(key.charAt(i));

    // Never re-use this starting letter for another row.
    const startingLetter =
        startingLetters.splice(keyIndex % startingLetters.length, 1)[0];

    const startingLetterIndex = ENGLISH_ALPHABET.indexOf(startingLetter);

    for (let j = 0; j < ENGLISH_ALPHABET.length; ++j) {
      const letterIndex = (startingLetterIndex + j) % ENGLISH_ALPHABET.length;
      table[i][j] = ENGLISH_ALPHABET.charAt(letterIndex);
    }
  }

  return table;
}

// Mix the key and data together in one of two ways (method 0 or 1), to obscure
// which characters are part of the key vs the encrypted secret word.  Again,
// not meant to be unbreakable, just to obscure the relationships and
// distribution from the eyes of honest players.
function mix(key, data, method) {
  let output = '';

  for (let i = 0; i < key.length; ++i) {
    if (method === 0) {
      output += key[(i + 3) % key.length];
      output += data[(key.length - i + 2) % key.length];
    } else {
      output += data[key.length - i - 1];
      output += key[i];
    }
  }

  return output;
}

// The inverse of mix() above.
function unmix(mixed, method) {
  const length = mixed.length / 2;
  let key = '';
  let data = '';

  for (let i = 0; i < length; ++i) {
    // NOTE: These offsets only work for a key length of 5.
    if (method === 0) {
      key += mixed.charAt((4 + i * 2) % mixed.length)
      data += mixed.charAt((mixed.length + 5 - i * 2) % mixed.length);
    } else {
      key += mixed.charAt(1 + i * 2);
      data += mixed.charAt(8 - i * 2);
    }
  }

  return [key, data];
}

// Encrypt a secret word with a Vigenère cipher based on the given key, embed
// the key, then mix it up with mix() to obscure which characters belong to
// what.  If no key is given, generate a time-based key.
function encrypt(word, key = null) {
  if (key === null) {
    key = timeBasedKey();
  }

  const table = makeTable(key);

  let output = '';
  for (let i = 0; i < word.length; ++i) {
    const character = word.charAt(i);
    const index = ENGLISH_ALPHABET.indexOf(character);
    output += table[i][index];
  }

  if (Math.random() > 0.5) {
    output = mix(key, output, 0) + 'O';
  } else {
    output = mix(key, output, 1) + 'L';
  }

  return output;
}

// Extract the mix() method from the block, unscramble the key from the
// encrypted block, then decrypt it with a Vigenère cipher.
function decrypt(encrypted) {
  const mixKey = encrypted.substr(-1);
  encrypted = encrypted.substr(0, encrypted.length - 1);

  const mixMethod = mixKey === 'O' ? 0 : 1;

  const parts = unmix(encrypted, mixMethod);
  const key = parts[0];
  encrypted = parts[1];

  const table = makeTable(key);

  let output = '';
  for (let i = 0; i < encrypted.length; ++i) {
    const character = encrypted.charAt(i);
    const index = table[i].indexOf(character);
    output += ENGLISH_ALPHABET.charAt(index);
  }

  return output;
}

// TODO: move to tests
function testMixMethods() {
  for (const method of [0, 1]) {
    const key = 'ABCDE';
    const data = 'QRSTU';
    const mixed = mix(key, data, method);
    const unmixed = unmix(mixed, method);
    console.log({key, data, mixed, unmixed});
    console.assert(unmixed[0] === key);
    console.assert(unmixed[1] === data);
  }
}

function testEncryption() {
  const word = 'WORDS';
  const encrypted = encrypt(word);
  const code = wordToCode(encrypted);
  const decrypted = decrypt(codeToWord(code));
  console.log({word, encrypted, code, decrypted});
  console.assert(decrypted === word);
}

export {
  encrypt,
  decrypt,
  wordToCode,
  codeToWord,
};
