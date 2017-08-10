import {
  COMPLETE,
  SCHEDULE_RETRY,
  ONLINE,
  OFFLINE,
  INITIALIZE,
  RETRY
} from "./constants";

export function complete(id) {
  return { type: COMPLETE, payload: id };
}

export function scheduleRetry(id) {
  return { type: SCHEDULE_RETRY, payload: id };
}

export function retry(id) {
  return { type: RETRY, payload: id };
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
