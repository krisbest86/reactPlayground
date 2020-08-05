import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import LabelTextCentred from "../labels/labelTextCentered";

class NavBarTab extends Component {
  state = {};
  render() {
    const { name, link, additionalClasses } = this.props;

    return this.renderLink(name, link);
  }

  renderLink = (name, link) => {
    return (
      <NavLink key={name} to={link} onClick={this.props.handleClick}>
        <LabelTextCentred text={name} />
      </NavLink>
    );
  };

  returnElementClasses = additionalClasses => {
    if (additionalClasses && additionalClasses.charAt(0) !== " ")
      additionalClasses = " " + additionalClasses;

    return "navbar-nav" + (additionalClasses || "");
  };
}

export default NavBarTab;
