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
  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('is a function', function () {
    assert.isFunction(notify.notify);
  });
});

describe('notify-init', function () {
  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('is a function', function () {
    assert.isFunction(notify.cli);
  });

  it('uses readline from stdin to stdout', function () {
    var rl = { on : sandbox.stub() };
    sandbox.stub(readline, 'createInterface').returns(rl);

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
  var sandbox, stdin, stdout = fs.createWriteStream('/dev/null');

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sandbox.stub(notifier, 'notify');
    sandbox.stub(process, 'exit');
    stdin = mockStdin.stdin();
  });

  afterEach(function () {
    stdin.restore();
    sandbox.restore();
  });

  it('notifies as Passed', function () {
    notify.notify({ title : 'Test', output : stdout });
    stdin.send('everything is ok\n', 'utf8');
    stdin.send(null);

    sinon.assert.calledOnce(notifier.notify);
    sinon.assert.calledWith(notifier.notify, {
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

    sinon.assert.calledOnce(notifier.notify);
    sinon.assert.calledWith(notifier.notify, {
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

    sinon.assert.calledOnce(notifier.notify);
    sinon.assert.calledWith(notifier.notify, {
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

    sinon.assert.calledOnce(notifier.notify);
    sinon.assert.calledWith(notifier.notify, {
      icon    : iconError,
      message : '2 errors.',
      title   : 'Test Failed'
    });
    sinon.assert.calledOnce(process.exit);
    sinon.assert.calledWith(process.exit, 2);
  });
});
