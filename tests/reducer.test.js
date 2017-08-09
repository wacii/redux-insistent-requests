import reducer from "../src/reducer";
import { dequeue } from "../src/actions";
import { dummyRequest, actionWithRequest } from "./test-helpers";

test("enqueue request from metadata with unique id", () => {
  const requests = [dummyRequest(), dummyRequest()];
  let state = reducer(undefined, actionWithRequest(requests[0]));
  state = reducer(state, actionWithRequest(requests[1]));
  const baseRequest = { busy: true, attempts: 1 };
  expect(state.queue).toEqual([
    expect.objectContaining({ ...baseRequest, data: requests[0], id: 0 }),
    expect.objectContaining({ ...baseRequest, data: requests[1], id: 1 })
  ]);
  expect(state.queue[0].id).not.toEqual(state.queue[1].id);
});

test("dequeue", () => {
  let state = reducer(undefined, actionWithRequest());
  expect(state.queue).toEqual([expect.any(Object)]);

  state = reducer(state, dequeue(0));
  expect(state.queue).toEqual([]);
});
