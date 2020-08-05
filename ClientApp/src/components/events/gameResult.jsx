import React, { Component } from "react";
import { getPlayers } from "../../services/gameService";
import TableGameResult from "../tables/tableGameResult";
import ButtonComponent from "../generic/button";
import { Service } from "../../services/entityService";
import { toast } from "react-toastify";
import { warning } from "../../library/toasts";

const _serviceCrud = new WeakMap();
const _serviceSaveData = new WeakMap();

class GameResult extends Component {
  state = { homePlayers: "", awayPlayers: "", key: "", points: {} };

  constructor(props) {
    super();
    _serviceCrud.set(
      this,
      new Service(`${process.env.REACT_APP_ENTITY_SERVICE}/fixtures`)
    );
    _serviceSaveData.set(
      this,
      new Service(
        `${process.env.REACT_APP_SAVEDATA_SERVICE}/fixture/savefixturedata`
      )
    );
  }

  render() {
    // console.log(this.props);
    const { fixture, event, pointEvents } = this.props;
    const { homePlayers, awayPlayers, points } = this.state;

    const columns = pointEvents
      ? pointEvents.map(a => {
          return {
            key:
              (a.name && a.name.replace(/\s/g, "")) +
              (a.position && a.position.replace(/\s/g, "")),
            title: `${a.name} (${a.position})`,
            content: item => {
              if (item.position === a.position || a.position === "All")
                return (
                  <input
                    type="number"
                    style={{ width: "3rem" }}
                    onChange={this.handleChange}
                    id={item._id}
                    name={a.name}
                    data-position={a.position}
                    value={
                      (points &&
                        points[item._id] &&
                        points[item._id][a.name] &&
                        points[item._id][a.name].value) ||
                      0
                    }
                    min={0}
                  />
                );
            }
          };
        })
      : [];

    columns.unshift({ key: "fullname", title: "" });

    // console.log(columns);

    return (
      // <div className="wrapper page-section ">
      <div className="wrapper  ">
        <p className="behaviour--centered headline">{fixture.name}</p>
        {fixture.name && (
          <p className="behaviour--centered">
            <ButtonComponent
              name="Zapisz"
              className="btn "
              onClick={this.saveFixture}
            ></ButtonComponent>
            <ButtonComponent
              name="Przelicz punkty w lidze"
              className="btn "
              onClick={this.calculateFixture}
            ></ButtonComponent>
          </p>
        )}
        {columns.length > 0 && (
          <div className="row">
            <div className="column column__smallest-6">
              {event && (
                <TableGameResult
                  title={event.Home.name}
                  data={homePlayers}
                  schema={columns}
                ></TableGameResult>
              )}
            </div>

            <div className="column column__smallest-6">
              {event && (
                <TableGameResult
                  title={event.Away.name}
                  data={awayPlayers}
                  schema={columns}
                ></TableGameResult>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  async componentDidUpdate() {
    const { fixture, event } = this.props;
    const { key } = this.state;

    if (event.Home && fixture.league) {
      let newKey = event.Home.name + fixture.name;
      // console.log(newKey);
      // console.log(key);

      if (key !== newKey) {
        let homePlayers, awayPlayers, points;
        homePlayers = await getPlayers(event.Home.name, fixture.league);
        awayPlayers = await getPlayers(event.Away.name, fixture.league);

        console.log(event);
        points = event.points || {};

        this.setState({ homePlayers, awayPlayers, key: newKey, points });
      }
    }
  }

  saveFixture = async () => {
    const { fixture, event } = this.props;
    const { points } = this.state;

    fixture.events.forEach(element => {
      if (
        element.Home.name === event.Home.name &&
        element.Away.name === event.Away.name
      ) {
        element.points = points;
        return;
      }
    });
    console.log(fixture);
    const result = await _serviceCrud.get(this).updateEntity(fixture);
    warning(result, 2000);
  };

  calculateFixture = async () => {
    const { fixture, event } = this.props;
    const { points } = this.state;
    const pointsFixture = { ...points };

    for (const key in points) {
      let pointsEvents = [];
      if (points.hasOwnProperty(key)) {
        const player = points[key];

        for (const key in player) {
          if (player.hasOwnProperty(key)) {
            const point = player[key];

            pointsEvents.push({
              name: key,
              value: point.value,
              position: point.position
            });
          }
        }

        pointsFixture[key] = pointsEvents;
      }
    }

    console.log(pointsFixture);

    const result = await _serviceSaveData.get(this).postEntity({
      PlayerPoints: pointsFixture,
      LeagueId: fixture.league,
      FixtureId: fixture._id
    });

    // console.log(result);
    warning((result && result.error && result.error.message) || result, 2000);
    this.setState({ points });
  };

  handleChange = ({ currentTarget: input }) => {
    // console.log(input.value);
    // console.log(input);
    // console.log(input.name);
    const { points } = this.state;
    points[input.id] = {
      ...points[input.id],
      [input.name]: { value: input.value, position: input.dataset.position }
    };

    console.log(points);
    this.setState({ points });
  };
}

export default GameResult;
