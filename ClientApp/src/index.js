//modules
import React from "react";
import ReactDOM from "react-dom";

//redux
import { Provider } from "react-redux";
import store from "./store/configureStore";

//css
import "./styles/styles.css";
import "font-awesome/css/font-awesome.css";

//components
import App from "./app";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/errorHandler";

console.log(process.env.REACT_APP_SERWIS);
// console.log(process.env.REACT_APP_ENTITY_SERVICE);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
