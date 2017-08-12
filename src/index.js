// TODO: rename file "middleware.js"
import buildMiddleware from "./middleware";
import buildSend from "./buildSend";
import { parallelReducer, serialReducer } from "./reducer";
import { fetch } from "./request";

function insistentRequests(options = {}) {
  const serial = options.serial || !options.parallel;

  // TODO: not satisfied with the name `request`
  const request = options.request || fetch;
  const send = buildSend(request);
  const middleware = buildMiddleware(send, serial);

  // TODO: extract state key
  const reducer = serial ? serialReducer : parallelReducer;
  function reducerEnhancer(next) {
    return (state, action) => {
      state = next(state, action);
      return {
        ...state,
        insistentRequests: reducer(state.insistentRequests, action)
      };
    };
  }

  return { middleware, reducerEnhancer };
}

export default insistentRequests;
