import axios from "axios";
import { comunication, movement, category } from "./index";
import { REMOVE_USER_DATA, SET_TOKEN, SET_USER_DATA } from "./types";
import { API_URL } from "./../../utils/utils";
import { userResponse } from "./../../utils/responseHandler";

export function doSignup(data) {
  return dispatch => {
    dispatch(comunication.startFetching());
    axios
      .post(
        API_URL + "/signup",
        {
          email: data.email,
          password: data.password,
          displayName: data.displayName
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(res => {
        const userData = res.data.user;
        const userToken = res.data.token;
        dispatch(
          sessionHandler(userData, userToken, () => {
            dispatch(movement.getMovements());
            dispatch(category.getCategories());

            const message = userResponse(res);
            dispatch(
              comunication.setMessage({
                message,
                type: "success",
                kind: "user-signup"
              })
            );
            dispatch(comunication.stopFetching());
          })
        );
      })
      .catch(res => {
        const message = userResponse(res.response);
        dispatch(
          comunication.setMessage({
            message,
            type: "error",
            kind: "user"
          })
        );
        dispatch(comunication.stopFetching());
      });
  };
}

export function doSignin(data) {
  return dispatch => {
    dispatch(comunication.startFetching());

    axios
      .post(
        API_URL + "/signin",
        { email: data.email, password: data.password },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(res => {
        const userData = res.data.user;
        const userToken = res.data.token;
        dispatch(
          sessionHandler(userData, userToken, () => {
            dispatch(movement.getMovements());
            dispatch(category.getCategories());
            const message = userResponse(res);
            dispatch(
              comunication.setMessage({
                message,
                type: "success",
                kind: "user"
              })
            );
            dispatch(comunication.stopFetching());
          })
        );
      })
      .catch(res => {
        dispatch(comunication.stopFetching());
        const message = userResponse(res.response);
        dispatch(
          comunication.setMessage({
            message,
            type: "error",
            kind: "user"
          })
        );
      });
  };
}

export function doUpdate(data) {
  return dispatch => {
    dispatch(comunication.startFetching());
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userToken = localStorage.getItem("userToken");
    axios
      .put(
        API_URL + "/updateuser",
        {
          userId: userData._id,
          email: data.email,
          password: data.password,
          displayName: data.displayName
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
          sessionHandler(res.data.user, userToken, () => {
            dispatch(
              comunication.setMessage({
                message: "Tus datos fueron actualizados",
                type: "success",
                kind: "user"
              })
            );
            dispatch(comunication.stopFetching());
          })
        );
      })
      .catch(res => {
        dispatch(comunication.stopFetching());
        dispatch(
          comunication.setMessage({
            message: res.response.data.message,
            type: "error",
            kind: "user"
          })
        );
      });
  };
}

export function doDelete() {
  return dispatch => {
    dispatch(comunication.startFetching());
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userToken = localStorage.getItem("userToken");
    axios
      .delete(API_URL + "/deleteuser/" + userData._id, {
        headers: {
          "Content-Type": "application/json",
          authorization: userToken
        }
      })
      .then(response => {
        dispatch(
          comunication.setMessage({
            message: "Usuario eliminado",
            type: "success",
            kind: "user"
          })
        );
        dispatch(removeUserData());
        dispatch(comunication.stopFetching());
      })
      .catch(res => {
        dispatch(
          comunication.setMessage({
            message: res.response.data.message,
            type: "error",
            kind: "user"
          })
        );
      });
  };
}

export function doForgot(email) {
  return dispatch => {
    dispatch(comunication.startFetching());
    axios
      .post(
        API_URL + "/resetpassword",
        { email },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        dispatch(
          comunication.setMessage({
            message: "Te hemos enviado un email",
            type: "success",
            kind: "user"
          })
        );
      })
      .catch(res => {
        dispatch(
          comunication.setMessage({
            message: res.response.data.message,
            type: "error",
            kind: "user"
          })
        );
      });
  };
}

export function doUpload(file) {
  return dispatch => {
    dispatch(comunication.startFetching());
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userToken = localStorage.getItem("userToken");
    let formData = new FormData();
    formData.append("avatar", file);
    axios
      .post(API_URL + "/upload", formData, {
        headers: {
          "Content-type": "application/json",
          authorization: userToken,
          bucket: userData.bucket,
          userId: userData._id
        }
      })
      .then(res => {
        dispatch(
          sessionHandler(res.data.user, userToken, () => {
            dispatch(
              comunication.setMessage({
                message: "Foto actualizada!",
                type: "success",
                kind: "user"
              })
            );
            dispatch(comunication.stopFetching());
          })
        );
      })
      .catch(res => {
        dispatch(
          comunication.setMessage({
            message: "No pudimos actualizar tu foto.",
            type: "error",
            kind: "user"
          })
        );
        dispatch(comunication.stopFetching());
      });
  };
}

export function doLogout() {
  return dispatch => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    dispatch(removeUserData());
  };
}

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
            cb();
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
