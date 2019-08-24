import axios from 'axios';
import {
  comunication, movement, category, session,
} from './index';
import API_URL from '../../utils/utils';
import userResponse from '../../utils/responseHandler';

export function doSignup(data) {
  return (dispatch) => {
    dispatch(comunication.startFetching());
    axios
      .post(
        `${API_URL}/signup`,
        {
          email: data.email,
          password: data.password,
          displayName: data.displayName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => {
        const userData = res.data.user;
        const userToken = res.data.token;
        dispatch(
          session.sessionHandler(userData, userToken, () => {
            dispatch(movement.getMovements());
            dispatch(category.getCategories());

            const message = userResponse(res);
            dispatch(
              comunication.setMessage({
                message,
                type: 'success',
                kind: 'user-signup',
              }),
            );
            dispatch(comunication.stopFetching());
          }),
        );
      })
      .catch((res) => {
        const message = userResponse(res.response);
        dispatch(
          comunication.setMessage({
            message,
            type: 'error',
            kind: 'user',
          }),
        );
        dispatch(comunication.stopFetching());
      });
  };
}

export function doSignin(data) {
  return (dispatch) => {
    dispatch(comunication.startFetching());

    axios
      .post(
        `${API_URL}/signin`,
        { email: data.email, password: data.password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => {
        const userData = res.data.user;
        const userToken = res.data.token;
        dispatch(
          session.sessionHandler(userData, userToken, () => {
            dispatch(movement.getMovements());
            dispatch(category.getCategories());
            const message = userResponse(res);
            dispatch(
              comunication.setMessage({
                message,
                type: 'success',
                kind: 'user',
              }),
            );
            dispatch(comunication.stopFetching());
          }),
        );
      })
      .catch((res) => {
        dispatch(comunication.stopFetching());
        const message = userResponse(res.response);
        dispatch(
          comunication.setMessage({
            message,
            type: 'error',
            kind: 'user',
          }),
        );
      });
  };
}

export function doUpdate(data) {
  return (dispatch) => {
    dispatch(comunication.startFetching());
    const userToken = localStorage.getItem('userToken');
    axios
      .put(
        `${API_URL}/updateuser`,
        {
          email: data.email,
          password: data.password,
          displayName: data.displayName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: userToken,
          },
        },
      )
      .then((res) => {
        dispatch(
          session.sessionHandler(res.data.user, userToken, () => {
            dispatch(
              comunication.setMessage({
                message: 'Tus datos fueron actualizados',
                type: 'success',
                kind: 'user',
              }),
            );
            dispatch(comunication.stopFetching());
          }),
        );
      })
      .catch((res) => {
        dispatch(comunication.stopFetching());
        dispatch(
          comunication.setMessage({
            message: res.response.data.message,
            type: 'error',
            kind: 'user',
          }),
        );
      });
  };
}

export function doLogout() {
  return (dispatch) => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    dispatch(session.removeUserData());
  };
}

export function doDelete() {
  return (dispatch) => {
    dispatch(comunication.startFetching());
    const userToken = localStorage.getItem('userToken');
    axios
      .delete(`${API_URL}/deleteuser`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: userToken,
        },
      })
      .then(() => {
        dispatch(
          comunication.setMessage({
            message: 'Usuario eliminado',
            type: 'success',
            kind: 'user',
          }),
        );
        dispatch(doLogout());
        dispatch(session.removeUserData());
        dispatch(comunication.stopFetching());
      })
      .catch(() => {
        dispatch(
          comunication.setMessage({
            message: 'No se pudo eliminar al usuario...',
            type: 'error',
            kind: 'user',
          }),
        );
        dispatch(comunication.stopFetching());
      });
  };
}

export function doForgot(email) {
  return (dispatch) => {
    dispatch(comunication.startFetching());
    axios
      .post(
        `${API_URL}/resetpassword`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(() => {
        dispatch(
          comunication.setMessage({
            message: 'Te hemos enviado un email',
            type: 'success',
            kind: 'user',
          }),
        );
      })
      .catch((res) => {
        dispatch(
          comunication.setMessage({
            message: res.response.data.message,
            type: 'error',
            kind: 'user',
          }),
        );
      });
  };
}

export function doUpload(file) {
  return (dispatch) => {
    dispatch(comunication.startFetching());
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userToken = localStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('avatar', file);
    axios
      .post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-type': 'application/json',
          authorization: userToken,
          bucket: userData.bucket,
        },
      })
      .then((res) => {
        dispatch(
          session.sessionHandler(res.data.user, userToken, () => {
            dispatch(
              comunication.setMessage({
                message: 'Foto actualizada!',
                type: 'success',
                kind: 'user',
              }),
            );
            dispatch(comunication.stopFetching());
          }),
        );
      })
      .catch(() => {
        dispatch(
          comunication.setMessage({
            message: 'No pudimos actualizar tu foto.',
            type: 'error',
            kind: 'user',
          }),
        );
        dispatch(comunication.stopFetching());
      });
  };
}
