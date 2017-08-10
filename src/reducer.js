import {
  COMPLETE,
  ONLINE,
  OFFLINE,
  RETRY,
  SCHEDULE_RETRY,
  INITIALIZE
} from "./constants";

const initialState = {
  requests: [],
  nextId: 0,
  online: true
};

function reducer(state = initialState, action) {
  if (action.meta && action.meta.request) {
    const request = {
      data: action.meta.request,
      id: state.nextId,
      busy: true,
      attempts: 1
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
    case SCHEDULE_RETRY:
      return {
        ...state,
        requests: state.requests.map(
          request =>
            request.id === action.payload ? { ...request, busy: true } : request
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
                  busy: request.online,
                  attempts: request.attempts + 1
                }
              : request
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
          attemps: 1
        }))
      };
    default:
      return state;
  }
}

export default reducer;
