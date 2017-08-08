import reducer from "../src/reducer";
import { offline, scheduleRetry, initialize } from "../src/actions";

export function buildStateWithRequests(count = 0) {
  let state = reducer(undefined, { type: "" });
  for (let i = 0; i < count; i++) {
    state = reducer(state, actionWithRequest());
  }
  state = reducer(state, initialize());
  return { insistentRequests: state };
}

export function buildOfflineState() {
  let state = reducer(undefined, { type: "" });
  state = reducer(state, offline());
  return { insistentRequests: state };
}

export function buildBusyState() {
  let state = reducer(undefined, { type: "" });
  state = reducer(state, actionWithRequest());
  state = reducer(state, scheduleRetry());
  return { insistentRequests: state };
}

let dummyRequestCounter = 0;
export function dummyRequest() {
  return {
    data: `some data #${dummyRequestCounter++}`
  };
}

export function actionWithRequest(request) {
  return {
    type: "SOME_ACTION",
    meta: {
      request: request || dummyRequest()
    }
  };
}
