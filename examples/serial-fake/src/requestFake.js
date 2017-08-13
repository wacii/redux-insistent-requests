const NETWORK_ERROR = "NETWORK_ERROR";
const SUCCESS = "SUCCESS";

function requestFake(_config) {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      if (Math.random() < 0.75) {
        resolve([NETWORK_ERROR, ""]);
      } else {
        resolve([SUCCESS, ""]);
      }
    }, 300)
  });
}

export default requestFake;
