import {
  START_FETCHING, STOP_FETCHING, SET_MESSAGE, CLEAR_MESSAGE,
} from './types';

export function startFetching() {
  return {
    type: START_FETCHING,
  };
}

export function stopFetching() {
  return {
    type: STOP_FETCHING,
  };
}

export function setMessage(data) {
  return {
    type: SET_MESSAGE,
    data,
  };
}

export function clearMessage() {
  return {
    type: CLEAR_MESSAGE,
  };
}
