import { online, offline } from "./actions";

function attachMonitor(dispatch) {
  addEventListener("online", () => dispatch(online()));
  addEventListener("offline", () => dispatch(offline()));
}

export default attachMonitor;
