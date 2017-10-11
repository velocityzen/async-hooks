'use strict';
const Promise = require('bluebird');
const test = require('ava');
const hooks = require('./index');

const Test = function(addition) {
  this.addition = addition || 0;
  hooks(this);
}

Test.prototype.property = true;

Test.prototype.test = function(arg1, arg2) {
  return Promise.resolve(arg1.number + arg2.number + this.addition);
};

test.cb('makes sure orginal method is working', t => {
  const testCase = new Test(2);
  testCase
    .test({ number: 1 }, { number: 2 })
    .then(res => {
      t.is(res, 5);
      t.end();
    })
});

test.cb('fails to add hook to property', t => {
  const testCase = new Test();

  try {
    testCase.will('property', () => {});
  } catch (e) {
    t.truthy(e);
    t.end();
  }
});

test.cb('fails to add hook to non existed method', t => {
  const testCase = new Test();

  try {
    testCase.will('non', () => {});
  } catch (e) {
    t.truthy(e);
    t.end();
  }
});

test.cb('adds only will hook', t => {
  const testCase = new Test(10);

  testCase.will('test', (arg1, arg2) => {
    t.is(arg1.number, 1);
    t.is(arg2.number, 1);
    arg1.number += 1;
  });

  testCase.test({ number: 1 }, { number: 1 })
    .then(res => {
      t.is(res, 13);
      t.end();
    })
    .catch(err => t.falsy(err));
});

test.cb('adds only did hook', t => {
  const testCase = new Test(10);

  testCase.did('test', res => {
    t.is(res, 12);
    return res + 1;
  });

  testCase.test({ number: 1 }, { number: 1 })
    .then(res => {
      t.is(res, 13);
      t.end();
    })
    .catch(err => t.falsy(err));
});

test.cb('adds several will and did hooks', t => {
  const testCase = new Test();

  testCase.will('test', (arg1, arg2) => {
    t.is(arg1.number, 1);
    t.is(arg2.number, 1);
    arg1.number += 1;
  });

  testCase.will('test', (arg1, arg2) => {
    t.is(arg1.number, 2);
    t.is(arg2.number, 1);
    arg2.number += 1;
  });

  testCase.did('test', res => {
    t.is(res, 4);
    return res + 1;
  });

  testCase.test({ number: 1 }, { number: 1 })
    .then(res => {
      t.is(res, 5);
      t.end();
    })
    .catch(err => t.falsy(err));
});

test.cb('checks auto hooks order', t => {
  Test.prototype.willAuto = function(data) {
    data.number = 0;
  }

  Test.prototype.auto = function(data) {
    return Promise.resolve(data.number + this.addition);
  }

  Test.prototype.didAuto = function() {
    return 0;
  }

  const testCase = new Test(2);

  testCase.will('auto', data => {
    t.is(data.number, 0);
  });

  testCase.did('auto', res => {
    t.is(res, 2);
    return res;
  });

  testCase
    .auto({ number: 2 })
    .then(res => {
      t.is(res, 0);
      t.end();
    })
});
