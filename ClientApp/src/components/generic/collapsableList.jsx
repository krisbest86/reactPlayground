import React, { Component } from "react";

class CollapsableList extends Component {
  state = { isCollapsed: true };
  render() {
    const classes =
      " collapseList clickable " +
      (this.state.isCollapsed && !this.props.isSelected
        ? "collapseList--notvisible"
        : " collapseList--visible");

    return (
      <React.Fragment>
        <div className={classes} onClick={this.toggleCollapse}>
          <label>{this.props.label}</label>
          <ul>
            {this.props.events.map(a => (
              <li
                key={a.index}
                onClick={() => this.props.onSelectedEvent(this.props.label, a)}
              >
                {a.name}
              </li>
            ))}
          </ul>
        </div>
      </React.Fragment>
    );
  }

  toggleCollapse = () => {
    let { isCollapsed } = this.state;

    this.setState({ isCollapsed: !isCollapsed });
  };
}

export default CollapsableList;
