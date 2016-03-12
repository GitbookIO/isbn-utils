var GROUPS = require('./groups');

var ISBN = function (val, groups) {
    this.groups = groups;
    this.codes = this.parse(val);
}

ISBN.prototype = {
    isValid: function() {
        return this.codes && this.codes.isValid;
    },

    isIsbn13: function() {
        return this.isValid() && this.codes.isIsbn13;
    },

    isIsbn10: function() {
        return this.isValid() && this.codes.isIsbn10;
    },

    asIsbn10: function(hyphen) {
        return this.isValid() ? hyphen ? this.codes.isbn10h : this.codes.isbn10 : null;
    },

    asIsbn13: function(hyphen) {
        return this.isValid() ? hyphen ? this.codes.isbn13h : this.codes.isbn13 : null;
    },

    merge: function(lobj, robj) {
        var key;
        if (!lobj || !robj) {
            return null;
        }
        for (key in robj) {
            if (robj.hasOwnProperty(key)) {
                lobj[key] = robj[key];
            }
        }
        return lobj;
    },

    parse: function(val) {
        var ret;

        // coerce ISBN to string
        val += '';

        // correct for misplaced hyphens
        // val = val.replace(/ -/,'');
        ret =
            val.match(/^\d{9}[\dX]$/) ?
                this.fill(
                    this.merge({source: val, isValid: true, isIsbn10: true, isIsbn13: false}, this.split(val))) :
            val.length === 13 && val.match(/^(\d+)-(\d+)-(\d+)-([\dX])$/) ?
                this.fill({
                    source: val, isValid: true, isIsbn10: true, isIsbn13: false, group: RegExp.$1, publisher: RegExp.$2,
                    article: RegExp.$3, check: RegExp.$4}) :
            val.match(/^(978|979)(\d{9}[\dX]$)/) ?
                this.fill(
                    this.merge({source: val, isValid: true, isIsbn10: false, isIsbn13: true, prefix: RegExp.$1},
                    this.split(RegExp.$1 + RegExp.$2))) :
            val.length === 17 && val.match(/^(978|979)-(\d+)-(\d+)-(\d+)-([\dX])$/) ?
                this.fill({
                    source: val, isValid: true, isIsbn10: false, isIsbn13: true, prefix: RegExp.$1, group: RegExp.$2,
                    publisher: RegExp.$3, article: RegExp.$4, check: RegExp.$5}) :
                null;

        if (!ret) {
            return {source: val, isValid: false};
        }

        return this.merge(ret, {isValid: ret.check === (ret.isIsbn13 ? ret.check13 : ret.check10)});
    },

    split: function(isbn) {
        if (isbn) {
            if (isbn.length === 10) {
                isbn = '978' + isbn;
            }

            if (isbn.length === 13) {
                return this.splitToObject(isbn);
            }
        }

        return null;
    },

    splitToArray: function(isbn13) {
        var rec, key, rest, i, m;
        rec = this.getGroupRecord(isbn13);
        if (!rec) {
            return null;
        }

        for (key, i = 0, m = rec.record.ranges.length; i < m; i += 1) {
            key = rec.rest.substr(0, rec.record.ranges[i][0].length);
            if (rec.record.ranges[i][0] <= key && rec.record.ranges[i][1] >= key) {
                rest = rec.rest.substr(key.length);
                return [rec.group, key, rest.substr(0, rest.length - 1), rest.charAt(rest.length - 1)];
            }
        }
        return null;
    },

    splitToObject: function(isbn13) {
        var a = this.splitToArray(isbn13);
        if (!a || a.length !== 4) {
            return null;
        }
        return {group: a[0], publisher: a[1], article: a[2], check: a[3]};
    },

    fill: function(codes) {
        var rec, prefix, ck10, ck13, parts13, parts10;

        if (!codes) {
            return null;
        }

        prefix = codes.prefix ? codes.prefix : '978';

        rec = this.groups[prefix + '-' + codes.group];
        if (!rec) {
            return null;
        }

        ck10 = this.calcCheckDigit([
            codes.group, codes.publisher, codes.article].join(''));
        if (!ck10) {
            return null;
        }

        ck13 = this.calcCheckDigit([prefix, codes.group, codes.publisher, codes.article].join(''));
        if (!ck13) {
            return null;
        }

        parts13 = [prefix, codes.group, codes.publisher, codes.article, ck13];
        this.merge(codes, {
            isbn13: parts13.join(''),
            isbn13h: parts13.join('-'),
            check10: ck10,
            check13: ck13,
            groupname: rec.name
        });

        if (prefix === '978') {
            parts10 = [codes.group, codes.publisher, codes.article, ck10];
            this.merge(codes, {isbn10: parts10.join(''), isbn10h: parts10.join('-')});
        }

        return codes;
    },

    getGroupRecord: function(isbn13) {
        var key;
        for (key in this.groups) {
            if (isbn13.match('^' + key.replace('-', '') + '(.+)')) {
                return {group: key.split('-')[1], record: this.groups[key], rest: RegExp.$1};
            }
        }
        return null;
    },

    calcCheckDigit: function(isbn) {
        var c, n;
        if (isbn.match(/^\d{9}[\dX]?$/)) {
            c = 0;
            for (n = 0; n < 9; n += 1) {
                c += (10 - n) * isbn.charAt(n);
            }
            c = (11 - c % 11) % 11;
            return c === 10 ? 'X' : String(c);

        } else if (isbn.match(/(?:978|979)\d{9}[\dX]?/)) {
            c = 0;
            for (n = 0; n < 12; n += 2) {
                c += Number(isbn.charAt(n)) + 3 * isbn.charAt(n + 1);
            }
            return String((10 - c % 10) % 10);
        }

        return null;
    }
};

var isbn = {
    ISBN: ISBN,

    isValid: function(val, groups) {
        var me = new ISBN(val, groups ? groups : GROUPS);
        return me.isValid();
    },

    parse: function(val, groups) {
        var me = new ISBN(val, groups ? groups : GROUPS);
        return me.isValid() ? me : null;
    },

    hyphenate: function(val) {
        var me = isbn.parse(val);
        return me ? me.isIsbn13() ? me.asIsbn13(true) : me.asIsbn10(true) : null;
    },

    asIsbn13: function(val, hyphen) {
        var me = isbn.parse(val);
        return me ? me.asIsbn13(hyphen) : null;
    },

    asIsbn10: function(val, hyphen) {
        var me = isbn.parse(val);
        return me ? me.asIsbn10(hyphen) : null;
    }
};

module.exports = isbn;
