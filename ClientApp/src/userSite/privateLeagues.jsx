import React, { Component } from "react";
import DataInterface from "../components/generic/dataInterface";
import _ from "lodash";
import TablePrivateLeagues from "../components/tables/tablePrivateLeagues";
import ButtonComponent from "../components/generic/button";
import Modal from "../components/modalWindows/modalOnlyContent";
import { ToggleModal } from "../library/utils";
import CreatePrivateLeague from "./createPrivateLeague";
import InputModal from "../components/modalWindows/modalSingleInput";
import { info, warning, errorToast } from "../library/toasts";
import {
  saveLeague,
  saveUserLeagues,
  getPrivateLeagues,
  getPrivateLeagueByCode,
} from "../services/leagueService";
import { connect } from "react-redux";
import { setCurrentPrivateLeague } from "../store/actions";
import store from "../store/configureStore";

const _privateLeagues = new WeakMap();

class PrivateLeagues extends DataInterface {
  state = {
    data: [],
    sorting: {
      order: "desc",
      field: "",
    },
    filterColumn: {},
    privateLeagues: {},
  };

  async componentDidMount() {
    await this.refreshPrivateLeaguesList();
  }

  async componentDidUpdate() {
    await this.refreshPrivateLeaguesList();
  }
  async refreshPrivateLeaguesList() {
    if (
      !this.props.league ||
      !this.props.league.parentLeague ||
      this.currentParentLeague === this.props.league.parentLeague
    )
      return;

    this.currentParentLeague = this.props.league.parentLeague;
    await this.getPrivateLeaguesList();
  }

  async getPrivateLeaguesList() {
    const privateLeagues = await getPrivateLeagues(
      this.props.league.parentLeague
    );
    this.setState({ privateLeagues });
  }

  render() {
    // const sorted = this.sortData();
    // console.log("rendering");
    return (
      <React.Fragment>
        <div className="wrapper behaviour--centered">
          <ButtonComponent
            name={"Stwórz własną ligę"}
            onClick={this.openPrivateLeagueModal}
          ></ButtonComponent>
          <ButtonComponent
            name={"Dołącz do ligi"}
            onClick={this.openJoinPrivateLeagueModal}
          ></ButtonComponent>
        </div>
        <TablePrivateLeagues
          data={this.state.privateLeagues}
          unsubscribe={this.unsubscribeLeagueFromTheUser}
          openPrivateLeague={this.openPrivateLeague}
        ></TablePrivateLeagues>
        <Modal idButton="createPrivateLeague">
          <CreatePrivateLeague
            inputId={"newPrivateLeagueName"}
            onClick={this.newPrivateLeagueCreate}
            league={this.props.league}
          ></CreatePrivateLeague>
        </Modal>
        <Modal idButton="joinPrivateLeague">
          <InputModal
            onClick={this.leagueCodeClicked}
            inputId="inputIdJoinLeague"
            labelInput="League code"
            inputPlaceholder={"Enter league code"}
          />
        </Modal>
      </React.Fragment>
    );
  }

  get currentParentLeague() {
    return _privateLeagues.get(this);
  }

  set currentParentLeague(value) {
    _privateLeagues.set(this, value);
  }

  openPrivateLeagueModal = () => {
    ToggleModal("createPrivateLeague", "newPrivateLeagueName");
  };

  openJoinPrivateLeagueModal = () => {
    ToggleModal("joinPrivateLeague");
  };

  handleSortClick = (sortColumn) => {
    this.setState({ sortColumn });
  };

  openPrivateLeague = (league) => {
    store.dispatch(setCurrentPrivateLeague(league._id));

    this.props.history.push("/privateLeagueDetails");
  };

