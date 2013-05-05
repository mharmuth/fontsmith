var assert = require('assert'),
    _s = require('underscore.string'),
    fs = require('fs'),
    fontsmith = require('../lib/fontsmith');
module.exports = {
  "An array of SVGs": function () {
    // Set up our list of SVGs
    this.files = [
      __dirname + '/test_files/eye.svg',
      __dirname + '/test_files/moon.svg',
      __dirname + '/test_files/building_block.svg'
    ];
  },
  "rendered with fontsmith": function (done) {
    // Render with fontsmith
    var params = {src: this.files},
        that = this;
    this.timeout(60000);
    fontsmith(params, function (err, results) {
      console.error(err);
      // Save the results for later and callback
      that.results = results;
      done(err);
    });
  },
  "generates some fonts": function () {
    var fonts = this.results.fonts;

    // DEV: Write out fonts to files
    // if (true) {
    if (false) {
      try { fs.mkdirSync(__dirname + '/actual_files'); } catch (e) {}
      fs.writeFileSync(__dirname + '/actual_files/font.svg', fonts.svg, 'binary');
      fs.writeFileSync(__dirname + '/actual_files/font.ttf', fonts.ttf, 'binary');
      fs.writeFileSync(__dirname + '/actual_files/font.woff', fonts.woff, 'binary');
      fs.writeFileSync(__dirname + '/actual_files/font.eot', fonts.eot, 'binary');
      fs.writeFileSync(__dirname + '/actual_files/font.dev.svg', fonts['dev-svg'], 'binary');
    }

    // ANTI-PATTERN: Using a forEach for distinguishable items -- losing sense of the context/stackTrace
    ['svg', 'eot', 'ttf', 'woff'].forEach(function (ext) {
      var filepath = __dirname + '/expected_files/font.' + ext,
          actualContent = fonts[ext],
          expectedContent = fs.readFileSync(filepath, 'binary'),
          bitDiff = _s.levenshtein(actualContent, expectedContent),
          isPassing = bitDiff < 50;
      assert(isPassing, 'Font "' + ext + '" is ' + bitDiff + ' different from expected');
    });
  },
  "generates an mapping from files to unicode characters": function () {
    var map = this.results.map;
    // DEV: Hex equivalent of 'e000'
    assert(map.building_block >= 57344);
    assert(map.moon >= 57344);
    assert(map.eye >= 57344);
  }
};