import { retry } from "./actions";
import {
  DEQUEUE,
  SCHEDULE_RETRY,
  ONLINE,
  INITIALIZE,
  RETRY
} from "./constants";
import {
  attemptsSelector,
  queueSelector,
  onlineSelector,
  waitingSelector
} from "./selectors";

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
    let queue, state, online, waiting, attempts, backoffTime;
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
        state = getState();
        attempts = attemptsSelector(state);
        backoffTime = calculateBackoff(attempts);
        setTimeout(() => dispatch(retry()), backoffTime);
        break;
    }
    return result;
  };
}

function calculateBackoff(attempts) {
  return Math.pow(2, attempts) * 100;
}

export default buildMiddleware;
