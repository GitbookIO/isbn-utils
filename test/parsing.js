var isbn = require('../');
var should = require('should');

var isbn10a = isbn.parse('4873113369');
var isbn10b = isbn.parse('1933988037');
var isbn13a = isbn.parse('978-4-87311-336-4');
var isbn13b = isbn.parse('9781590597279');
var isbn13c = isbn.parse('9791091146135')

describe('isbn.parse', function () {

    it('should return null for invalid ISBNs', function() {
        should(isbn.parse('')).not.be.ok;
        should(isbn.parse('invalid-isbn')).not.be.ok;
        should(isbn.parse('0-00-000-0')).not.be.ok;
        should(isbn.parse('0-00000-0000-0')).not.be.ok;
        should(isbn.parse('00000000000000000')).not.be.ok;
    });

    it('should return a ISBN instance for valid isbn10a', function() {
        isbn.parse('4873113369').should.be.ok;
    });

    it('should return a ISBN instance for valid isbn10b', function() {
        isbn.parse('1933988037').should.be.ok;
    });

    it('should return a ISBN instance for valid isbn13a', function() {
        isbn.parse('978-4-87311-336-4').should.be.ok;
    });

    it('should return a ISBN instance for valid isbn13b', function() {
        isbn.parse('9781590597279').should.be.ok;
    });

});

describe('isbn.asIsbn10 and isbn.isIsbn10', function () {

    it('should correctly convert from isbn10a', function() {
        isbn10a.isIsbn10().should.be.ok;
        isbn10a.asIsbn10().should.be.exactly('4873113369');
        isbn10a.asIsbn10(true).should.be.exactly('4-87311-336-9');
    });

    it('should correctly convert from isbn10b', function() {
        isbn10b.isIsbn10().should.be.ok;
        isbn10b.asIsbn10().should.be.exactly('1933988037');
        isbn10b.asIsbn10(true).should.be.exactly('1-933988-03-7');
    });

    it('should correctly convert from isbn13a', function() {
        isbn13a.asIsbn10().should.be.exactly('4873113369');
        isbn13a.asIsbn10(true).should.be.exactly('4-87311-336-9');
    });

    it('should correctly convert from isbn13b', function() {
        isbn13b.asIsbn10().should.be.exactly('1590597273');
        isbn13b.asIsbn10(true).should.be.exactly('1-59059-727-3');
    });

});

describe('isbn.asIsbn13 and isbn.isIsbn13', function () {

    it('should correctly convert from isbn10a', function() {
        isbn10a.asIsbn13().should.be.exactly('9784873113364');
        isbn10a.asIsbn13(true).should.be.exactly('978-4-87311-336-4');
    });

    it('should correctly convert from isbn10b', function() {
        isbn10b.asIsbn13().should.be.exactly('9781933988030');
        isbn10b.asIsbn13(true).should.be.exactly('978-1-933988-03-0');
    });

    it('should correctly convert from isbn13a', function() {
        isbn13a.isIsbn13().should.be.ok;
        isbn13a.asIsbn13().should.be.exactly('9784873113364');
        isbn13a.asIsbn13(true).should.be.exactly('978-4-87311-336-4');
    });

    it('should correctly convert from isbn13b', function() {
        isbn13b.isIsbn13().should.be.ok;
        isbn13b.asIsbn13().should.be.exactly('9781590597279');
        isbn13b.asIsbn13(true).should.be.exactly('978-1-59059-727-9');
    });

    it('should correctly convert an isbn starting with 979', function() {
        isbn13c.isIsbn13().should.be.ok;
        isbn13c.asIsbn13().should.be.exactly('9791091146135');
        isbn13c.asIsbn13(true).should.be.exactly('979-10-91146-13-5');
    });
});

describe('isbn.isValid', function () {

    it('should return false for invalid ISBNs', function() {
        should(isbn.isValid('')).be.exactly(false);
        should(isbn.isValid('invalid-isbn')).be.exactly(false);
    });

});
