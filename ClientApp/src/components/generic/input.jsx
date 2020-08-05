import React, { Component } from "react";

class InputComponent extends Component {
  state = {};

  constructor(props) {
    super(props);

    this.textInput = React.createRef();
    this.focus = this.focus.bind(this);
  }

  componentDidUpdate() {
    // console.log("componentDidUpdate");
    if (this.props.getFocus) this.focus();
  }

  renderInput() {
    const {
      name,
      type,
      onChange,
      value,
      getFocus,
      classes,
      flags,
      ...rest
    } = this.props;

    const optionalParams = {};
    if (this.props.placeholder)
      optionalParams.placeholder = this.props.placeholder;

    if (this.props.list) optionalParams.list = this.props.list;

    const classesBase =
      type === "number" ? "input behaviour--maxwidth3" : "input ";
    return (
      <input
        ref={this.textInput}
        type={type}
        className={classesBase + (classes || "")}
        value={value}
        name={name}
        id={name}
        onChange={onChange}
        {...optionalParams}
        {...rest}
      />
    );
  }
  render() {
    const { name, title, type, error, flags, classesDiv } = this.props;
    const className = " " + classesDiv;
    return (
      <div className={className}>
        <label
          className={flags && flags.hideLabels && "behaviour--notVisible"}
          htmlFor={name}
        >
          {title}
        </label>
        {this.renderInput()}
        {error && <div className="alert ">{error}</div>}
      </div>
    );
  }

  focus() {
    this.textInput.current.focus();
  }
}

export default InputComponent;
