import handleActions from './handleActions';

// 将reducers合并成一个reudcer，链式调用，只使用type对应的reducer
export default function getReducer(reducers, state) {
  // Support reducer enhancer
  // e.g. reducers: [realReducers, enhancer]
  if (Array.isArray(reducers)) {
    return reducers[1](handleActions(reducers[0], state));
  } else {
    return handleActions(reducers || {}, state);
  }
}
