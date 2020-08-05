import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { getCurrentToken } from "../../services/sharedServices/loginService";

class ProtectedRoute extends Component {
  state = {};
  render() {
    const { path, component: Component, render, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props => {
          if (!getCurrentToken())
            return (
              <Redirect
                to={{ pathname: "/login", state: { from: props.location } }}
              />
            );

          return Component ? <Component {...props} /> : render(props);
        }}
      />
    );
  }
}

export default ProtectedRoute;
