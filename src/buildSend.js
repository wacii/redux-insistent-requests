import { dequeue, scheduleRetry } from "./actions";
import { SUCCESS, CLIENT_ERROR, NETWORK_ERROR } from "./request/constants";

function buildSend(request) {
  return (dispatch, data) => {
    return request(data.config)
      .then(([outcome, body]) => {
        switch (outcome) {
          case SUCCESS:
            dispatch(dequeue());
            if (data.success) {
              dispatch({ ...data.success, payload: body });
            }
            break;
          case CLIENT_ERROR:
            dispatch(dequeue());
            if (data.failure) {
              dispatch({ ...data.failure, payload: body });
            }
            break;
          case NETWORK_ERROR:
            dispatch(scheduleRetry());
            break;
          default:
            throw new Error("Unexpected outcome code.")
        }
      });
  };
}

export default buildSend;
