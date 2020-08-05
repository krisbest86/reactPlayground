import React, { Component } from "react";
import Text from "../generic/textComponent";

import _ from "lodash";

class LabelTextCentered extends Component {
  render() {
    let classes = "label--textCentered label--noBorder ";

    if (this.props.className) classes += this.props.className;

    // const style = {
    //   height: returnHeightBasedOnScreen(5, 15, 2),
    //   width: returnWidthBasedOnScreen(20, 70, 2)
    // };

    return (
      <div
        key={this.props.index}
        className={classes}
        onClick={this.props.onClick}
      >
        <Text>{this.props.text}</Text>
      </div>
    );
  }
}

export default LabelTextCentered;
