import React, { Component } from "react";
import TableEntity from "./tableEntity";
import { isObjectEmpty } from "../../library/utils";

class TablePrivateLeagues extends Component {
  state = {};
  render() {
    const columnsDefinition = [
      { key: "name", title: "Nazwa" },
      { key: "position", title: "Aktualna pozycja" },
      { key: "nbOfPlayers", title: "Liczba drużyn" },
      { key: "leagueCode", title: "Klucz" },
      {
        content: (item) => {
          return (
            <i
              className="fa fa-minus-circle"
              style={{ color: "red" }}
              onClick={(event) => this.LeaveLeague(event, item)}
            />
          );
        },
      },
    ];

    if (
      !this.props.data ||
      !Array.isArray(this.props.data) ||
      isObjectEmpty(this.props.data)
    )
      return <span>You are not subscribed to any private league</span>;

    console.log(this.props.data);
    const data =
      this.props.data.length > 0
        ? this.props.data.map((a) => {
            a.nbOfPlayers = a.privateLeagueRanking.length;
            return a;
          })
        : [];
    return (
      <TableEntity
        title={"Twoje ligi prywatne"}
        columnsDefinition={columnsDefinition}
        data={data}
        trOnClick={this.props.openPrivateLeague}
      ></TableEntity>
    );
  }

  LeaveLeague = (event, league) => {
    if (!league) return;

    event.stopPropagation();
    this.props.unsubscribe(league.parentLeague, league._id);
  };
}

export default TablePrivateLeagues;
