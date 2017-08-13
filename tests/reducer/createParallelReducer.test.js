import createReducer from "../../src/reducer/createParallelReducer";
import { actionWithRequest } from "../test-helpers";
import * as actions from "../../src/actions";

test("perform new requests", () => {
  const reducer = createReducer(() => ({
    requests: [{ busy: false, attempts: 0 }, { busy: false, attempts: 0 }],
    online: true
  }));

  const state = reducer(undefined, actionWithRequest());
  const expected = [{ busy: false, attempts: 0 }, { busy: true, attempts: 1 }];
  expect(state.requests).toEqual(expected);
});

["online", "initialize"].forEach(action => {
  test(`perform idle requests on ${action}`, () => {
    const reducer = createReducer(() => ({
      requests: [
        { id: 0, busy: false, attempts: 0 },
        { id: 1, busy: true, attempts: 1 },
        { id: 2, busy: false, attempts: 1 }
      ],
      online: true
    }));

    const state = reducer(undefined, actions[action]());
    const expected = [
      { id: 0, busy: true, attempts: 1 },
      { id: 1, busy: true, attempts: 1 },
      { id: 2, busy: true, attempts: 2 }
    ];
    expect(state.requests).toEqual(expected);
  });
});
