import axios from 'axios';
import { comunication, session } from './index';
import API_URL from '../../utils/utils';
import {
  SET_MOVEMENTS,
  SET_TOTAL,
  SET_FILTERED_MOVEMENTS,
  CLEAR_FILTERED_MOVEMENTS,
} from './types';

export function setMovements(data) {
  return {
    type: SET_MOVEMENTS,
    data,
  };
}

export function setTotal(data) {
  return {
    type: SET_TOTAL,
    data,
  };
}

function calculateTotal(data) {
  return (dispatch) => {
    const total = data.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);
    dispatch(setTotal(total));
  };
}

export function setFilteredMovements(data) {
  return {
    type: SET_FILTERED_MOVEMENTS,
    data,
  };
}

export function clearFilteredMovements() {
  return {
    type: CLEAR_FILTERED_MOVEMENTS,
  };
}

function filterMovementsByAmountAndCategory(data) {
  return (dispatch) => {
    dispatch(clearFilteredMovements());

    const aux = [];

    data
      .map(elem => ({
        amount: elem.amount,
        category: elem.category.name,
      }))
      .forEach((item) => {
        if (aux[item.category]) {
          aux[item.category] += item.amount;
        } else {
          aux[item.category] = item.amount;
        }
      });
    dispatch(setFilteredMovements({ ...aux }));
  };
}

export function getMovements() {
  return (dispatch) => {
    dispatch(comunication.startFetching());
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userToken = localStorage.getItem('userToken');
    dispatch(
      session.sessionHandler(userData, userToken, () => {
        axios
          .get(`${API_URL}/movement`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: userToken,
            },
          })
          .then((res) => {
            if (res) {
              dispatch(setMovements(res.data.movements));
              dispatch(calculateTotal(res.data.movements));
              dispatch(filterMovementsByAmountAndCategory(res.data.movements));
            }
            dispatch(comunication.stopFetching());
          })
          .catch((e) => {
            dispatch(
              comunication.setMessage({
                message: e.response.data.message,
                type: 'error',
                kind: 'movement',
              }),
            );
            dispatch(comunication.stopFetching());
          });
      }),
    );
  };
}

export function addMovement(data) {
  return (dispatch) => {
    dispatch(comunication.startFetching());
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userToken = localStorage.getItem('userToken');
    dispatch(
      session.sessionHandler(userData, userToken, () => {
        axios
          .post(
            `${API_URL}/movement`,
            {
              amount: data.amount,
              category: data.category,
              date: data.date,
              description: data.description,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                authorization: userToken,
              },
            },
          )
          .then(() => {
            dispatch(
              comunication.setMessage({
                message: 'Movimiento agregado',
                type: 'success',
                kind: 'movement',
              }),
            );
            dispatch(getMovements());
          })
          .catch((e) => {
            dispatch(
              comunication.setMessage({
                message: e.response.data.message,
                type: 'error',
                kind: 'movement',
              }),
            );
            dispatch(comunication.stopFetching());
          });
      }),
    );
  };
}

export function updateMovement(data) {
  return (dispatch) => {
    dispatch(comunication.startFetching());
    const userToken = localStorage.getItem('userToken');
    axios
      .put(
        `${API_URL}/movement/${data._id}`,
        {
          amount: data.amount,
          description: data.description,
          category: data.category,
          date: data.date,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: userToken,
          },
        },
      )
      .then(() => {
        dispatch(getMovements());
        dispatch(
          comunication.setMessage({
            message: 'Movimiento actualizado',
            type: 'success',
            kind: 'movement_update',
          }),
        );
      })
      .catch(() => {
        dispatch(
          comunication.setMessage({
            message: 'Error al actualizar',
            type: 'error',
            kind: 'movement_update',
          }),
        );
      });
  };
}

export function deleteMovement(data) {
  return (dispatch) => {
    dispatch(comunication.startFetching());
    const userToken = localStorage.getItem('userToken');
    axios
      .delete(`${API_URL}/movement/${data._id}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: userToken,
        },
      })
      .then(() => {
        dispatch(getMovements());
        dispatch(comunication.stopFetching());
      })
      .catch(() => {
        dispatch(comunication.stopFetching());
      });
  };
}
