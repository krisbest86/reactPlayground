import React, { Component } from "react";

class Select extends Component {
  state = {};

  render() {
    const { name, label, options, keyParent, error, ...rest } = this.props;

    return (
      // <div className="container container--column">
      <React.Fragment>
        {this.props.showLabel && <label htmlFor={name}>{label}</label>}
        <select name={name} {...rest}>
          {!this.props.hideEmpty && <option value="" />}
          {options &&
            options.map(option => this.renderOption(option, keyParent))}
        </select>
        {error && <div className="alert alert-danger">{error}</div>}
      </React.Fragment>
    );
  }

  renderOption = (option, keyParent) => {
    if (option.hasOwnProperty("_id")) {
      // console.log(option);
      return (
        <option key={option._id} value={option._id}>
          {option.name}
        </option>
      );
    } else {
      return (
        <option key={option + keyParent} value={option}>
          {option}
        </option>
      );
    }
  };
}

export default Select;
