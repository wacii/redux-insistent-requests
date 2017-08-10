import reducer from "../src/reducer";
import { complete, initialize, retry, scheduleRetry } from "../src/actions";
import { dummyRequest, actionWithRequest } from "./test-helpers";

test("add request from metadata with unique id", () => {
  const requests = [dummyRequest(), dummyRequest()];
  let state = reducer(undefined, actionWithRequest(requests[0]));
  state = reducer(state, actionWithRequest(requests[1]));
  const baseRequest = { busy: true, attempts: 1 };
  expect(state.requests).toEqual([
    expect.objectContaining({ ...baseRequest, data: requests[0], id: 0 }),
    expect.objectContaining({ ...baseRequest, data: requests[1], id: 1 })
  ]);
  expect(state.requests[0].id).not.toEqual(state.requests[1].id);
});

test("remove request on complete", () => {
  let state = reducer(undefined, actionWithRequest());
  expect(state.requests).toEqual([expect.any(Object)]);

  state = reducer(state, complete(0));
  expect(state.requests).toEqual([]);
});

test("change request to busy on schedule retry", () => {
  const id = 0;
  let state = { requests: [{ busy: false, id }] };
  state = reducer(state, scheduleRetry(id));

  const expected = expect.objectContaining({ busy: true });
  expect(state.requests[0]).toEqual(expected);
});

test("update request on retry", () => {
  const id = 0;
  let state = { online: true, requests: [{ busy: true, attempts: 1, id }] };
  state = reducer(state, retry(id));

  let expected = expect.objectContaining({ busy: true, attempts: 2 });
  expect(state.requests[0]).toEqual(expected);

  state = { online: false, requests: [{ busy: true, attempts: 1, id }] };
  state = reducer(state, retry(id));

  expected = expect.objectContaining({ busy: false, attempts: 1 });
  expect(state.requests[0]).toEqual(expected);
});

test("reset requests on initialize", () => {
  let state = {
    requests: [{ busy: true, attempts: 2 }, { busy: false, attempts: 4 }]
  };
  state = reducer(state, initialize());

  const expectedRequest = expect.objectContaining({ busy: false, attempts: 0 });
  const expected = expect.arrayContaining([expectedRequest, expectedRequest]);
  expect(state.requests).toEqual(expected);
});
