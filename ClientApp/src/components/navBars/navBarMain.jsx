import React, { Component } from "react";
import NavBar from "../generic/navBarGeneric";

class NavBarMain extends Component {
  state = { checked: false };

  render() {
    return <NavBar navName={"navbar--main"} returnTabs={this.returnTabs} />;
  }

  returnTabs = () => {
    const { user } = this.props;

    // console.log(user);

    if (user) return [{ name: "Log out", link: "/logout" }];

    return [
      { name: "Login", link: "/login" },
      {
        name: "Register",
        link: "/register",
        additionalClasses: "mr-auto"
      }
    ];
  };
}

export default NavBarMain;
