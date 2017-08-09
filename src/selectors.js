const reducerKey = "insistentRequests";

export function nextIdSelector(state) {
  return state[reducerKey].nextId;
}

export function queueSelector(state) {
  return state[reducerKey].queue;
}

export function onlineSelector(state) {
  return state[reducerKey].online;
}

export function requestSelector(state, id) {
  return state[reducerKey].queue.find(request => request.id === id);
}
