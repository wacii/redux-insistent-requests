import buildMiddleware from "../src/middleware";
import * as actions from "../src/actions";
import {
  retry,
  scheduleRetry
} from "../src/actions";
import { queueSelector } from "../src/selectors";
import {
  actionWithRequest,
  buildOfflineState,
  buildStateWithRequests,
  buildBusyState
} from "./test-helpers";

describe("serial", () => {
  test("send request from metadata when queue empty", () => {
    let { dispatch, invoke, send } = setup(buildStateWithRequests());

    const action = actionWithRequest();
    invoke(action);
    expect(send).toBeCalledWith(dispatch, action.meta.request);

    ({ invoke, send } = setup(buildStateWithRequests(1)));
    invoke(actionWithRequest());
    expect(send).not.toBeCalled();
  });

  ["dequeue", "online", "initialize", "retry"].forEach(action => {
    test(`send next request on ${action}`, () => {
      const { invoke, send } = setup(buildStateWithRequests(2));
      invoke(actions[action]());
      expect(send).toHaveBeenCalledTimes(1);
    });
  });
});

test("send request from metadata only if online", () => {
  const { invoke, send } = setup(buildOfflineState());
  invoke(actionWithRequest());
  expect(send).not.toBeCalled();
});

["dequeue", "online", "initialize", "retry"].forEach(action => {
  test(`do not send next request on ${action} if busy`, () => {
    let { invoke, send } = setup(buildBusyState());
    invoke(actions[action]());
    expect(send).not.toBeCalled();
  });
});

test("send next request if target of retry action", () => {
  const { invoke, send, getState } = setup(buildStateWithRequests(1));
  const queue = queueSelector(getState());
  const request = queue[0];
  invoke(retry(request.id));
  expect(send).toBeCalled();
});

test("schedule retry when prompted", () => {
  jest.useFakeTimers();
  let { invoke, dispatch } = setup(buildStateWithRequests(1));
  invoke(scheduleRetry(0));
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
