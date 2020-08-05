import React, { Component } from "react";
import _ from "lodash";
import Field from "../components/generic/fieldCanvas";
import { getTeam, saveTeam, updateTeam } from "../services/teamService";
import { getImages, ToggleModal, isObjectEmpty } from "../library/utils";
import Modal from "../components/modalWindows/modalOnlyContent";
import { getSchedule } from "../services/leagueService";
import TableTransferList from "./transferList";
import Schedule from "../components/carousels/carousel3slides";
import Resizable from "../components/generic/resizableComponent";
import List from "../components/generic/listGroup";
import Button from "../components/generic/button";
import InputModal from "../components/modalWindows/modalSingleInput";
import { info, errorToast } from "../library/toasts";
import { CSSTransition } from "react-transition-group";
import SportFixture from "../components/generic/sportFixture";
import { connect } from "react-redux";

class FootballTeamComponent extends Component {
  state = {
    team: {},
    schedule: {},
    images: {},
    scheduleProps: {},
    currentFormation: "",
    currentModalPlayer: {},
    flags: {}
  };

  async componentDidMount() {
    //download team
    // const team = await getTeam(leagueSettings);
    // const currentFormation = this.getTeamFormation(team.squad, true);

    await this.refreshSchedule();
  }

  componentDidUpdate() {
    const { flags } = this.state;

    if (flags.toggleModal) {
      // console.log("toggleModal");
      // console.log(this.state.currentModalPlayer);
      this.toggleModal(flags.toggleModalName);

      flags.toggleModal = false;
      flags.animateButtonZglosDruzyne = true;
      flags.showTeamComplete = false;
      this.setState({ flags });
    }
  }

  render() {
    const { currentModalPlayer } = this.state;

    return (
      <div>
        <h2
          className="headline headline--centered"
          key={"headline" + this.props.leagueSettings.name}
        >
          {this.props.leagueSettings.name}
        </h2>
        {this.renderSchedule()}

        {this.renderFixture()}

        {this.renderField()}

        {this.renderFormations()}

        <Modal idButton="nameTeam">
          <InputModal
            onClick={this.onNameTeam}
            inputId="inputIdNameTeam"
            labelInput="Team Name"
            inputPlaceholder={"Enter team name"}
          />
        </Modal>
        <Modal idButton="buttonModal">
          <TableTransferList
            key={currentModalPlayer.No}
            buyPlayer={this.buyPlayer}
            currentModalPlayer={currentModalPlayer}
            leagueSettings={this.props.leagueSettings}
            team={this.state.team}
          />
        </Modal>
      </div>
    );
  }

  renderFormations = () => {
    const { currentFormation } = this.state;

    return (
      <List
        listItems={this.props.leagueSettings.availableFormations}
        current={currentFormation}
        onClicked={this.changePositioning}
        noKey={true}
      />
    );
  };

  renderField = () => {
    const { team, flags } = this.state;

    if (team.league !== this.props.leagueSettings._id) this.refreshTeam();

    return (
      <div className="divBlock--column page-section">
        {!flags.gamesOn && (
          <div className="behaviour--centered ">
            {this.renderZglosDruzyne()}
            {!team.name && this.renderNazwijDruzyne()}
            <h3 className="behaviour--centered">
              Budżet: {this.props.leagueSettings.budget - (team.Value || 0)}
            </h3>
          </div>
        )}
        <Resizable>
          <Field
            team={team}
            images={getImages()}
            sellPlayer={this.sellPlayer}
            openTransferList={player => {
              const currentModalPlayer = player;
              const flags = {};
              flags.toggleModal = true;
              flags.toggleModalName = "buttonModal";

              this.setState({ currentModalPlayer, flags });
            }}
            gamesOn={flags.gamesOn}
            fixture={this.getCurrentFixture}
          />
        </Resizable>
      </div>
    );
  };

  renderSchedule = () => {
    const { scheduleProps, schedule } = this.state;

    // console.log(schedule);
    // console.log(scheduleProps);
    // console.log(isObjectEmpty(scheduleProps));

    if (
      isObjectEmpty(schedule) ||
      (schedule.league || schedule[0].league) !== this.props.leagueSettings._id
    )
      this.refreshSchedule();

    return (
      !isObjectEmpty(schedule) &&
      !isObjectEmpty(scheduleProps) && (
        <div className="page-section">
          <Resizable>
            <Schedule
              schedule={schedule}
              onScheduleChange={this.changeSchedule}
              scheduleProps={scheduleProps}
            />
          </Resizable>
        </div>
      )
    );
  };

