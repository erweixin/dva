
function identify(value) {
  return value;
}

function handleAction(actionType, reducer = identify) {
  return (state, action) => {
    const { type } = action;
    if (type && actionType !== type) {
      return state;
    }
    return reducer(state, action);
  };
}

function reduceReducers(...reducers) {
  return (previous, current) =>
    reducers.reduce(
      (p, r) => r(p, current),
      previous,
    );
}

function handleActions(handlers, defaultState) {
  const reducers = Object.keys(handlers).map(type => handleAction(type, handlers[type]));
  const reducer = reduceReducers(...reducers);
  return (state = defaultState, action) => reducer(state, action);
}

// 返回一个reducer，将该reducer的参数链式传递给reducers中的每一个reducer，当action.action配对时，发起对应的确定的那个reducer，其他的返回原state
export default handleActions;
