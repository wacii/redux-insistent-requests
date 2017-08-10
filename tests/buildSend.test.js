import buildSend from "../src/buildSend";
import { complete, scheduleRetry } from "../src/actions";
import { SUCCESS, CLIENT_ERROR, NETWORK_ERROR } from "../src/request/constants";

test("dispatch `COMPLETE` and user provided action on success", () => {
  const { send, dispatch, data, body } = setup(SUCCESS);
  expect.assertions(2);
  send(dispatch, { data, id: 0 }).then(() => {
    expect(dispatch).toBeCalledWith(complete(0));
    expect(dispatch).toBeCalledWith({ ...data.success, payload: body });
  });
});

test("dispatch `COMPLETE` and user provided action on client error", () => {
  const { send, dispatch, data, body } = setup(CLIENT_ERROR);
  expect.assertions(2);
  send(dispatch, { data, id: 0 }).then(() => {
    expect(dispatch).toBeCalledWith(complete(0));
    expect(dispatch).toBeCalledWith({ ...data.failure, payload: body });
  });
});

test("dispatch `SCHEDULE_RETRY` on network error", () => {
  const { send, dispatch, data } = setup(NETWORK_ERROR);
  expect.hasAssertions();
  send(dispatch, { data, id: 0 }).then(() => {
    expect(dispatch).toBeCalledWith(scheduleRetry(0));
  });
});

test("throw on invalid outcome code", () => {
  const { send, dispatch, data } = setup("NOT_A_VALID_OUTCOME");
  return expect(send(dispatch, { data, id: 0 })).rejects.toBeDefined();
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
