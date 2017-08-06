import buildSend from "../src/buildSend";
import { dequeue, scheduleRetry } from "../src/actions";
import { SUCCESS, CLIENT_ERROR, NETWORK_ERROR } from "../src/request/constants";

test("dispatch `DEQUEUE` and user provided action on success", () => {
  const { send, dispatch, data, body } = setup(SUCCESS);
  expect.assertions(2);
  send(dispatch, data).then(() => {
    expect(dispatch).toBeCalledWith(dequeue());
    expect(dispatch).toBeCalledWith({ ...data.success, payload: body });
  });
});

test("dispatch `DEQUEUE` and user provided action on client error", () => {
  const { send, dispatch, data, body } = setup(CLIENT_ERROR);
  expect.assertions(2);
  send(dispatch, data).then(() => {
    expect(dispatch).toBeCalledWith(dequeue());
    expect(dispatch).toBeCalledWith({ ...data.failure, payload: body });
  });
});

test("dispatch `SCHEDULE_RETRY` on network error", () => {
  const { send, dispatch, data } = setup(NETWORK_ERROR);
  expect.hasAssertions();
  send(dispatch, data).then(() => {
    expect(dispatch).toBeCalledWith(scheduleRetry());
  });
});

test("throw on invalid outcome code", () => {
  const { send, dispatch, data } = setup("NOT_A_VALID_OUTCOME");
  return expect(send(dispatch, data)).rejects.toBeDefined();
});

function setup(outcome) {
  const body = "response text";
  const request = jest.fn(() => Promise.resolve([outcome, body]));
  const send = buildSend(request);

  const data = {
    config: null,
    success: { type: "USER_PROVIDED_SUCCESS" },
    failure: { type: "USER_PROVIDED_FAILURE" }
  };
  const dispatch = jest.fn();

  return {
    body,
    send,
    data,
    dispatch
  };
}
