/* global window */
import { online, offline } from "./actions";

function attachMonitor(dispatch) {
  if (typeof window !== "undefined") {
    window.addEventListener("online", () => dispatch(online()));
    window.addEventListener("offline", () => dispatch(offline()));

    if (window.navigator.onLine) {
      dispatch(online());
    } else {
      dispatch(offline());
    }
  }
}

export default attachMonitor;
