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
  busy: false,
  attempts: 0
};

function reducer(state = initialState, action) {
  if (action.meta && action.meta.request) {
    const item = { ...action.meta.request, id: state.nextId };
    return {
      ...state,
      nextId: state.nextId + 1,
      queue: state.queue.concat(item),
      busy: true
    };
  }

  switch (action.type) {
    case DEQUEUE:
      return {
        ...state,
        queue: state.queue.slice(1),
        busy: false,
        attempts: 0
      };
    case SCHEDULE_RETRY:
      return {
        ...state,
        busy: true
      };
    case RETRY:
      return {
        ...state,
        busy: false,
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
        busy: false
      };
    default:
      return state;
  }
}

export default reducer;
