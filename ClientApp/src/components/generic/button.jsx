import React, { Component } from "react";

class ButtonComponent extends Component {
  render() {
    let { name, disabled, className, onClick } = this.props;

    // console.log(disabled);
    if (!className) className = "btn";

    if (disabled)
      return (
        <button type="submit" disabled className={className}>
          {name}
        </button>
      );

    if (!onClick)
      return (
        <button type="submit" className={className}>
          {name}
        </button>
      );

    return (
      <button type="submit" className={className} onClick={onClick}>
        {name}
      </button>
    );
  }
}

export default ButtonComponent;
