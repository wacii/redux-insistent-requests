import createReducer from "../../src/reducer/createSerialReducer";
import { actionWithRequest } from "../test-helpers";
import * as actions from "../../src/actions";

test("perform request when added to empty queue", () => {
  const reducer = createReducer(() => ({
    requests: [{ busy: false, attempts: 1 }],
    online: true
  }));

  const state = reducer(undefined, actionWithRequest());
  const expected = [{ busy: true, attempts: 2 }];
  expect(state.requests).toEqual(expected);
});

["initialize", "online"].forEach(action => {
  test(`perform next request in queue on ${action}`, () => {
    const reducer = createReducer(() => ({
      requests: [{ busy: false, attempts: 0 }, { busy: false, attempts: 0 }],
      online: true
    }));

    const state = reducer(undefined, actions[action]());
    const expected = [
      { busy: true, attempts: 1 },
      { busy: false, attempts: 0 }
    ];
    expect(state.requests).toEqual(expected);
  });
});
