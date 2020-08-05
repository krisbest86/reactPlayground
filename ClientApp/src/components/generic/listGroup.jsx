import React, { Component } from "react";

class ListGroup extends Component {
  render() {
    // console.log(this.props.listItems);
    // console.log(this.props.current);

    return (
      <div className="list behaviour--centered wrapper">
        <ul className="list__ul">
          {this.props.listItems.map(type => (
            <li
              className={
                this.props.current === this.getValueFromList(type)
                  ? "list__ul__li list__ul__li--selected"
                  : "list__ul__li"
              }
              key={this.getKeyFromList(type)}
              onClick={() => this.props.onClicked(type)}
            >
              <a href="#">
                <strong>{this.getValueFromList(type)}</strong>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  getKeyFromList = type => {
    if (this.props.noKey) return type;

    return type[ListGroup.defaultProps.textProperty];
  };

  getValueFromList = type => {
    if (this.props.noKey) return type;

    return type[ListGroup.defaultProps.valueProperty];
  };
}

ListGroup.defaultProps = {
  value: "formation",
  key: "_id"
};

export default ListGroup;
