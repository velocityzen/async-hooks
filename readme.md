# async-hooks

[![NPM Version](https://img.shields.io/npm/v/async-hooks.svg?style=flat-square)](https://www.npmjs.com/package/async-hooks)
[![NPM Downloads](https://img.shields.io/npm/dt/async-hooks.svg?style=flat-square)](https://www.npmjs.com/package/async-hooks)

Async 'will' and 'did' hooks for any methods.

## install

`npm i async-hooks`

## usage

```js
'use strict';
const hooks = require('async-hooks');

// Define your class
const MyClass = function() {
  // Create hooks
  hooks(this);
};

MyClass.prototype.method = function(arg1, arg2) {
  return Promise.resolve();
};

// Instantiate MyClass
const myClass = new MyClass();
// Now you can add hooks to any class methods
myClass.will('method', (arg1, arg2) => {
  // ... do something
});

myClass.will('method', (arg1, arg2) => {
  // ... do something else
});

myClass.did('method', res => {
  // ... do something
  return res;
});

myClass.did('method', res => {
  // ... do something else
  return res;
});

```

## API

### (object)

Adds `will` and `did` methods to the `object`. Both `will` and `did` are lazy methods. So to use auto hooks you still should run it as:

```js
hooks(this)
  .will('method')
  .will('anotherMethod')
```

### will(method, hook)

Adds will (runs before) `hook` function to the `method` only if `method` exists and it is a function. `hook` function will receive all arguments as the original method. If `hook` function is async it should return a Promise.

**If object has 'willMethod' it will be run before all other hooks**

### did(method, hook)

Adds did (runs after) `hook` function to the `method` only if `method` exists and it is a function. `hook` function will receive a result of the original method or previous hook and should return result or Promise.

**If object has 'didMethod' it will be run after all other hooks**

License MIT;

© velocityzen
