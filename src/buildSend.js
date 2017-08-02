import { dequeue, scheduleRetry } from "./actions";

function buildSend(request) {
  return function send(dispatch, data) {
    return request(data)
      .then(() => {
        dispatch(dequeue());
      })
      .catch(() => {
        dispatch(scheduleRetry());
      });
  };
}

export default buildSend;
