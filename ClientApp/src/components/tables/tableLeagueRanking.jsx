import React, { Component } from "react";
import Header from "../tableElements/theader";
import Body from "../tableElements/tbody";
import TableEntity from "./tableEntity";

class TableLeagueRanking extends Component {
  render() {
    const columnsDefinition = [
      { key: "rankingPosition", title: "Pozycja" },
      { key: "name", title: "Nazwa drużyny" },
      { key: "points", title: "Liczba punktów" }
    ];

    return (
      <React.Fragment>
        <TableEntity
          title={`W lidze gra ${this.props.displayedItems} drużyn`}
          columnsDefinition={columnsDefinition}
          data={this.props.data}
          trOnClick={this.props.onRowClick}
          handleSorting={this.props.onSort}
          sorting={this.props.sortColumn}
        ></TableEntity>
      </React.Fragment>
    );
  }
}

export default TableLeagueRanking;
