import axios from "axios";

import {
  errorToast
} from "../../library/toasts";
import {
  logout,
  getCurrentToken
} from "./loginService";

//global unexpected errors interceptors
//this code will run firstly when error occurs
axios.interceptors.response.use(null, error => {
  if (!error.response) {
    errorToast(error.message);
  } else if (error.response.status >= 500) {
    console.log(
      `${error.response.status}: internal server error - ${error.request.responseURL}`
    );
    return false
  } else if (error.response.status === 408) {
    if (getCurrentToken()) {
      logout()
    }
    window.location = "/login"
    return
  } else if (error.response.status >= 400 && error.response.status < 500) {
    if (error.response.data.indexOf("<body>")) {
      console.log(error.response);
      return error.response
    }

    errorToast(`Status ${error.response.status}: ${error.response.data}`);
  } else if (error.response.status >= 300 && error.response.status < 400) {
    console.log(`redirect ${error.message}`);
  } else {
    errorToast(`unexpected error ${error.message}`);
  }

  return Promise.reject(error);
});

function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

export default {
  get: axios.get,
  put: axios.put,
  patch: axios.patch,
  post: axios.post,
  delete: axios.delete,
  setJwt: setJwt
};