import React from "react";
import { connect } from "react-redux";

function Request({ id, busy, attempts }) {
  return (
    <li>
      ID: {id} - Attempts: {attempts} - {busy ? "Busy" : "Idle"}
    </li>
  );
}

function RequestList({ requests }) {
  return (
    <ul>
      {requests.map(({ id, busy, attempts }) =>
        <Request key={id} id={id} attempts={attempts} busy={busy} />
      )}
    </ul>
  );
}

function mapStateToProps({ insistentRequests: { requests } }) {
  return { requests };
}

export default connect(mapStateToProps)(RequestList);
