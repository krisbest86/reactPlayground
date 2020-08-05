import React, { Component } from "react";
import Header from "../tableElements/theader";
import Body from "../tableElements/tbody";
import { isMobileDevice, isAtLeastSmallScreen } from "../../library/utils";
import _ from "lodash";
import TableEntity from "./tableEntity";

//todo przepisac komponent z wykorzystaniem table entity
class TableTransferList extends Component {
  render() {
    const { columnsDefinition } = this.props;

    const isMobileOrSmall = isMobileDevice() || !isAtLeastSmallScreen();
    const classes = "table " + (isMobileOrSmall ? " table--mobile" : "");

    // console.log(this.props);
    return (
      <React.Fragment>
        <TableEntity
          title={`Lista transferowa:`}
          className={classes}
          columnsDefinition={columnsDefinition}
          data={this.props.data}
          trOnClick={isMobileDevice() && this.props.buyPlayer}
          handleSorting={this.props.onSort}
          sorting={this.props.sorting}
          handleChangeFilter={this.props.handleChangeFilter}
          handleChangeFilterNameValue={this.props.handleChangeFilterNameValue}
        ></TableEntity>
      </React.Fragment>
    );
  }
}
export default TableTransferList;
