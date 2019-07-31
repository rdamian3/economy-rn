import axios from "axios";
import { comunication, session } from "./index";
import { API_URL } from "./../../utils/utils";
import {
  SET_MOVEMENTS,
  SET_TOTAL,
  SET_FILTERED_MOVEMENTS,
  CLEAR_FILTERED_MOVEMENTS
} from "./types";

export function addMovement(data) {
  return dispatch => {
    dispatch(comunication.startFetching());
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userToken = localStorage.getItem("userToken");
    session.sessionHandler(userData, userToken, () => {
      axios
        .post(
          API_URL + "/movement",
          {
            amount: data.amount,
            category: data.category,
            date: data.date,
            description: data.description,
            userId: userData._id
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: userToken
            }
          }
        )
        .then(res => {
          dispatch(
            comunication.setMessage({
              message: "Movimiento agregado",
              type: "success",
              kind: "movement"
            })
          );
          dispatch(getMovements());
        })
        .catch(e => {
          dispatch(
            comunication.setMessage({
              message: e.response.data.message,
              type: "error",
              kind: "movement"
            })
          );
          dispatch(comunication.stopFetching());
        });
    });
  };
}

export function getMovements() {
  return dispatch => {
    dispatch(comunication.startFetching());
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userToken = localStorage.getItem("userToken");
    debugger;
    session.sessionHandler(userData, userToken, () => {
      axios
        .get(API_URL + "/movement", {
          params: { userId: userData._id },
          headers: {
            "Content-Type": "application/json",
            authorization: userToken
          }
        })
        .then(res => {
          if (res) {
            dispatch(setMovements(res.data.movements));
            dispatch(calculateTotal(res.data.movements));
            dispatch(filterMovementsByAmountAndCategory(res.data.movements));
          }
          dispatch(comunication.stopFetching());
        })
        .catch(e => {
          dispatch(
            comunication.setMessage({
              message: e.response.data.message,
              type: "error",
              kind: "movement"
            })
          );
          dispatch(comunication.stopFetching());
        });
    });
  };
}

export function updateMovement(data) {
  return dispatch => {
    dispatch(comunication.startFetching());
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userToken = localStorage.getItem("userToken");
    axios
      .put(
        API_URL + "/movement/" + data._id,
        {
          userid: userData._id,
          amount: data.amount,
          description: data.description,
          category: data.category,
          date: data.date
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: userToken
          }
        }
      )
      .then(response => {
        dispatch(getMovements());
        dispatch(
          comunication.setMessage({
            message: "Movimiento actualizado",
            type: "success",
            kind: "movement_update"
          })
        );
      })
      .catch(error => {
        dispatch(
          comunication.setMessage({
            message: "Error al actualizar",
            type: "error",
            kind: "movement_update"
          })
        );
      });
  };
}

export function deleteMovement(data) {
  return dispatch => {
    dispatch(comunication.startFetching());
    const userToken = localStorage.getItem("userToken");
    axios
      .delete(API_URL + "/movement/" + data._id, {
        headers: {
          "Content-Type": "application/json",
          authorization: userToken
        }
      })
      .then(response => {
        dispatch(getMovements());
        dispatch(comunication.stopFetching());
      })
      .catch(error => {
        dispatch(comunication.stopFetching());
      });
  };
}

function calculateTotal(data) {
  return dispatch => {
    const total = data.reduce(function(accumulator, currentValue) {
      return accumulator + currentValue.amount;
    }, 0);
    dispatch(setTotal(total));
  };
}

function filterMovementsByAmountAndCategory(data) {
  return dispatch => {
    dispatch(clearFilteredMovements());

    let aux = [];

    data
      .map(elem => {
        return {
          amount: elem.amount,
          category: elem.category.name
        };
      })
      .forEach(item => {
        if (aux[item.category]) {
          aux[item.category] = aux[item.category] + item.amount;
        } else {
          aux[item.category] = item.amount;
        }
      });
    dispatch(setFilteredMovements({ ...aux }));
  };
}

export function setMovements(data) {
  return {
    type: SET_MOVEMENTS,
    data
  };
}

export function setTotal(data) {
  return {
    type: SET_TOTAL,
    data
  };
}

export function setFilteredMovements(data) {
  return {
    type: SET_FILTERED_MOVEMENTS,
    data
  };
}

export function clearFilteredMovements() {
  return {
    type: CLEAR_FILTERED_MOVEMENTS
  };
}
