import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import insistentRequests from 'redux-insistent-requests';

import './index.css';
import requestFake from './requestFake';
import { OnlineToggle, RequestList } from "./internal-monitoring";
import registerServiceWorker from './registerServiceWorker';

const { middleware, reducerEnhancer } = insistentRequests({
  serial: true,
  request: requestFake
});
function baseReducer(state = {}) {
  return state;
}
const reducer = reducerEnhancer(baseReducer);
const store = createStore(
  reducer,
  compose(
    applyMiddleware(middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

function requestAction() {
  return {
    type: "INITIATE_REQUEST",
    meta: {
      request: {}
    }
  }
}

const RequestButton = connect()(({ dispatch}) => (
  <button onClick={() => dispatch(requestAction())}>
    Make Request
  </button>
));

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
