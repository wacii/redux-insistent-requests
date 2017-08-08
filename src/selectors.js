const reducerKey = "insistentRequests";

export function attemptsSelector(state) {
  return state[reducerKey].attempts;
}

export function queueSelector(state) {
  return state[reducerKey].queue;
}

export function onlineSelector(state) {
  return state[reducerKey].online;
}

export function busySelector(state) {
  return state[reducerKey].busy;
}
