import reducer from "../src/reducer";
import { complete } from "../src/actions";
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

test("complete", () => {
  let state = reducer(undefined, actionWithRequest());
  expect(state.requests).toEqual([expect.any(Object)]);

  state = reducer(state, complete(0));
  expect(state.requests).toEqual([]);
});
