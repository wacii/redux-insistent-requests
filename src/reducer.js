import {
  DEQUEUE,
  ONLINE,
  OFFLINE,
  RETRY,
  SCHEDULE_RETRY,
  INITIALIZE
} from "./constants";

const initialState = {
  queue: [],
  nextId: 0,
  online: true,
  waiting: false,
  attempts: 0
};

function reducer(state = initialState, action) {
  if (action.meta && action.meta.request) {
    const item = { ...action.meta.request, id: state.nextId };
    return {
      ...state,
      nextId: state.nextId + 1,
      queue: state.queue.concat(item),
      waiting: true
    };
  }

  switch (action.type) {
    case DEQUEUE:
      return {
        ...state,
        queue: state.queue.slice(1),
        waiting: false,
        attempts: 0
      };
    case SCHEDULE_RETRY:
      return {
        ...state,
        waiting: true
      };
    case RETRY:
      return {
        ...state,
        waiting: false,
        attempts: state.attempts + 1
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
    case INITIALIZE:
      return {
        ...state,
        waiting: false
      };
    default:
      return state;
  }
}

export default reducer;
