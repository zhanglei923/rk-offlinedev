// let ispathinside = require('is-path-inside');

// isPathInside('a/b/c', 'a/b');

const micromatch = require('micromatch');
// micromatch(list, patterns[, options]);
// The main export takes a list of strings and one or more glob patterns:

console.log(micromatch(['a/b/c.js', 'a/c.md'], 'a/**/*.*', { basename: true }));
console.log(micromatch(['a/b/c.js', 'a/c.md'], 'a/**', { basename: true }));
console.log(micromatch('a/b/c.js', 'a/**', { basename: true }));