  renderFixture = () => {
    const { team, schedule, flags } = this.state;

    return (
      schedule &&
      this.getCurrentFixture && (
        <div className="page-section page-section--secondaryBackground">
          <h2
            className="headline headline--centered"
            key={"label" + this.getCurrentFixture.name}
          >
            {(team.name ? team.name + " - " : "") + this.getCurrentFixture.name}
          </h2>
          <h4
            className="headline--centered"
            key={"labelFixturesTime" + this.getCurrentFixture.name}
          >
            {this.getCurrentFixture.from.substr(0, 10) +
              " - " +
              this.getCurrentFixture.to.substr(0, 10)}
          </h4>
          {this.areTeamsPlayingNow(this.getCurrentFixture) && (
            <h2
              className="headline--centered headline--red"
              key={"labelWarning" + this.getCurrentFixture.name}
            >
              W trakcie
            </h2>
          )}
          {this.getCurrentFixture && (
            <SportFixture events={this.getCurrentFixture.events}></SportFixture>
          )}
        </div>
      )
    );
  };

  refreshTeam = async () => {
    const { leagueSettings } = this.props;

    //download team
    const team = await getTeam(leagueSettings);
    const currentFormation = this.getTeamFormation(team.squad, true);

    console.log(team);
    this.setState({ team, currentFormation });
  };

  async refreshSchedule() {
    const { leagueSettings } = this.props;

    const schedule = await getSchedule(leagueSettings);
    if (!isObjectEmpty(schedule)) {
      const earliestFixture = this.getLatestFixture(schedule);
      const flags = {
        gamesOn: this.areTeamsPlayingNow(schedule[earliestFixture])
      };
      const scheduleProps = {
        selectedSlide: earliestFixture,
        firstSlide: Math.min(
          Math.max(0, schedule.length - 3),
          Math.max(0, earliestFixture - 1)
        )
      };
      this.setState({ schedule, scheduleProps, flags });
    }

    schedule.league = leagueSettings._id;
    this.setState({ schedule });
  }

  areTeamsPlayingNow = element => {
    if (!element || isObjectEmpty(element)) return false;

    return (
      new Date(element.from) < Date.now() && new Date(element.to) > Date.now()
    );
  };
  getLatestFixture = schedule => {
    if (isObjectEmpty(schedule) || schedule.length < 2) return 0;

    for (let index = 0; index < schedule.length; index++) {
      const element = schedule[index];
      if (
        this.areTeamsPlayingNow(schedule[index]) ||
        this.earliestNotPlayedFixture(element)
      )
        return index;
    }

    return schedule.length - 1;
  };

  nameTeam = () => {
    this.toggleModal("nameTeam", "inputIdNameTeam");
  };

  onNameTeam = name => {
    const { team, flags } = this.state;
    flags.toggleModal = true;
    flags.toggleModalName = "nameTeam";
    team.name = name;
    info("Twoja drużyna nazywa się " + name, 3000);
    this.setState({ team, flags });
  };

  registerTeam = async () => {
    const { team } = this.state;
    const { leagueSettings } = this.props;

    if (!this.validateTeam()) return errorToast("Drużyna niekompletna", 2000);
    if (!team.name) return errorToast("Drużyna nie ma nazwy", 2000);

    // console.log(team);
    const result = team.Empty
      ? await saveTeam({
          league: leagueSettings._id,
          squad: team.squad,
          name: team.name,
          Value: team.Value
        })
      : await updateTeam(team);

    // console.log(result);

    if (result) {
      info(team.name + " zgłoszona");
      sessionStorage.removeItem("team" + leagueSettings._id);
      sessionStorage.removeItem("draftTeam" + leagueSettings._id);
    }
  };
  buyPlayer = player => {
    const { team, currentModalPlayer } = this.state;
    // console.log(currentModalPlayer);

    for (const index in team.squad) {
      const replacedPlayer = _.find(team.squad[index], {
        No: currentModalPlayer.No
      });

      if (replacedPlayer && replacedPlayer.position === player.position) {
        //todo dopracowac zmienianie zawodnika
        player.name =
          player.name ||
          player.fullname.substr(
            player.fullname.indexOf(" ") + 1,
            player.fullname.length - (player.fullname.indexOf(" ") + 1)
          );
        player.No = replacedPlayer.No;

        // console.log(player);

        team.squad[index][team.squad[index].indexOf(replacedPlayer)] = player;
        team.Value += player.price;

        sessionStorage.setItem(
          "draftTeam" + this.props.leagueSettings._id,
          JSON.stringify(team.squad)
        );
        break;
      }
    }
    this.toggleModal("buttonModal", null, this.validateTeam());

    this.setState({ team });
  };

