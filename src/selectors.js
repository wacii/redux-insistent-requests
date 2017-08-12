import { stateKey } from "./constants";

export function nextIdSelector(state) {
  return state[stateKey].nextId;
}

export function requestsSelector(state) {
  return state[stateKey].requests;
}

export function onlineSelector(state) {
  return state[stateKey].online;
}

export function requestSelector(state, id) {
  return requestsSelector(state).find(request => request.id === id);
}
