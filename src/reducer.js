import { DEQUEUE } from "./constants";

const initialState = {
  queue: [],
  nextId: 0,
};

function reducer(state = initialState, action) {
  if (action.meta && action.meta.request) {
    const item = { ...action.meta.request, id: state.nextId };
    return {
      ...state,
      nextId: state.nextId + 1,
      queue: state.queue.concat(item),
    };
  }
  if (action.type === DEQUEUE) {
    return {
      ...state,
      queue: state.queue.slice(1),
    };
  }
  return state;
}

export default reducer;
