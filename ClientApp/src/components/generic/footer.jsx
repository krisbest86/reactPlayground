import React, { Component } from "react";
import LabelTextCentered from "../labels/labelTextCentered";
import { NavLink } from "react-router-dom";

import { isMobileDevice } from "../../library/utils";

class Footer extends Component {
  state = {};
  render() {
    // console.log(window.innerHeight);

    const classes = "footer container";
    return (
      <div className={classes}>
        <LabelTextCentered text="© Copyright 2019. All Rights Reserved." />
        <NavLink key={"contactusLink"} to={"/contactus"} onClick={() => {}}>
          <LabelTextCentered text="Napisz do nas" />
        </NavLink>
      </div>
    );
  }
}

export default Footer;
