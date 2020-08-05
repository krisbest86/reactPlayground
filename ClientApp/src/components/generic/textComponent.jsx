import React, { Component } from "react";
import { returnHeightBasedOnScreen } from "../../library/utils";

class TextComponent extends Component {
  state = {};
  render() {
    return <span>{this.props.children}</span>;
  }
}

export default TextComponent;
