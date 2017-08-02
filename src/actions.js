import { DEQUEUE, SCHEDULE_RETRY } from "./constants";

export function dequeue() {
  return { type: DEQUEUE, };
}

export function scheduleRetry() {
  return { type: SCHEDULE_RETRY };
}
