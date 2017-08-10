const reducerKey = "insistentRequests";

export function nextIdSelector(state) {
  return state[reducerKey].nextId;
}

export function requestsSelector(state) {
  return state[reducerKey].requests;
}

export function onlineSelector(state) {
  return state[reducerKey].online;
}

export function requestSelector(state, id) {
  return requestsSelector(state).find(request => request.id === id);
}
