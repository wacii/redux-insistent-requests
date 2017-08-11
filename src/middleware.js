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
      // FIXME: you should never send when offline...
      if (!serial || (requests.length === 0 && online)) {
        send(dispatch, { data: action.meta.request, id });
      }
    }

    const result = next(action);
    let requests, state, online, request, backoffTime, id;

    if (serial) {
      switch (action.type) {
        case COMPLETE:
        case INITIALIZE:
        case ONLINE:
          state = getState();
          requests = requestsSelector(state);
          online = onlineSelector(state);

          if (online && requests.length > 0) {
            send(dispatch, requests[0]);
          }
          break;
      }
    } else { // parallel
      switch (action.type) {
        case INITIALIZE:
        case ONLINE:
          state = getState();
          requests = requestsSelector(state);
          online = onlineSelector(state);

          if (online) {
            requests
              .filter(request => !request.busy)
              .forEach(request => send(dispatch, request));
          }
          break;
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
        setTimeout(() => dispatch(retry()), backoffTime);
        break;
    }
    return result;
  };
}

export default buildMiddleware;
