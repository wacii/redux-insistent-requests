import { INITIALIZE, ONLINE } from "../constants";

function createParallelReducer(next) {
  return (state, action) => {
    state = next(state, action);

    if (!state.online) return state;

    if (action.meta && action.meta.request) {
      const last = state.requests.length - 1;
      return {
        ...state,
        requests: state.requests.map(
          (request, i) =>
            i === last
              ? {
                  ...request,
                  busy: true,
                  attempts: request.attempts + 1
                }
              : request
        )
      };
    }

    if (action.type === INITIALIZE || action.type === ONLINE) {
      return {
        ...state,
        requests: state.requests.map(
          request =>
            request.busy
              ? request
              : {
                  ...request,
                  busy: true,
                  attempts: request.attempts + 1
                }
        )
      };
    }
    return state;
  };
}

export default createParallelReducer;
