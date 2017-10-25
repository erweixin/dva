import invariant from 'invariant';
import { isPlainObject } from './utils';

const hooks = [
  'onError',
  'onStateChange',
  'onAction',
  'onHmr',
  'onReducer',
  'onEffect',
  'extraReducers',
  'extraEnhancers',
];

// 筛选掉hooks中没有的plugin
export function filterHooks(obj) {
  return Object.keys(obj).reduce((memo, key) => {
    if (hooks.indexOf(key) > -1) {
      memo[key] = obj[key];
    }
    return memo;
  }, {});
}

export default class Plugin {
  constructor() {
    this.hooks = hooks.reduce((memo, key) => {
      memo[key] = [];
      return memo;
    }, {});
  }

  // plugin[key]
  // if (key === 'extraEnhancers') {
  //   hooks[key] = plugin[key];
  // } else {
  //   hooks[key].push(plugin[key]);
  // }
  use(plugin) {
    invariant(isPlainObject(plugin), 'plugin.use: plugin should be plain object');
    const hooks = this.hooks;
    for (const key in plugin) {
      if (Object.prototype.hasOwnProperty.call(plugin, key)) {
        invariant(hooks[key], `plugin.use: unknown plugin property: ${key}`);
        if (key === 'extraEnhancers') {
          hooks[key] = plugin[key];
        } else {
          hooks[key].push(plugin[key]);
        }
      }
    }
  }

  // 返回一个函数，将该函数的参数传递给hooks[key],hooks[key]不为空时
  //    for (const fn of hooks[key]) {
  //       fn(...args);
  //    }
  // hooks[key]为空时
  // defaultHandler(...args);
  apply(key, defaultHandler) {
    const hooks = this.hooks;
    const validApplyHooks = ['onError', 'onHmr'];
    invariant(validApplyHooks.indexOf(key) > -1, `plugin.apply: hook ${key} cannot be applied`);
    const fns = hooks[key];

    return (...args) => {
      if (fns.length) {
        for (const fn of fns) {
          fn(...args);
        }
      } else if (defaultHandler) {
        defaultHandler(...args);
      }
    };
  }

  get(key) {
    const hooks = this.hooks;
    invariant(key in hooks, `plugin.get: hook ${key} cannot be got`);
    if (key === 'extraReducers') {
      return getExtraReducers(hooks[key]);
    } else if (key === 'onReducer') {
      return getOnReducer(hooks[key]);
    } else {
      return hooks[key];
    }
  }
}

// hook[extraReducers]存储格式为
// [
//   {
//     form: formReducer
//   },
//   {
//     text: textReducer
//   }
// ]
function getExtraReducers(hook) {
  let ret = {};
  for (const reducerObj of hook) {
    ret = { ...ret, ...reducerObj };
  }
  return ret;
}

// hook[onReducer]存储格式为
// [
//    reducer => {
//      return (state, action) => {
//       ...
//      }
//    },
//    reducer => {
//      return (state, action) => {
//       ...
//      }
//    },
// ]
function getOnReducer(hook) {
  return function (reducer) {
    for (const reducerEnhancer of hook) {
      reducer = reducerEnhancer(reducer);
    }
    return reducer;
  };
}
