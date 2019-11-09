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
class MyClass {
  constructor() {
    hooks(this);
  }

  method(arg1, arg2) {
    return Promise.resolve(arg1 + arg2);
  }
}

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

### (object, [method, ...])

Adds `will` and `did` methods to the `object`. Both `will` and `did` are lazy methods. So to use auto hooks you still should run it as:

```js
hooks(this, 'method', 'anotherMethod');
```

### will(method, hook)

Adds will (runs before) `hook` function to the `method` only if `method` exists and it is a function. `hook` function will receive all arguments as the original method. If `hook` function is async it should return a Promise.

**If object has `will<Method>` it will be run before all other hooks**

### did(method, hook)

Adds did (runs after) `hook` function to the `method` only if `method` exists and it is a function. `hook` function will receive a result of the original method or previous hook and should return result or Promise.

**If object has `did<Method>` it will be run after all other hooks**

### Errors

**If object has `catch<Method>` it will receive the throws and orginal arguments.**

License MIT;

© velocityzen
