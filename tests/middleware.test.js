import buildMiddleware from "../src/middleware";
import { dequeue } from "../src/actions";
import { actionWithRequest, buildStateWithRequests } from "./test-helpers";

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
    next,
  };
}
