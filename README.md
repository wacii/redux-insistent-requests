Serializable requests with retries. Intended to be used with [Redux Persist](https://github.com/rt2zz/redux-persist) to provide simple offline support.

# How to offline

Install.

```bash
yarn add redux-insistent-requests
```

Create store with provided middleware and reducerEnhancer.

```js
import insistentRequests from "redux-insistent-requests";
import myReducer from "./myReducer";

const { middleware, reducerEnhancer } = insistentRequests(/* options */);
const store = createStore(
  reducerEnhancer(myReducer),
  applyMiddleware(middleware)
);
```

Use with Redux Persist to have retries work across sessions.

```js
import { autoRehydrate } from "redux-persist";

const store = createStore(
  reducerEnhancer(myReducer),
  compose(
    applyMiddleware(middleware),
    autoRehydrate()
  )
);
```

Begin sending requests by describing them in the metadata of actions.

```js
dispatch({
  type: "SOME_ACTION",
  meta: {
    request: {
      url: "/actions",
      method: "GET"
    }
  }
});
```

Trigger actions on completion or failure with further metadata.

```js
dispatch({
  type: "SOME_ACTION",
  meta: {
    request: {
      url: "/actions",
      method: "GET",
      success: { type: "SOME_ACTION_SUCCESS" },
      failure: { type: "SOME_ACTION_FAILURE" }
    }
  }
});
```

These actions will be merged with the server response under `payload`.

## What it does

Actions specifying `meta.request` trigger a request. If this request fails due to a network error, it is retried until it either succeeds or fails due to a client error.

## Serial vs. Parallel Resolution

Requests are resolved in serial by default, but parallel resolution is also supported.

```js
const { middleware, reducerEnhancer } = insistentRequests({ parallel: true });
```

## Customizing async method

The [default implementation](/src/request/fetch.js) uses fetch. If you would like to use another method, just provide your implementation when requesting a `middleware` and `reducerEnhancer`.

```js
function myRequest(config) {
  return axios(config)
    .then(response => ["SUCCESS", response.data])
    .catch(({ response }) =>
      response.status >= 400 && response.status < 500
      ? ["CLIENT_ERROR", response.data]
      : ["NETWORK_ERROR", response.data]
    );
}

const { middleware, reducerEnhancer } = insistentRequests({
  request: myRequest
});
```

## Related Libraries

[Redux Offline](https://github.com/jevakallio/redux-offline)
[Redux Owl](https://github.com/rt2zz/redux-owl)
