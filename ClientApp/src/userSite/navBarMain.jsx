import React, { Component } from "react";
import NavBar from "../components/generic/navBarGeneric";
import { isObjectEmpty } from "../library/utils";
import label from '../library/labelsManager'
class NavBarMain extends Component {
  state = { checked: false };

  render() {
    return <NavBar navName={"navbar--main"} returnTabs={this.returnTabs} />;
  }

  returnTabs = () => {
    const { user } = this.props;

    // console.log(user);

    if (!isObjectEmpty(user))
      return [
        {
          name: ` ${label("chairmanCabinet")} ${(user.name || user.email)}`,
          link: "/profile"
        },
        { name: "Dołącz do ligi", link: "/jointeam" },
        { name: "Log out", link: "/logout" }
      ];

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
