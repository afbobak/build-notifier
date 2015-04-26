/*! Copyright (C) 2015 by Andreas F. Bobak, Switzerland. All Rights Reserved. !*/
'use strict';

var commander = require('commander');
var notifier  = require('node-notifier');
var path      = require('path');
var readline  = require('readline');

var pkg = require('../package.json');

var errorRegExps = [
  /^\d+ code style errors? found\.$/,
  /^\d+ errors?\.?$/
];

var icons = {
  'error' : path.join(__dirname, '..', 'images', 'error.png'),
  'ok'    : path.join(__dirname, '..', 'images', 'ok.png')
};

/** The Command Line Interface */
exports.cli = function () {
  commander
    .version(pkg.version)
    .usage('[options] <stdin>')
    .description('Reads JSCS and JSHint output from <stdin> and notifies you ' +
      ' about the result via the OSs messaging system.')
    .option('-t, --title [string]', 'optional title for the notification')
    .parse(process.argv);

  exports.notify({
    title : commander.title
  });
};

/**
 * Sends a notification with node-notifier based on the input.
 *
 * @param {Object} [options] - A hash containing some options.
 * @param {string} [options.title=''] - The notification title.
 * @param {stream.Readable} [options.input=process.stdin] - The input stream to read from.
 * @param {stream.Writeable} [options.output=process.stdout] - The output stream to write the input to.
 */
exports.notify = function (options, done) {
  options = options || { title : '' };
  var lastLine;

  /** All input is read */
  function finished() {
    var status = 'ok';
    var i, l = errorRegExps.length;

    for (i = 0; i < l; i++) {
      if (errorRegExps[i].test(lastLine)) {
        status = 'error';
        break;
      }
    }

    var title = options.title + (status === 'ok' ? ' Passed' : ' Failed');
    notifier.notify({
      'icon'    : icons[status],
      'title'   : title,
      'message' : lastLine
    });

    if (done) {
      done(status);
    } else {
      process.exit(status === 'error' ? 2 : 0);
    }
  }

  process.stdin.on('end', finished);

  var rl = readline.createInterface({
    input    : options.input || process.stdin,
    output   : options.output || process.stdout,
    terminal : true
  });

  rl.on('line', function (line) {
    if (line) {
      lastLine = line;
    }
  });
};
