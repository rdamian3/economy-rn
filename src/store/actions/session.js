import axios from 'axios';
import { comunication, movement, category } from './index';
import { REMOVE_USER_DATA, SET_TOKEN, SET_USER_DATA } from './types';
import API_URL from '../../utils/utils';

export function setUserData(data) {
  return {
    type: SET_USER_DATA,
    data,
  };
}

export function removeUserData() {
  return {
    type: REMOVE_USER_DATA,
  };
}

export function setToken(data) {
  return {
    type: SET_TOKEN,
    data,
  };
}

export function reload() {
  return (dispatch) => {
    dispatch(movement.getMovements());
    dispatch(category.getCategories());
  };
}

export function sessionHandler(userData, userToken, cb) {
  return (dispatch) => {
    const testToken = userToken || localStorage.getItem('userToken');
    const testData = userData || JSON.parse(localStorage.getItem('userData'));

    if (testToken !== 'undefined' && testToken !== null) {
      axios
        .get(`${API_URL}/hasauth`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: testToken,
          },
        })
        .then(() => {
          localStorage.setItem('userData', JSON.stringify(testData));
          localStorage.setItem('userToken', testToken);
          dispatch(setUserData(testData));
          dispatch(setToken(testToken));
          cb();
        })
        .catch((e) => {
          if (!e.response) {
            dispatch(
              comunication.setMessage({
                message: 'Error de conexión...',
                type: 'error',
                kind: 'user',
              }),
            );
          } else if (e.response.status === 401) {
            dispatch(
              comunication.setMessage({
                message: 'Su sesión ha expirado...',
                type: 'error',
                kind: 'user',
              }),
            );
          }
          dispatch(comunication.stopFetching());
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          dispatch(removeUserData());
          cb();
        });
    } else if (cb) {
      cb();
    }
  };
}
