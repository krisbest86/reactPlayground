import React, { Component } from "react";
class DropDown extends Component {
  state = {
    visibility: false
  };

  render() {
    const { name, options, title } = this.props;
    const visibility = this.state.visibility ? "visible" : "hidden";

    const className = "dropDown " + (this.props.className || "");
    return (
      <div className={className}>
        <ul>
          <li>
            <span style={{ fontSize: "1rem" }} onClick={this.toggleDropDown}>
              {title || "List of " + name}
            </span>
            <ul style={{ visibility: visibility }}>
              {options &&
                options.map(
                  option =>
                    option && (
                      <li key={option}>
                        <a onClick={() => this.onSelectedOption(name, option)}>
                          {option}
                        </a>
                      </li>
                    )
                )}
            </ul>
          </li>
        </ul>
      </div>
    );
  }

  onSelectedOption = (name, value) => {
    if (this.props.onSelectedFormDataList)
      this.props.onSelectedFormDataList(name, value);

    if (this.props.onSelectedDropDown)
      this.props.onSelectedDropDown(name, value);

    this.toggleDropDown();
  };

  toggleDropDown = () => {
    let { visibility } = this.state;

    visibility = !visibility;
    this.setState({ visibility });
  };
}

export default DropDown;
