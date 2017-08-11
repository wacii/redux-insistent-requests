import baseReducer from "./baseReducer";
import createParallelReducer from "./createParallelReducer";
import createSerialReducer from "./createSerialReducer";

export const parallelReducer = createParallelReducer(baseReducer);
export const serialReducer = createSerialReducer(baseReducer);
