/* global fetch */
import { SUCCESS, CLIENT_ERROR, NETWORK_ERROR } from "./constants";

function request(config) {
  const { url, ...options } = config;
  fetch(url, options).then(response => {
    if (response.ok) {
      return extractBody(response).then(body => [SUCCESS, body]);
    }

    if (400 <= response.status && response.status < 500) {
      return extractBody(response).then(body => [CLIENT_ERROR, body]);
    }

    return extractBody(response).then(body => [NETWORK_ERROR, body]);
  });
}

function extractBody(response) {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return response.text();
  }
}

export default request;
