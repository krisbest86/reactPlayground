import React, { Component } from "react";
import _ from "lodash";
import {
  getKeyTableTr,
  getKeyTableTd,
  getArrayFromObject
} from "../../library/utils";
import InsertRow from "../tableRows/insertRow";
import UpdateRow from "../tableRows/updateRow";

class TableBody extends Component {
  state = {};

  render() {
    // console.log(this.props.columnsDefinition);
    // console.log(this.props.tableData);
    const columns = Array.isArray(this.props.columnsDefinition)
      ? this.props.columnsDefinition
      : getArrayFromObject(this.props.columnsDefinition);

    return (
      <tbody>
        {this.props.tableData.length > 0 &&
          this.props.tableData.map(
            item =>
              ((this.props.deleteRow || this.props.updateData) && (
                <UpdateRow
                  columnsDefinition={this.props.columnsDefinition}
                  dataDatalistInputs={this.props.dataDatalistInputs}
                  row={item}
                  key={getKeyTableTr(item)}
                  deleteRow={this.props.deleteRow}
                  updateRow={this.props.updateData}
                  downloadFile={this.props.downloadFile}
                />
              )) || (
                <tr
                  key={getKeyTableTr(item)}
                  onClick={() => {
                    if (this.props.trOnClick) this.props.trOnClick(item);
                  }}
                >
                  {this.props.insertRow &&
                    !(this.props.deleteColumn || this.props.updateColumn) && (
                      <td />
                    )}
                  {columns.map(column => (
                    <td key={getKeyTableTd(item, column)}>
                      {this.renderTd(item, column)}
                    </td>
                  ))}
                </tr>
              )
          )}
        {this.props.insertRow && (
          <InsertRow
            columnsDefinition={this.props.columnsDefinition}
            dataDatalistInputs={this.props.dataDatalistInputs}
            insertRow={this.props.insertRow}
          />
        )}
      </tbody>
    );
  }

  renderTd = (item, column) => {
    if (column.content) {
      return column.content(item);
    }
    return _.get(item, column.key);
  };
}

export default TableBody;
