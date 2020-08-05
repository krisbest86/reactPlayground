import React, { Component } from "react";
import NavBarTab from "./navbarTab";

class NavBarTabs extends Component {
  state = {};
  render() {
    const { tabs, navBarId } = this.props;
    let className = "";

    if (this.props.className) className += " " + this.props.className;

    return (
      <div className={className} id={navBarId}>
        {this.returnTabs(tabs())}
      </div>
    );
  }

  returnTabs = tabs => {
    return tabs.map(tab => {
      return (
        <NavBarTab
          name={tab.name}
          link={tab.link}
          additionalClasses={tab.additionalClasses}
          key={tab.name}
          handleClick={this.props.handleClick}
        />
      );
    });
  };
}



export default NavBarTabs;
