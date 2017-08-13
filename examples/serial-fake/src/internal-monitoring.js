// NOTE: code accesses Redux Insistent Requests internals

import React, { Component } from "react";
import { connect } from "react-redux";

export const OnlineToggle = connect(
  ({ insistentRequests: { online } }) => ({ online }),
  dispatch => ({
    goOnline: () => dispatch({ type: "@@insistent-requests/ONLINE" }),
    goOffline: () => dispatch({ type: "@@insistent-requests/OFFLINE" })
  })
)(({ online, goOnline, goOffline }) => (
  <button onClick={() => online ? goOffline() : goOnline()}>
    {online ? "Go Offline" : "Go Online"}
  </button>
));

function Request({ id, busy, attempts }) {
  return (
    <li>
      ID: {id} - Attempts: {attempts} - {busy ? "Busy" : "Idle"}
    </li>
  );
}

export const RequestList = connect(
  ({ insistentRequests: { requests } }) => ({ requests })
)(({ requests }) => (
  <ul>
    {requests.map(({ id, busy, attempts }) => (
      <Request key={id} id={id} attempts={attempts} busy={busy} />
    ))}
  </ul>
));