  newPrivateLeagueCreate = async (privateLeague) => {
    try {
      const resultSaveLeague = await saveLeague(privateLeague);
      console.log(resultSaveLeague);
      if (resultSaveLeague.status !== 200) throw resultSaveLeague.data;

      await this.subscribePrivateLeagueToUser(
        privateLeague.parentLeague,
        resultSaveLeague.data._id
      );

      info(`Liga ${privateLeague.name} utworzona`);
    } catch (error) {
      errorToast(`Liga ${privateLeague.name} nie została utworzona. ${error}`);
    } finally {
      ToggleModal("createPrivateLeague");
      this.getPrivateLeaguesList();
    }
  };

  unsubscribeLeagueFromTheUser = async (parentLeagueId, leagueId) => {
    try {
      const user = this.getUser();
      const currentLeague = this.getCurrentLeagueFromUser(user, parentLeagueId);

      currentLeague.privateLeagues = currentLeague.privateLeagues.filter(
        (item) => item !== leagueId
      );

      await this.saveUserLeagues(user);

      errorToast(`Liga usunięta`);
    } catch (error) {
      errorToast(`Liga nie została usunieta. ${error}`);
    } finally {
      this.getPrivateLeaguesList();
    }
  };

  leagueCodeClicked = async (code) => {
    try {
      const privateLeague = await getPrivateLeagueByCode(code);

      await this.subscribePrivateLeagueToUser(
        privateLeague.parentLeague,
        privateLeague._id
      );
      info("Liga dodana");
      this.getPrivateLeaguesList();
    } catch (error) {
      errorToast(error);
    } finally {
      ToggleModal("joinPrivateLeague");
    }
  };

  async subscribePrivateLeagueToUser(parentLeague, addedPrivateLeagueId) {
    if (!parentLeague) throw "parent league not provided";

    const user = this.getUser();
    const currentLeague = this.getCurrentLeagueFromUser(user, parentLeague);

    if (this.props.league.parentLeague !== parentLeague)
      throw "Liga prywantna do której chcesz dołączyć należy od innych rozgrywek";
    this.addLeagueToTheUSer(currentLeague, addedPrivateLeagueId);
    await this.saveUserLeagues(user);
  }

  async test(currentLeague, addedPrivateLeagueId, user) {}

  getUser() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    //this actually should trigger getting user or redirecting to login page
    if (!user) throw "No user. You should login again";

    return user;
  }

  getCurrentLeagueFromUser(user, leagueId) {
    console.log(user.leagues);
    const currentLeague = user.leagues.find((a) => a._id === leagueId);
    if (!currentLeague) throw "Current League not found";

    return currentLeague;
  }

  addLeagueToTheUSer(currentLeague, addedPrivateLeagueId) {
    if (
      this.userAlreadyPlaysInOtherPrivateLEagues(
        currentLeague,
        addedPrivateLeagueId
      )
    )
      currentLeague.privateLeagues.push(addedPrivateLeagueId);
    else currentLeague.privateLeagues = [addedPrivateLeagueId];
  }

  userAlreadyPlaysInOtherPrivateLEagues(currentLeague, addedPrivateLeagueId) {
    return (
      currentLeague.privateLeagues &&
      Array.isArray(currentLeague.privateLeagues) &&
      !currentLeague.privateLeagues.includes(addedPrivateLeagueId)
    );
  }

  async saveUserLeagues(user) {
    const resultSaveUserLeagues = await saveUserLeagues(user.leagues);
    // console.log(resultSaveUserLeagues);
    if (!resultSaveUserLeagues || resultSaveUserLeagues.status !== 200)
      throw "League not mapped to the user";

    sessionStorage.setItem("user", JSON.stringify(user));
  }
}

const mapStateToProps = (state) => {
  const { leagueReducer } = state;

  if (!leagueReducer) return;

  const league = {
    parentLeague: leagueReducer._id,
  };

  for (const key in leagueReducer) {
    if (leagueReducer.hasOwnProperty(key)) {
      const element = leagueReducer[key];

      if (!key.startsWith("_")) league[key] = element;
    }
  }

  return {
    league: league,
  };
};

export default connect(mapStateToProps)(PrivateLeagues);
