import { DEQUEUE, ONLINE, OFFLINE } from "./constants";

const initialState = {
  queue: [],
  nextId: 0,
  online: true
};

function reducer(state = initialState, action) {
  if (action.meta && action.meta.request) {
    const item = { ...action.meta.request, id: state.nextId };
    return {
      ...state,
      nextId: state.nextId + 1,
      queue: state.queue.concat(item)
    };
  }

  switch (action.type) {
    case DEQUEUE:
      return {
        ...state,
        queue: state.queue.slice(1)
      };
    case ONLINE:
      return {
        ...state,
        online: true
      };
    case OFFLINE:
      return {
        ...state,
        online: false
      };
    default:
      return state;
  }
}

export default reducer;
