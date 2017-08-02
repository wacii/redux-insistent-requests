const reducerKey = "insistentRequests";

export function queueSelector(state) {
  return state[reducerKey].queue;
}
