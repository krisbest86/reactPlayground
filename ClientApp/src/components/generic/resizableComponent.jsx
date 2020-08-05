import React, { Component } from "react";

class ResizableComponent extends Component {
  state = {};
  componentDidMount() {
    window.addEventListener("resize", this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  render() {
    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        resize: this.resize
      });
    });

    return <div>{children}</div>;
  }

  resize = () => {
    this.setState({});
  };
}

export default ResizableComponent;
