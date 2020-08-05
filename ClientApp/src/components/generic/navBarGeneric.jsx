import React, { Component } from "react";
import NavBarCollapseButton from "./navBarCollapseButton";
import NavBarTabs from "./navbarTabs";
import DropDown from "./dropdown";
import PropTypes from "prop-types";

class NavBarGeneric extends Component {
  state = {};

  render() {
    const navClasses = "navbar " + this.props.navName;
    const linksClasses =
      this.props.navName +
      "__links" +
      " navbar__links" +
      (this.props.checked && this.props.withButton ? "--enabled" : "");

    const btnClasses = "navbar__btn " + (this.props.btnClasses || "");

    // console.log(this.props.options);

    return (
      <React.Fragment>
        <div className={navClasses}>
          {this.props.navTitle && (
            <div className="navbar__header">
              {this.props.options && this.props.options.length > 1 ? (
                <DropDown
                  options={this.props.options}
                  name="your leagues"
                  className={"dropDown--left"}
                  onSelectedDropDown={this.props.onSelectedDropDown}
                ></DropDown>
              ) : (
                <div className="navbar__title">{this.props.navTitle}</div>
              )}
            </div>
          )}
          {this.props.withButton && (
            <NavBarCollapseButton
              btnClasses={btnClasses}
              handleClick={this.props.onClick}
              checked={this.props.checked}
            />
          )}
          <NavBarTabs
            tabs={this.props.returnTabs}
            className={linksClasses}
            handleClick={this.props.onClick}
          />
        </div>
      </React.Fragment>
    );
  }
}

NavBarGeneric.propTypes = {
  checked: PropTypes.bool,
  withButton: PropTypes.bool,
};

export default NavBarGeneric;
