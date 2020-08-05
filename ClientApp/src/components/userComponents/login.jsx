import React from "react";
import Form from "../generic/form";
import Joi from "joi";
import { login, resetPass } from "../../services/sharedServices/loginService";
import { errorToast, info } from "../../library/toasts";

class LoginComponent extends Form {
  state = {
    data: { username: "", pass: "" },

    //storing errors
    errors: {}
  };

  //form schema
  schema = {
    username: Joi.string()
      .required()
      .label("Login")
      .email(),
    pass: Joi.string()
      .required()
      .label("Password")
      .min(6)
  };

  render() {
    return (
      <div className="wrapper ">
        <div className="behaviour--inner--centered">
          <h2 className="headline headline--centered">Login</h2>
          {this.renderForm(this.renderContent())}
        </div>
      </div>
    );
  }

  renderContent = () => {
    return (
      <React.Fragment>
        {this.renderInput(
          "username",
          "E-mail",
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
          {this.renderButton(
            "Reset Password",
            "btn__large",
            this.resetPassword
          )}
        </div>
      </React.Fragment>
    );
  };

  doSubmit = async function() {
    var result = await this.callLogin();

    if (result.status === 200 && result.data) this.reload(result.data);
    else {
      errorToast(result.data);
    }
  };

  resetPassword = async e => {
    e.preventDefault();

    const result = await resetPass(
      this.state.data.username,
      this.state.data.pass
    );
    console.log(result);
    if (result.status === 200)
      info("Reset link has been sent to your email address");
    else {
      errorToast(result.data);
    }
  };

  callLogin = async () => {
    return await login(this.state.data);
  };

  reload = jwt => {
    sessionStorage.setItem("token", jwt);
    const { state } = this.props && this.props.location; //get data passed from Route component; if nothing passed than this.props.location.state===null
    window.location = state ? state.from.pathname : "/"; //reload
  };
}

export default LoginComponent;
