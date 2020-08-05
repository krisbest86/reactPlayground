import React from "react";
import Table from "../components/tables/tableTransferList";
import { getTransferList } from "../services/leagueService";
import { isMobileDevice, isAtLeastSmallScreen } from "../library/utils";

import DataInterface from "../components/generic/dataInterface";
import _ from "lodash";

class TransferList extends DataInterface {
  state = {
    data: [],
    sorting: [
      {
        field: "price",
        order: "desc"
      },
      {
        field: "fullname",
        order: "",
        orderType: item => {
          const surname = item.fullname.substring(
            item.fullname.indexOf(" ") + 1
          );
          return surname;
        }
      }
    ],
    filterColumn: {},
    filterComparers: {}
  };

  async componentDidMount() {
    //download transfer list
    // console.log(this.props.leagueSettings);
    // console.log(this.props.team);
    // console.log(this.props.currentModalPlayer);

    if (
      this.props.leagueSettings &&
      this.props.team &&
      this.props.currentModalPlayer.position
    ) {
      const data = this.props.currentModalPlayer
        ? await getTransferList(
            this.props.leagueSettings,
            this.props.team,
            this.props.currentModalPlayer.position
          )
        : await getTransferList(this.props.leagueSettings, this.props.team);
      this.setState({ data });
    }
  }

  render() {
    const columnsDefinition = [
      {
        key: "fullname",
        title: "Imię i Nazwisko",
        input: true,
        filter: "BYSURNAME"
      },
      { key: "team", title: "Drużyna", dropdown: [] },
      {
        key: "price",
        title: "Cena max: ",
        slider: { min: 0, max: 5, step: 0.1 }
      }
    ];
    if (!isMobileDevice())
      columnsDefinition.push({
        key: "buy",
        content: item => (
          <button className="" onClick={() => this.props.buyPlayer(item)}>
            Kupuj
          </button>
        )
      });
    this.addHeaderData(columnsDefinition);

    const filteredData = this.filterDataByColumn(this.state.data);
    const sorted = this.sortData(filteredData);

    return (
      <Table
        data={sorted}
        onSort={this.handleSortClick}
        buyPlayer={this.props.buyPlayer}
        handleChangeFilter={this.handleChangeFilter}
        columnsDefinition={columnsDefinition}
        handleChangeFilterNameValue={this.handleChangeFilterNameValue}
        sorting={this.state.sorting}
      />
    );
  }

  addHeaderData = columnsDefinition => {
    for (const column of columnsDefinition) {
      if (column.dropdown) {
        column.dropdown = _.uniqBy(this.state.data, column.key).map(a => {
          return a[column.key];
        });

        column.dropdown.unshift("...");
        column.selected = this.state.filterColumn[column.key];
      }
    }
  };
}

export default TransferList;
