import React, { Component } from "react";
import { Redirect } from "react-router-dom";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI

    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(error);
    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      // return <Redirect to="/error" />;
      this.state.hasError = false;
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
