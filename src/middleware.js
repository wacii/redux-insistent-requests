import { retry } from "./actions";
import calculateBackoff from "./calculateBackoff";
import {
  COMPLETE,
  SCHEDULE_RETRY,
  ONLINE,
  INITIALIZE,
  RETRY
} from "./constants";
import {
  nextIdSelector,
  requestsSelector,
  onlineSelector,
  requestSelector
} from "./selectors";

function buildMiddleware(send, serial = true) {
  return ({ dispatch, getState }) => next => action => {
    if (action.meta && action.meta.request) {
      const state = getState();
      const requests = requestsSelector(state);
      const id = nextIdSelector(state);
      const online = onlineSelector(state);
      const request = { data: action.meta.request, id };

      if (online && ((serial && requests.length === 0) || !serial)) {
        send(dispatch, request);
      }
    }

    const result = next(action);
    let requests, state, online, request, backoffTime;

    if (serial) {
      if (
        action.type === COMPLETE ||
        action.type === INITIALIZE ||
        action.type === ONLINE
      ) {
        state = getState();
        requests = requestsSelector(state);
        online = onlineSelector(state);

        if (online && requests.length > 0) {
          send(dispatch, requests[0]);
        }
      }
    } else {
      // parallel
      if (action.type === ONLINE || action.type === INITIALIZE) {
        state = getState();
        requests = requestsSelector(state);
        online = onlineSelector(state);

        if (online) {
          requests
            .filter(request => !request.busy)
            .forEach(request => send(dispatch, request));
        }
      }
    }
    switch (action.type) {
      case RETRY:
        state = getState();
        request = requestSelector(state, action.payload);
        online = onlineSelector(state);

        if (online) {
          send(dispatch, request);
        }
        break;
      case SCHEDULE_RETRY:
        state = getState();
        request = requestSelector(state, action.payload);

        backoffTime = calculateBackoff(request.attempts);
        setTimeout(() => dispatch(retry(action.payload)), backoffTime);
        break;
    }
    return result;
  };
}

export default buildMiddleware;
