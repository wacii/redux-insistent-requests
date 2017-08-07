const MAXIMUM = 10 * 1000;

function calculateBackoff(attempts) {
  let backoff = Math.pow(2, attempts) * 100;
  backoff = Math.min(MAXIMUM, backoff); // capped
  backoff = Math.random() * backoff; // with jitter
  return backoff;
}

export default calculateBackoff;