  sellPlayer = player => {
    const { team } = this.state;

    for (const formation of team.squad) {
      for (const key in formation) {
        if (formation.hasOwnProperty(key)) {
          const element = formation[key];
          if (element._id === player._id)
            formation[key] = { No: player.No, position: player.position };
        }
      }
    }

    team.Value -= player.price;

    this.setState({ team });
  };

  earliestNotPlayedFixture(element) {
    return new Date(element.from) > Date.now();
  }

  get getCurrentFixture() {
    const { schedule, scheduleProps } = this.state;
    if (schedule.length < 2) return schedule[0];

    return schedule[scheduleProps.selectedSlide];
  }

  renderNazwijDruzyne() {
    return (
      // <CSSTransition
      //   in={this.state.flags.animateButtonZglosDruzyne}
      //   appear={true}
      //   timeout={3000}
      //   classNames="btn"
      // >
      <Button
        name="Nazwij drużynę"
        className="btn"
        onClick={() => this.nameTeam()}
      ></Button>
      // </CSSTransition>
    );
  }

  renderZglosDruzyne() {
    return (
      <CSSTransition
        in={this.state.flags.animateButtonZglosDruzyne}
        appear={true}
        timeout={5000}
        classNames="btn"
      >
        <Button
          name="Zgłoś drużynę"
          className="btn"
          onClick={() => this.registerTeam()}
        ></Button>
      </CSSTransition>
    );
  }

  getTeamFormation(squad, cutLastFormation) {
    if (!squad) return false;

    let formation = "";
    for (const item of squad) {
      formation += item.length + "-";
    }

    const length = cutLastFormation
      ? formation.length - 3
      : formation.length - 1;
    return formation.substr(0, length);
  }
  toggleModal = (id, inputId, showToastTeamComplete) => {
    ToggleModal(id, inputId);
    if (showToastTeamComplete) info("Drużyna kompletna. Spróbój zgłosić", 3000);
  };

  changePositioning = newFormation => {
    if (this.state.flags.gamesOn) return;

    let formation = newFormation._id || newFormation;
    let { team, currentFormation } = this.state;
    const formationsLength = this.getFormationsLength(formation, team);

    if (formation !== currentFormation) {
      for (const formationIndex in team.squad) {
        let i = 0;
        while (
          this.isFormationNotBalanced(team, formationsLength, formationIndex) &&
          i++ < 100
        ) {
          if (
            this.tooLittlePlayersInFormation(
              team,
              formationsLength,
              formationIndex
            )
          ) {
            const player = {
              ...this.getPlayerFromTheBench(team, formationIndex)
            };
            team.squad[formationIndex].push(player);
          } else {
            const player = {
              ...this.movePlayerToTheBench(team, formationIndex)
            };

            team.squad[team.squad.length - 1].push(player);
          }
        }
      }

      // console.log(team);

      this.setState({
        currentFormation: this.getTeamFormation(team.squad, true),
        team
      });
    }
  };

  getFormationsLength = (formation, team) => {
    return (
      formation.replace(new RegExp("-", "g"), "") +
      team.squad[team.squad.length - 1].length
    );
  };

  tooLittlePlayersInFormation = (team, formation, formationIndex) => {
    return (
      parseInt(team.squad[formationIndex].length) <
      parseInt(formation[formationIndex])
    );
  };

  isFormationNotBalanced = (team, formation, formationIndex) => {
    return !(
      parseInt(team.squad[formationIndex].length) ===
      parseInt(formation[formationIndex])
    );
  };

  getPlayerFromTheBench = (team, index) => {
    const position = this.props.leagueSettings.origin.positionTypesValues[
      index
    ];
    const bench = team.squad[team.squad.length - 1];

    for (const key in bench) {
      if (bench.hasOwnProperty(key)) {
        const element = bench[key];
        // console.log(position);
        if (element.position === position) return bench.splice(key, 1)[0];
      }
    }
  };
  movePlayerToTheBench = (team, formationIndex) => {
    return team.squad[formationIndex].pop();
  };

  changeSchedule = (index, firstSlide) => {
    const scheduleProps = { selectedSlide: index, firstSlide: firstSlide };

    this.setState({ scheduleProps });
  };

  validateTeam = () => {
    const { team } = this.state;

    if (!team || !team.squad) return false;

    for (const formation of team.squad) {
      for (const player of formation) {
        if (!player._id) {
          return false;
        }
      }
    }

    return true;
  };
}

const mapStateToProps = state => {
  const { leagueReducer } = state;
  const leagueSettings = leagueReducer;

  console.log(leagueSettings);
  return { leagueSettings };
};

export default connect(mapStateToProps)(FootballTeamComponent);
