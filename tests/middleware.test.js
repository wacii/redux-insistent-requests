import buildMiddleware from "../src/middleware";
import * as actions from "../src/actions";
import { retry, scheduleRetry } from "../src/actions";
import { requestsSelector } from "../src/selectors";
import {
  actionWithRequest,
  buildOfflineState,
  buildStateWithRequests,
  buildBusyState
} from "./test-helpers";

describe("serial", () => {
  test("send request from metadata when no requests", () => {
    let { dispatch, invoke, send } = setup(buildStateWithRequests());

    const action = actionWithRequest();
    const expected = {
      data: action.meta.request,
      id: expect.anything()
    };
    invoke(action);
    expect(send).toBeCalledWith(dispatch, expected);

    ({ invoke, send } = setup(buildStateWithRequests(1)));
    invoke(actionWithRequest());
    expect(send).not.toBeCalled();
  });

  ["complete", "online", "initialize"].forEach(action => {
    test(`send next request on ${action}`, () => {
      const { invoke, send } = setup(buildStateWithRequests(2));
      invoke(actions[action]());
      expect(send).toHaveBeenCalledTimes(1);
    });
  });
});

describe("parallel", () => {
  test("send request from metadata", () => {
    const { dispatch, invoke, send } = setup(buildStateWithRequests(1), false);
    const action = actionWithRequest();
    const expected = {
      data: action.meta.request,
      id: expect.anything()
    };
    invoke(action);
    expect(send).toBeCalledWith(dispatch, expected);
  });

  ["online", "initialize"].forEach(action => {
    test(`send all requests on ${action}`, () => {
      const { invoke, send } = setup(buildStateWithRequests(2), false);
      invoke(actions[action]());
      expect(send).toHaveBeenCalledTimes(2);
    });
  });
});

test("send request from metadata only if online", () => {
  const { invoke, send } = setup(buildOfflineState());
  invoke(actionWithRequest());
  expect(send).not.toBeCalled();
});

test("send associated request on retry", () => {
  const { invoke, send, getState } = setup(buildStateWithRequests(1));
  const request = requestsSelector(getState())[0];
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

function setup(state, serial = true) {
  const getState = jest.fn(() => state);
  const dispatch = jest.fn();
  const send = jest.fn();
  const middleware = buildMiddleware(send, serial);
  const next = jest.fn();

  return {
    invoke: middleware({ dispatch, getState })(next),
    getState,
    dispatch,
    send,
    next
  };
}
