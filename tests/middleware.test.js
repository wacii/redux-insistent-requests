import buildMiddleware from "../src/middleware";
import {
  dequeue,
  online,
  retry,
  initialize,
  scheduleRetry
} from "../src/actions";
import {
  actionWithRequest,
  buildOfflineState,
  buildStateWithRequests,
  buildWaitingState
} from "./test-helpers";

test("send request from metadata when queue empty", () => {
  const { dispatch, invoke, send } = setup(buildStateWithRequests());
  const action = actionWithRequest();
  invoke(action);
  expect(send).toBeCalledWith(dispatch, action.meta.request);
});

test("send next request on dequeue", () => {
  const { invoke, send } = setup(buildStateWithRequests(2));
  invoke(dequeue());
  expect(send).toBeCalled();
});

test("send next request on online", () => {
  const { invoke, send } = setup(buildStateWithRequests(2));
  invoke(online());
  expect(send).toBeCalled();
});

test("send next request on initialize", () => {
  const { invoke, send } = setup(buildStateWithRequests(2));
  invoke(initialize());
  expect(send).toBeCalled();
});

test("send next request on retry", () => {
  const { invoke, send } = setup(buildStateWithRequests(2));
  invoke(retry());
  expect(send).toBeCalled();
});

test("send requests only if online", () => {
  const { invoke, send } = setup(buildOfflineState());
  invoke(actionWithRequest());
  expect(send).not.toBeCalled();
});

test("send requests only if not waiting", () => {
  let { invoke, send } = setup(buildWaitingState());
  invoke(dequeue());
  expect(send).not.toBeCalled();
});

test("schedule retry when prompted", () => {
  jest.useFakeTimers();
  let { invoke, dispatch } = setup(buildStateWithRequests());
  invoke(scheduleRetry());
  jest.runAllTimers();
  expect(dispatch).toBeCalledWith(retry());
});

function setup(state) {
  const getState = jest.fn(() => state);
  const dispatch = jest.fn();
  const send = jest.fn();
  const middleware = buildMiddleware(send);
  const next = jest.fn();

  return {
    invoke: middleware({ dispatch, getState })(next),
    getState,
    dispatch,
    send,
    next
  };
}
