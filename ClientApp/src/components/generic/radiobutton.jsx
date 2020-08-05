import React, { Component } from "react";

class RadioButton extends Component {
  state = {};
  render() {
    // console.log(this.props);
    return (
      <React.Fragment>
        <div>
          {this.props.options &&
            this.props.options.map(a => this.renderOption(a))}
        </div>
      </React.Fragment>
    );
  }

  renderOption = title => {
    const name = "radio" + title + this.props.parentKey;

    const checked =
      this.props.checked === title ||
      (!this.props.checked && title === this.props.default);
    return (
      <div key={name}>
        <input
          id={title}
          name={name}
          type="radio"
          checked={checked}
          onChange={this.onChange}
        />
        <label htmlFor={name}>{title}</label>
      </div>
    );
  };

  onChange = e => {
    // this.setState({ checked: e.target.id });
    // console.log(e.target.id);
    this.props.onCheckedChanged(e.target.id);
  };
}

export default RadioButton;
