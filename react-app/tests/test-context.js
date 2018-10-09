require("babel-polyfill");

var context = require.context('.', true, /\.test\.js$/);
context.keys().forEach(context);

// needed for code coverage, all '.js' files from 'src' folder
// except from '/server/' are reported
var coverageContext = require.context('../src', true, /^(?:(.(?!\/server\/))+)\.js$/);
// filter out all '.css' files
coverageContext.keys().filter(function(el) {
    return !el.endsWith(".css");
}).forEach(coverageContext);