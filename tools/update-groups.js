'use strict';

const request = require('request');
const parseString = require('xml2js').parseString;
const fs = require('fs');

// Request a range file
process.stdout.write('Requesting XML ranges file...\n');
request.get('http://www.isbn-international.org/export_rangemessage.xml',
  function (error, response, body) {
  if (error) {
    throw error;
  }

  // Parse XML response
  parseString(body, function (error, result) {
    if (error) {
      throw error;
    }

    const prefixes = result.ISBNRangeMessage.RegistrationGroups[0].Group;
    const groups = {};

    // Extract agency name and ranges from each group
    for (let i = 0, c = prefixes.length; i < c; i++) {
      const prefix = prefixes[i];
      const groupKey = prefix.Prefix[0];
      const group = {
        name: prefix.Agency[0],
        ranges: prefix.Rules[0].Rule.filter(function (rule) {
          if (rule.Length[0] === '0') {
            return false;
          }

          return true;
        }).map(function (rule) {
          const length = rule.Length[0];
          const range = rule.Range[0].toString().split('-');
          const start = range[0].substring(0, length);
          const end = range[1].substring(0, length);
          return [start, end];
        })
      };
      groups[groupKey] = group;
    }

    // Stringify object & format string
    const groupsString = JSON.stringify(groups, null, 2);
    const content = `module.exports = ${groupsString};`;

    // Write file
    fs.writeFile('lib/groups.js', content, (err) => {
      if (err) {
        throw err;
      }

      process.stdout.write('Updated file lib/groups.js\n');
    });
  });
});
