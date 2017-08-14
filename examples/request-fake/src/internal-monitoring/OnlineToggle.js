import React from "react";
import { connect } from "react-redux";

function OnlineToggle({ online, goOnline, goOffline }) {
  return (
    <button onClick={() => (online ? goOffline() : goOnline())}>
      {online ? "Go Offline" : "Go Online"}
    </button>
  );
}

function mapStateToProps({ insistentRequests: { online } }) {
  return { online };
}

function mapDispatchToProps(dispatch) {
  return {
    goOnline() {
      dispatch({ type: "@@insistent-requests/ONLINE" });
    },
    goOffline() {
      dispatch({ type: "@@insistent-requests/OFFLINE" });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OnlineToggle);
