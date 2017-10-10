'use strict';
const Promise = require('bluebird');
const HOOKS = Symbol('Property for saving async hooks');

const create = function(ctx, name) {
  const method = ctx[name];
  const hooks = ctx[HOOKS] || (ctx[HOOKS] = {});
  const methodHooks = hooks[name] = {
    will: [],
    did: []
  };

  ctx[name] = function hooksWrapper(...args) {
    return Promise
      .reduce(methodHooks.will, (res, func) => func.apply(undefined, args), {})
      .then(() => method.apply(ctx, args))
      .then(res => Promise
        .reduce(methodHooks.did, (res, func) => func(res), res)
      )
  };

  return methodHooks;
}

const get = function(ctx, name) {
  if (!ctx[name] || typeof ctx[name] !== 'function') {
    throw new Error(`There is no '${name}' method`);
  }

  const hooks = ctx[HOOKS];

  if (hooks && hooks[name]) {
    return hooks[name];
  }

  return create(ctx, name);
}

const will = function(name, hook) {
  const hooks = get(this, name);
  hooks.will.push(hook);
}

const did = function(name, hook) {
  const hooks = get(this, name);
  hooks.did.push(hook);
}

module.exports = ctx => {
  ctx.will = will;
  ctx.did = did;
};
