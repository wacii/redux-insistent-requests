import { DEQUEUE, SCHEDULE_RETRY } from "./constants";
import { queueSelector } from "./selectors";

function buildMiddleware(send) {
  return ({ dispatch, getState }) => next => action => {
    if (action.meta && action.meta.request) {
      const queue = queueSelector(getState());
      if (queue.length === 0) {
        send(dispatch, action.meta.request);
      }
    }
    const result = next(action);
    let queue;
    switch (action.type) {
      case DEQUEUE:
        queue = queueSelector(getState());
        if (queue.length !== 0) {
          const data = queue[0];
          send(dispatch, data);
        }
        break;
      case SCHEDULE_RETRY:
        queue = queueSelector(getState());
        if (queue.length !== 0) {
          const data = queue[0];
          setTimeout(() => send(dispatch, data), 500);
        }
        break;
    }
    return result;
  }
}

export default buildMiddleware;
