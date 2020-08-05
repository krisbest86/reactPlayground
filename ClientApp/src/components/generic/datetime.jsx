import React, { Component } from "react";
import { parseIsoDatetime } from "../../library/utils";

class DatetimeComponent extends Component {
  state = {};
  render() {
    const { value, onChange, name } = this.props;

    return (
      <input
        type="datetime-local"
        value={parseIsoDatetime(value)}
        onChange={onChange}
        name={name}
      ></input>
    );
  }
}

export default DatetimeComponent;
