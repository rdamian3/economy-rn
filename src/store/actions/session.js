import axios from "axios";
import { comunication } from "./index";
import { REMOVE_USER_DATA, SET_TOKEN, SET_USER_DATA } from "./types";
import { API_URL } from "./../../utils/utils";

export function sessionHandler(userData, userToken, cb) {
  return dispatch => {
    const testToken = userToken ? userToken : localStorage.getItem("userToken");
    const testData = userData
      ? userData
      : JSON.parse(localStorage.getItem("userData"));

    if (testToken !== "undefined" && testToken !== null) {
      axios
        .get(API_URL + "/hasauth", {
          headers: {
            "Content-Type": "application/json",
            authorization: testToken
          }
        })
        .then(res => {
          localStorage.setItem("userData", JSON.stringify(testData));
          localStorage.setItem("userToken", testToken);
          dispatch(setUserData(testData));
          dispatch(setToken(testToken));
          cb();
        })
        .catch(e => {
          if (e.response.status === 401) {
            localStorage.removeItem("userToken");
            localStorage.removeItem("userData");
            dispatch(removeUserData());
            dispatch(
              comunication.setMessage({
                message: "Su sesión ha expirado...",
                type: "error",
                kind: "user"
              })
            );
          }
        });
    } else if (cb) {
      cb();
    }
  };
}

export function setUserData(data) {
  return {
    type: SET_USER_DATA,
    data
  };
}

export function removeUserData() {
  return {
    type: REMOVE_USER_DATA
  };
}

export function setToken(data) {
  return {
    type: SET_TOKEN,
    data
  };
}
