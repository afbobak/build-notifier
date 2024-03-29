/*jslint devel: true, node: true*/
/*! Copyright (C) 2015 by Andreas F. Bobak, Switzerland. All Rights Reserved. !*/
'use strict';

var assert    = require('chai').assert;
var fs        = require('fs');
var notifier  = require('node-notifier');
var mockStdin = require('mock-stdin');
var path      = require('path');
var readline  = require('readline');
var sinon     = require('sinon');

var notify = require('../lib/notify');

var iconOk = path.join(__dirname, '..', 'images', 'ok.png');
var iconError = path.join(__dirname, '..', 'images', 'error.png');

describe('notify-cli', function () {
  afterEach(function () {
    sinon.restore();
  });

  it('is a function', function () {
    assert.isFunction(notify.notify);
  });
});

describe('notify-init', function () {
  afterEach(function () {
    sinon.restore();
  });

  it('is a function', function () {
    assert.isFunction(notify.cli);
  });

  it('uses readline from stdin to stdout', function () {
    var rl = { on : sinon.stub() };
    sinon.stub(readline, 'createInterface').returns(rl);

    notify.notify();

    sinon.assert.calledOnce(readline.createInterface);
    sinon.assert.calledWith(readline.createInterface, {
      input    : process.stdin,
      output   : process.stdout,
      terminal : true
    });
    sinon.assert.calledOnce(rl.on);
    sinon.assert.calledWith(rl.on, 'line');
  });
});

describe('notify-notifications', function () {
  var stdin, stdout = fs.createWriteStream('/dev/null');

  beforeEach(function () {
    sinon.stub(notify._INTERNAL, 'notify');
    sinon.stub(process, 'exit');
    stdin = mockStdin.stdin();
  });

  afterEach(function () {
    sinon.restore();
  });

  it('notifies as Passed', function () {
    notify.notify({ title : 'Test', output : stdout });
    stdin.send('everything is ok\n', 'utf8');
    stdin.send(null);

    sinon.assert.calledOnce(notify._INTERNAL.notify);
    sinon.assert.calledWith(notify._INTERNAL.notify, {
      icon    : iconOk,
      message : 'everything is ok',
      title   : 'Test Passed'
    });
    sinon.assert.calledOnce(process.exit);
    sinon.assert.calledWith(process.exit, 0);
  });

  it('notifies jscs errors as Failed', function () {
    notify.notify({ title : 'Test', output : stdout });
    stdin.send('3 code style errors found.\n', 'utf8');
    stdin.send(null);

    sinon.assert.calledOnce(notify._INTERNAL.notify);
    sinon.assert.calledWith(notify._INTERNAL.notify, {
      icon    : iconError,
      message : '3 code style errors found.',
      title   : 'Test Failed'
    });
    sinon.assert.calledOnce(process.exit);
    sinon.assert.calledWith(process.exit, 2);
  });

  it('notifies jshint error as Failed', function () {
    notify.notify({ title : 'Test', output : stdout });
    stdin.send('1 error.\n', 'utf8');
    stdin.send(null);

    sinon.assert.calledOnce(notify._INTERNAL.notify);
    sinon.assert.calledWith(notify._INTERNAL.notify, {
      icon    : iconError,
      message : '1 error.',
      title   : 'Test Failed'
    });
    sinon.assert.calledOnce(process.exit);
    sinon.assert.calledWith(process.exit, 2);
  });

  it('notifies jshint errors as Failed', function () {
    notify.notify({ title : 'Test', output : stdout });
    stdin.send('2 errors.\n', 'utf8');
    stdin.send(null);

    sinon.assert.calledOnce(notify._INTERNAL.notify);
    sinon.assert.calledWith(notify._INTERNAL.notify, {
      icon    : iconError,
      message : '2 errors.',
      title   : 'Test Failed'
    });
    sinon.assert.calledOnce(process.exit);
    sinon.assert.calledWith(process.exit, 2);
  });

  it('notifies eslint error as Failed', function () {
    notify.notify({ title : 'Test', output : stdout });
    stdin.send('✖ 1 problem (1 error, 0 warnings)\n', 'utf8');
    stdin.send(null);

    sinon.assert.calledOnce(notify._INTERNAL.notify);
    sinon.assert.calledWith(notify._INTERNAL.notify, {
      icon    : iconError,
      message : '✖ 1 problem (1 error, 0 warnings)',
      title   : 'Test Failed'
    });
    sinon.assert.calledOnce(process.exit);
    sinon.assert.calledWith(process.exit, 2);
  });

  it('notifies wdio error as Failed', function () {
    notify.notify({ title : 'Test', output : stdout });
    stdin.send('[firefox #0a] 1 failing\n[firefox #0a]\n', 'utf8');
    stdin.send(null);

    sinon.assert.calledOnce(notify._INTERNAL.notify);
    sinon.assert.calledWith(notify._INTERNAL.notify, {
      icon    : iconError,
      message : '[firefox #0a] 1 failing',
      title   : 'Test Failed'
    });
    sinon.assert.calledOnce(process.exit);
    sinon.assert.calledWith(process.exit, 2);
  });
});
