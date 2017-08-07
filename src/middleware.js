import { retry } from "./actions";
import {
  DEQUEUE,
  SCHEDULE_RETRY,
  ONLINE,
  INITIALIZE,
  RETRY
} from "./constants";
import { queueSelector, onlineSelector, waitingSelector } from "./selectors";

function buildMiddleware(send) {
  return ({ dispatch, getState }) => next => action => {
    if (action.meta && action.meta.request) {
      const state = getState();
      const queue = queueSelector(state);
      const online = onlineSelector(state);
      if (queue.length === 0 && online) {
        send(dispatch, action.meta.request);
      }
    }
    const result = next(action);
    let queue, state, online, waiting;
    // TODO: do you need to respond to both INITIALIZE and ONLINE?
    switch (action.type) {
      case INITIALIZE:
      case ONLINE:
      case DEQUEUE:
      case RETRY:
        state = getState();
        queue = queueSelector(state);
        online = onlineSelector(state);
        waiting = waitingSelector(state);
        if (queue.length !== 0 && online && !waiting) {
          const data = queue[0];
          send(dispatch, data);
        }
        break;
      case SCHEDULE_RETRY:
        // TODO: more meaningful backoff calculation
        setTimeout(() => dispatch(retry()), 500);
        break;
    }
    return result;
  };
}

export default buildMiddleware;
