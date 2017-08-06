import { online, offline } from "./actions";

// TODO: consider running this and other code on the server
function attachMonitor(dispatch) {
  addEventListener("online", () => dispatch(online()));
  addEventListener("offline", () => dispatch(offline()));

  if (navigator.onLine) {
    dispatch(online());
  } else {
    dispatch(offline());
  }
}

export default attachMonitor;
