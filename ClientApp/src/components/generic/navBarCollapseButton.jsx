import React, { Component } from "react";

class NavBarCollapseComponent extends Component {
  state = {};
  render() {
    const { btnClasses, handleClick, checked } = this.props;
    const labelClasses = checked ? "label--highlighted" : "";

    return (
      <div className={btnClasses} onClick={handleClick}>
        <label className={labelClasses}>
          <span />
          <span />
          <span />
        </label>
      </div>
    );
  }
}

export default NavBarCollapseComponent;
