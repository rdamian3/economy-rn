import axios from "axios";
import { comunication } from "./index";
import { SET_CATEGORIES } from "./types";
import { API_URL } from "./../../utils/utils";

export function addCategory(data) {
  return dispatch => {
    dispatch(comunication.startFetching());
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userToken = localStorage.getItem("userToken");
    axios
      .post(
        API_URL + "/category",
        {
          description: data.description,
          name: data.name,
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
            message: "Agregado correctamente",
            type: "success",
            kind: "category"
          })
        );
        dispatch(getCategories());
        dispatch(comunication.stopFetching());
      })
      .catch(e => {
        dispatch(
          comunication.setMessage({
            message: e.response.data.message,
            type: "error",
            kind: "category"
          })
        );
        dispatch(comunication.stopFetching());
      });
  };
}

export function getCategories() {
  return dispatch => {
    dispatch(comunication.startFetching());
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userToken = localStorage.getItem("userToken");
    axios
      .get(API_URL + "/category", {
        params: { userId: userData._id },
        headers: {
          "Content-Type": "application/json",
          authorization: userToken
        }
      })
      .then(res => {
        dispatch(setCategories(res.data.categories));
        dispatch(comunication.stopFetching());
      })
      .catch(e => {
        dispatch(comunication.stopFetching());
      });
  };
}

export function updateCategory(data) {
  return dispatch => {
    dispatch(comunication.startFetching());
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userToken = localStorage.getItem("userToken");
    axios
      .get(API_URL + "/category", {
        params: { userId: userData._id },
        headers: {
          "Content-Type": "application/json",
          authorization: userToken
        }
      })
      .then(res => {
        dispatch(setCategories(res.data.categories));
        dispatch(comunication.stopFetching());
      })
      .catch(e => {
        dispatch(comunication.stopFetching());
      });
  };
}

export function deleteCategory(data) {
  return dispatch => {
    dispatch(comunication.startFetching());
    const userToken = localStorage.getItem("userToken");
    axios
      .delete(API_URL + "/category", {
        headers: {
          "Content-Type": "application/json",
          authorization: userToken,
          categoryId: data._id
        }
      })
      .then(res => {
        dispatch(getCategories());
        dispatch(comunication.stopFetching());
      })
      .catch(e => {
        dispatch(comunication.stopFetching());
      });
  };
}

export function setCategories(data) {
  return {
    type: SET_CATEGORIES,
    data
  };
}
