import React, { Component } from "react";
import Input from "./input";
import Button from "./button";
import DropDown from "./dropdown";

class Datalist extends Component {
  state = { isInputFocus: false };

  render() {
    const {
      name,
      parentkey,
      onChange,
      addElement,
      deleteElement,
      options,
      value,
      error,
      ...rest
    } = this.props;

    return (
      <div className="form-group">
        <Input
          getFocus={this.state.isInputFocus}
          type="text"
          list={name + parentkey}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="add"
        />
        {this.isNewValue(value, options) && (
          <Button
            name={"add"}
            className="btn btn-primary"
            onClick={() => addElement(name, value)}
          />
        )}

        {this.isSelectedFormDataList(value, options) && (
          <Button
            name={"delete"}
            className="btn btn-primary"
            onClick={() => deleteElement(name, value)}
          />
        )}
        {options && (
          <DropDown
            name={name}
            options={options}
            onSelectedFormDataList={this.onSelectedDropDown}
          />
        )}

        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    );
  }

  onSelectedDropDown = (name, option) => {
    this.props.onSelectedFormDataList(name, option);

    this.setState({ isInputFocus: true });
  };

  isSelectedFormDataList = (value, options) => {
    return options && options.indexOf(value) > -1;
  };
  isNewValue = (value, options) => {
    return value && options.indexOf(value) === -1;
  };
}

export default Datalist;
