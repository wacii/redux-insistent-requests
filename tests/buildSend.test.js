import buildSend from "../src/buildSend";
import { dequeue, scheduleRetry } from "../src/actions";

test("dispatch `DEQUEUE` action when request successful", () => {
  const { send, dispatch, data, id } = setup(() => Promise.resolve());
  expect.hasAssertions();
  send(dispatch, data).then(() => {
    expect(dispatch).toBeCalledWith(dequeue())
  });
});

test("dispatch `SCHEDULE_RETRY` action when request fails", () => {
  const { send, dispatch, data, id } = setup(() => Promise.reject());
  expect.hasAssertions();
  send(dispatch, data).then(() => {
    expect(dispatch).toBeCalledWith(scheduleRetry())
  });
});

function setup(request) {
  const send = buildSend(request);
  const dispatch = jest.fn();
  const data = {};
  return { send, dispatch, data, };
}
