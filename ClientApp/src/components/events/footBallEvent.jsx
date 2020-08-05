import React, { Component } from "react";
import _ from "lodash";
import ButtonComponent from "../generic/button";
import Datalist from "../generic/datalistAdmin";
import DropDown from "../generic/dropdown";
import { errorToast } from "../../library/toasts";

class FootballEvent extends Component {
  state = {
    teams: [],
    events: [],
    currentEvent: { Home: { name: "" }, Away: { name: "" } },
  };

  constructor(props) {
    super();

    this.state.teams = props.teamList;
  }

  get delimiter() {
    return " - ";
  }
  render() {
    const { teams, currentEvent } = this.state;
    const { events, parentkey } = this.props;

    const eventsDisplay = events
      ? events.map((a) => {
          return a.Home.name + this.delimiter + a.Away.name;
        })
      : [];

    const filtered = teams
      ? teams
          .sort((a) => a.name)
          .filter((a) => {
            return (
              a.name !== currentEvent.Home.name &&
              a.name !== currentEvent.Away.name &&
              (events
                ? events.findIndex((b) => a.name === b.Home.name) < 0
                : true) &&
              (events
                ? events.findIndex((b) => a.name === b.Away.name) < 0
                : true)
            );
          })
      : [];
    return (
      <React.Fragment>
        <div>
          {eventsDisplay && eventsDisplay.length > 0 && (
            <DropDown
              name={"events"}
              options={eventsDisplay}
              deleteOption={this.deleteEvent}
            ></DropDown>
          )}
          <Datalist
            title={"Home"}
            name={this.homeName}
            options={filtered}
            select={this.addTeamToCurrentEvent}
            team={currentEvent.Home}
          ></Datalist>
          <Datalist
            title={"Away"}
            name={this.awayName}
            options={filtered}
            select={this.addTeamToCurrentEvent}
            team={currentEvent.Away}
          ></Datalist>
        </div>
        <div>
          <ButtonComponent
            className="btn"
            name={"add"}
            onClick={this.addEvent}
          ></ButtonComponent>
        </div>
      </React.Fragment>
    );
  }

  get homeName() {
    return this.props.parentkey + "Home";
  }

  get awayName() {
    return this.props.parentkey + "Away";
  }

  addEvent = () => {
    const { currentEvent, teams } = this.state;
    if (!currentEvent.Home.name) return errorToast("Missing Home team", 3000);
    if (!currentEvent.Away.name) return errorToast("Missing Away team", 3000);

    // events.push(currentEvent);
    teams.splice(
      teams.findIndex((a) => a.name === currentEvent.Home.name),
      1
    );
    teams.splice(
      teams.findIndex((a) => a.name === currentEvent.Away.name),
      1
    );

    this.setState({
      teams,
      currentEvent: { Home: { name: "" }, Away: { name: "" } },
    });
    this.props.addEvent(this.props.name, currentEvent);
  };
  addTeamToCurrentEvent = (side, teamName) => {
    const { currentEvent, teams } = this.state;
    const team = { ...teams.find((a) => a.name === teamName) };

    if (side === this.homeName)
      currentEvent.Home = !_.isEmpty(team) ? team : { name: "" };
    if (side === this.awayName)
      currentEvent.Away = !_.isEmpty(team) ? team : { name: "" };

    this.setState({ currentEvent });
  };

  deleteEvent = (event) => {
    // console.log(event);
    const teams = event.split(this.delimiter);

    this.props.deleteEvent(this.props.name, (element) => {
      return element.Home.name === teams[0] && element.Away.name === teams[1];
    });
  };
}

export default FootballEvent;
