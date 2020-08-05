import React, { Component } from "react";
import Form from "../generic/formAdmin";

import { getKeyTableTd } from "../../library/utils";

class UpdateRow extends Form {
  state = {
    data: {},
    dataDatalistInputs: {},
    errors: {},
    isUpdated: false,
  };

  constructor(props) {
    super();
    this.state.data = props.row;
    this.state.dataDatalistInputs = { ...props.dataDatalistInputs };
  }

  get schema() {
    return this.setValidationTableEntitySchema(this.props);
  }
  render() {
    // console.log(this.props.columnsDefinition);
    return (
      <tr>
        {(this.props.updateRow || this.props.deleteRow) && (
          <td style={{ verticalAlign: "middle" }}>
            {this.props.deleteRow && (
              <i
                className="fa fa-trash"
                style={{ color: "red" }}
                aria-hidden="true"
                onClick={() =>
                  this.handleDelete(
                    this.props.row._id,
                    this.props.row._partition
                  )
                }
                title={"Delete row"}
              />
            )}
            {this.props.updateRow && this.state.isUpdated && (
              <i
                className="fa fa-refresh"
                style={{ color: "green" }}
                aria-hidden="true"
                onClick={() =>
                  this.updateRow(this.props.row._id, this.props.row._partition)
                }
                title={"Update data"}
              />
            )}
          </td>
        )}

        {Object.keys(this.props.columnsDefinition).map((column) => (
          <td key={getKeyTableTd(this.props.row, column)}>
            {this.renderCell(
              column,
              this.props.columnsDefinition[column],
              getKeyTableTd(this.props.row, column)
            )}
          </td>
        ))}
      </tr>
    );
  }

  getUpdatedRow = (props) => {
    const row = Object.keys(this.props.columnsDefinition).reduce(
      (object, column) => {
        object[column] = this.state.data[column];
        return object;
      },
      {}
    );

    return row;
  };

  updateRow = (id, partition) => {
    const updatedRow = this.getUpdatedRow(this.props);
    updatedRow._id = id;
    updatedRow._partition = partition;

    this.props.updateRow(updatedRow, this.setUpdate);
  };

  setUpdate = (isUpdated) => {
    this.setState({ isUpdated });
  };

  handleDelete = (id, partition) => {
    this.props.deleteRow(id, partition);
  };
}

export default UpdateRow;
