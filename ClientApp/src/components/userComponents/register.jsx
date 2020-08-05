import React from "react";
import Form from "../generic/form";
import Joi from "joi";
import { register } from "../../services/sharedServices/userService";
import { info, errorToast } from "../../library/toasts";

class Register extends Form {
  state = {
    data: { email: "", pass: "" },
    errors: {}
  };

  //form schema
  schema = {
    pass: Joi.string()
      .required()
      .min(6),
    email: Joi.string()
      .email()
      .required()
  };

  render() {
    return (
      <div className="wrapper ">
        <div className="behaviour--inner--centered">
          <h2 className="headline headline--centered">Register</h2>
          {this.renderForm(this.renderContent())}
        </div>
      </div>
    );
  }

  renderContent = () => {
    return (
      <React.Fragment>
        {this.renderInput(
          "email",
          "Login",
          "email",
          "Enter e-mail",
          "input--login",
          {
            hideLabels: true
          }
        )}
        {this.renderInput(
          "pass",
          "Password",
          "password",
          "Enter password",
          "input--login",
          {
            hideLabels: true
          }
        )}
        <div className="behaviour--centered behaviour--marginVertical ">
          {this.renderButton("Submit", "btn__large")}
        </div>
      </React.Fragment>
    );
  };
  doSubmit = async () => {
    try {
      const result = await register(this.state.data);

      console.log(result);
      if (result.status === 200)
        info(
          `${this.state.data.email} registered. Activation link was sent to your e-mail`,
          5000
        );
      else errorToast(result.data);

      //redirect
      // this.props.history.push("/");
      // window.location = "/"; //full reload
    } catch (ex) {
      if (ex.response && ex.response.status > 400) {
        const errors = { ...this.state.errors };

        errors.email = ex.response.data;
        console.log(errors);
        this.setState({ errors });
      }
    }
  };
}

export default Register;
