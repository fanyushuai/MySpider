var page = require('webpage').create();

page.open('http://slashdot.org', function (s) {
  console.log(s);
  phantom.exit();
});