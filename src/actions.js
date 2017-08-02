import { DEQUEUE, SCHEDULE_RETRY, ONLINE, OFFLINE, } from "./constants";

export function dequeue() {
  return { type: DEQUEUE, };
}

export function scheduleRetry() {
  return { type: SCHEDULE_RETRY };
}

export function online() {
  return { type: ONLINE };
}

export function offline() {
  return { type: OFFLINE };
}
