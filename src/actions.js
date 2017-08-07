import {
  DEQUEUE,
  SCHEDULE_RETRY,
  ONLINE,
  OFFLINE,
  INITIALIZE,
  RETRY
} from "./constants";

export function dequeue() {
  return { type: DEQUEUE };
}

export function scheduleRetry() {
  return { type: SCHEDULE_RETRY };
}

export function retry() {
  return { type: RETRY };
}

export function online() {
  return { type: ONLINE };
}

export function offline() {
  return { type: OFFLINE };
}

export function initialize() {
  return { type: INITIALIZE };
}
