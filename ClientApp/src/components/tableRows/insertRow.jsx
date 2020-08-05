import React, { Component } from "react";
import Form from "../generic/formAdmin";

class InsertRow extends Form {
  state = {
    data: {},
    dataDatalistInputs: {},
    errors: {},
  };

  constructor(props) {
    super();
    this.state.data = this.resetNewRow(props);
    this.state.dataDatalistInputs = { ...props.dataDatalistInputs };
  }

  get schema() {
    return this.setValidationTableEntitySchema(this.props);
  }

  render() {
    return (
      <tr>
        <td style={{ verticalAlign: "middle" }}>
          <i
            className="fa fa-plus-circle"
            style={{ color: "green" }}
            onClick={this.insertRow}
          />
        </td>
        {Object.keys(this.props.columnsDefinition).map((column) => (
          <td key={"insert" + column}>
            {this.renderCell(column, this.props.columnsDefinition[column], "")}
          </td>
        ))}
      </tr>
    );
  }

  resetNewRow = (props) => {
    return Object.keys(props.columnsDefinition).reduce((object, column) => {
      object[column] = "";
      return object;
    }, {});
  };

  insertRow = () => {
    console.log(this.state.data);
    this.props.insertRow(this.state.data);
  };
}

export default InsertRow;
