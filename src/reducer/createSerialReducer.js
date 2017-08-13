import { INITIALIZE, ONLINE } from "../constants";

function createSerialReducer(next) {
  return (state, action) => {
    state = next(state, action);

    if (!state.online) return state;

    if (
      (action.meta && action.meta.request && state.requests.length === 1) ||
      action.type === INITIALIZE ||
      action.type === ONLINE
    ) {
      return {
        ...state,
        requests: state.requests.map(
          (request, i) =>
            i === 0
              ? {
                  ...request,
                  busy: true,
                  attempts: request.attempts + 1
                }
              : request
        )
      };
    }
    return state;
  };
}

export default createSerialReducer;
