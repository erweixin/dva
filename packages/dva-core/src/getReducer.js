import handleActions from './handleActions';

// 将reducers合并成一个reudcer
export default function getReducer(reducers, state) {
  // Support reducer enhancer
  // e.g. reducers: [realReducers, enhancer]
  if (Array.isArray(reducers)) {
    return reducers[1](handleActions(reducers[0], state));
  } else {
    return handleActions(reducers || {}, state);
  }
}
