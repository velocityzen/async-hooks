'use strict';
const Promise = require('bluebird');
const HOOKS = Symbol('Async Hooks');

const toCamelCase = function(str) {
  return str.replace(/[-_](\w)/g, (matches, letter) => letter.toUpperCase());
};

const create = function(ctx, name) {
  const method = ctx[name];
  const hooks = ctx[HOOKS] || (ctx[HOOKS] = {});
  const methodHooks = hooks[name] = {
    pre: ctx[toCamelCase(`will-${name}`)],
    will: [],
    did: [],
    post: ctx[toCamelCase(`did-${name}`)]
  };

  ctx[name] = (...args) => {
    const will = methodHooks.pre ? [ methodHooks.pre ].concat(methodHooks.will) : methodHooks.will;
    const did = methodHooks.post ? methodHooks.did.concat(methodHooks.post) : methodHooks.did;

    return Promise
      .reduce(will, (res, func) => func.apply(ctx, args), {})
      .then(() => method.apply(ctx, args))
      .then(res => Promise
        // null in the end to protect from undefined values
        .reduce(did, (res, func) => func.call(ctx, res), res || null)
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
  hook && hooks.will.push(hook);
  return this;
}

const did = function(name, hook) {
  const hooks = get(this, name);
  hook && hooks.did.push(hook);
  return this;
}

module.exports = (ctx, ...methods) => {
  ctx.will = will;
  ctx.did = did;
  methods.forEach(method => ctx.will(method));
  return ctx;
};
