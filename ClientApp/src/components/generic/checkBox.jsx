import React, { Component } from "react";
import { CSSTransition } from "react-transition-group";

class CheckBox extends Component {
  state = {};

  render() {
    const { labels, checked, name } = this.props;

    const classes =
      "label--checkboxOff " + (checked ? "label--checkboxOn" : "");
    return (
      <label className={classes} name={name} onClick={this.props.handleChange}>
        {this.renderIcon(checked)}
        {checked ? labels.checked : labels.notChecked}
      </label>
    );
  }

  componentDidUpdate = () => {};

  renderIcon = checked => {
    return (
      <CSSTransition in={checked} appear={true} timeout={300} classNames="icon">
        {checked ? (
          <i className="fa fa-check"></i>
        ) : (
          <i className="fa fa-plus"></i>
        )}
      </CSSTransition>
    );
  };
}

export default CheckBox;
