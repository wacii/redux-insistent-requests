import { DEQUEUE, SCHEDULE_RETRY, ONLINE, INITIALIZE } from "./constants";
import { queueSelector, onlineSelector } from "./selectors";

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
    let queue, state, online;
    switch (action.type) {
      case INITIALIZE:
      case ONLINE:
      case DEQUEUE:
        state = getState();
        queue = queueSelector(state);
        online = onlineSelector(state);
        if (queue.length !== 0 && online) {
          const data = queue[0];
          send(dispatch, data);
        }
        break;
      case SCHEDULE_RETRY:
        state = getState();
        queue = queueSelector(state);
        if (queue.length !== 0 && online) {
          const data = queue[0];
          setTimeout(() => send(dispatch, data), 500);
        }
        break;
    }
    return result;
  };
}

export default buildMiddleware;
