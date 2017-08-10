import { complete, scheduleRetry } from "./actions";
import { SUCCESS, CLIENT_ERROR, NETWORK_ERROR } from "./request/constants";

function buildSend(request) {
  return (dispatch, { data, id }) => {
    return request(data.config).then(([outcome, body]) => {
      switch (outcome) {
        case SUCCESS:
          dispatch(complete(id));
          if (data.success) {
            dispatch({ ...data.success, payload: body });
          }
          break;
        case CLIENT_ERROR:
          dispatch(complete(id));
          if (data.failure) {
            dispatch({ ...data.failure, payload: body });
          }
          break;
        case NETWORK_ERROR:
          dispatch(scheduleRetry(id));
          break;
        default:
          throw new Error("Unexpected outcome code.");
      }
    });
  };
}

export default buildSend;
