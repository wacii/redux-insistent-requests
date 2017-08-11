import { INITIALIZE, ONLINE, RETRY } from "../constants";

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

    switch (action.type) {
      case RETRY:
        return {
          ...state,
          requests: state.requests.map(
            request =>
              request.id === action.payload
                ? {
                    ...request,
                    busy: true,
                    attempts: request.attempts + 1
                  }
                : request
          )
        };
      case INITIALIZE:
      case ONLINE:
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
      default:
        return state;
    }
  };
}

export default createParallelReducer;
