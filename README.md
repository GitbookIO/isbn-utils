# isbn-utils

[![NPM version](https://badge.fury.io/js/isbn-utils.svg)](http://badge.fury.io/js/isbn-utils)

Javascript utilities to parse and normalize ISBNs. This module is based on https://code.google.com/p/isbnjs/.

### Installation

```
$ npm install isbn-utils
```

### Usage

```js
var isbn = require('isbn-utils');

var isbn10a = isbn.parse('4873113369');
isbn10a.isIsbn10();                       // true
isbn10a.isIsbn13();                       // false
isbn10a.asIsbn10();                       // 4873113369
isbn10a.asIsbn10(true);                   // 4-87311-336-9
isbn10a.asIsbn13();                       // 9784873113364
isbn10a.asIsbn13(true);                   // 978-4-87311-336-4

var isbn10b = isbn.parse('1-933988-03-7');
isbn10b.isIsbn10();                       // true

var isbn13a = isbn.parse('978-4-87311-336-4');
isbn13a.isIsbn13();                       // true

var isbn13b = isbn.parse('9781590597279');
isbn13b.isIsbn13();                       // true

var foo = isbn.parse('invalid format');   // null
isbn.asIsbn13('4-87311-336-9');           // 9784873113364
isbn.asIsbn10('978-4-87311-336-4', true); // 4-87311-336-9
isbn.hyphenate('9784873113364');          // 978-4-87311-336-4
isbn13a.codes.source;                     // 978-4-87311-336-4
isbn13a.codes.prefix;                     // 978
isbn13a.codes.group;                      // 4
isbn13a.codes.publisher;                  // 87311
isbn13a.codes.article;                    // 336
isbn13a.codes.check;                      // 4
isbn13a.codes.check10;                    // 9
isbn13a.codes.check13;                    // 4
isbn13a.codes.groupname;                  // Japan
```
