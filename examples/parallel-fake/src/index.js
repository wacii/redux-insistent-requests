// TODO: combine the two fake request examples

import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";

import registerServiceWorker from './registerServiceWorker';

import insistentRequests from "redux-insistent-requests";
import { OnlineToggle, RequestList } from "./internal-monitoring";
import requestFake from "./requestFake";

const { middleware, reducerEnhancer } = insistentRequests({
  parallel: true,
  request: requestFake
});

function emptyReducer(state = {}, action) {
  return state;
}
const reducer = reducerEnhancer(emptyReducer);
const store = createStore(reducer, compose(
  applyMiddleware(middleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

function makeRequest() {
  return {
    type: "SOME_ACTION",
    meta: {
      request: {}
    }
  };
}
const RequestButton = connect()(
  ({ dispatch }) => (
    <button onClick={() => dispatch(makeRequest())}>
      Make Request
    </button>
  )
);


ReactDOM.render(
  <Provider store={store}>
    <div>
      <RequestButton />
      <RequestList />
      <OnlineToggle />
    </div>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
