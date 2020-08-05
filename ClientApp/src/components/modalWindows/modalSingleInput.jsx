import React, { Component } from "react";
import Form from "../generic/form";
import Joi from "joi";

class InputModal extends Form {
  state = {
    errors: {}
  };

  schema = this.schemaObject;

  get schemaObject() {
    const schema = {};

    schema[this.props.inputId] = Joi.string()
      .required()
      .label(this.props.labelInput);

    return schema;
  }

  constructor(props) {
    super(props);

    const data = {};
    data[this.props.inputId] = "";
    this.state.data = data;
  }

  render() {
    return (
      <div className="wrapper ">
        <div className="behaviour--inner--centered">
          {this.renderForm(this.renderContent())}
        </div>
      </div>
    );
  }

  renderContent = () => {
    return (
      <React.Fragment>
        {this.renderInput(
          this.props.inputId,
          "Name",
          "input",
          this.props.inputPlaceholder,
          "input--login",
          {
            hideLabels: true
          }
        )}

        <div className="behaviour--centered behaviour--marginVertical ">
          {this.renderButton(
            this.props.buttonLabel || "Zatwierdź",
            "btn__large"
          )}
        </div>
      </React.Fragment>
    );
  };
  getSchema = () => {
    const schema = {};
    schema[this.props.inputId] = Joi.string()
      .required()
      .label("Team Name");

    return schema;
  };

  doSubmit = () => {
    this.props.onClick(this.state.data[this.props.inputId]);
  };
}

export default InputModal;
