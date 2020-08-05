import React, { Component } from "react";

class ProgressBar extends Component {
  state = {};
  render() {
    return (
      <div className="progress__container wrapper page-section">
        <progress className="progress "> </progress>
      </div>
    );
  }
}

export default ProgressBar;
