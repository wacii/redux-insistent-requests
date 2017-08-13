import {
  COMPLETE,
  INITIALIZE,
  ONLINE,
  OFFLINE,
  RETRY,
  SCHEDULE_RETRY
} from "../constants";

const initialState = {
  requests: [],
  nextId: 0,
  online: true
};

// TODO: consider implementing in a similar fashion to buildMiddleware

function baseReducer(state = initialState, action) {
  if (action.meta && action.meta.request) {
    const request = {
      data: action.meta.request,
      id: state.nextId,
      busy: false,
      attempts: 0
    };

    return {
      ...state,
      nextId: state.nextId + 1,
      requests: state.requests.concat(request)
    };
  }

  switch (action.type) {
    case COMPLETE:
      return {
        ...state,
        requests: state.requests.filter(
          request => request.id !== action.payload
        )
      };
    case RETRY:
      return {
        ...state,
        requests: state.requests.map(
          request =>
            request.id === action.payload
              ? {
                  ...request,
                  busy: state.online,
                  attempts: request.attempts + (state.online ? 1 : 0)
                }
              : request
        )
      };
    case SCHEDULE_RETRY:
      return {
        ...state,
        requests: state.requests.map(
          request =>
            request.id === action.payload ? { ...request, busy: true } : request
        )
      };
    case ONLINE:
      return {
        ...state,
        online: true
      };
    case OFFLINE:
      return {
        ...state,
        online: false
      };
    case INITIALIZE:
      return {
        ...state,
        requests: state.requests.map(request => ({
          ...request,
          busy: false,
          attempts: 0
        }))
      };
    default:
      return state;
  }
}

export default baseReducer;
