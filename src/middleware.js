import { retry } from "./actions";
import calculateBackoff from "./calculateBackoff";
import {
  DEQUEUE,
  SCHEDULE_RETRY,
  ONLINE,
  INITIALIZE,
  RETRY
} from "./constants";
import {
  nextIdSelector,
  queueSelector,
  onlineSelector,
  requestSelector
} from "./selectors";

function buildMiddleware(send, serial = true) {
  return ({ dispatch, getState }) => next => action => {
    if (action.meta && action.meta.request) {
      const state = getState();
      const queue = queueSelector(state);
      const id = nextIdSelector(state);
      const online = onlineSelector(state);
      if (!serial || (queue.length === 0 && online)) {
        send(dispatch, { data: action.meta.request, id });
      }
    }
    const result = next(action);
    let queue, state, online, request, backoffTime, id;
    // TODO: do you need to respond to both INITIALIZE and ONLINE?
    switch (action.type) {
      case INITIALIZE:
      case ONLINE:
      case DEQUEUE:
      case RETRY:
        state = getState();
        queue = queueSelector(state);
        online = onlineSelector(state);
        id = action.payload;

        if (!online) break;

        if (serial) {
          queue = queue.slice(0, 1);
        }
        (action.type === RETRY
          ? queue.filter(request => !request.busy || request.id === id)
          : queue.filter(request => !request.busy)).forEach(request =>
          send(dispatch, request)
        );

        break;
      case SCHEDULE_RETRY:
        state = getState();
        request = requestSelector(state, action.payload);
        backoffTime = calculateBackoff(request.attempts);
        setTimeout(() => dispatch(retry()), backoffTime);
        break;
    }
    return result;
  };
}

export default buildMiddleware;
