import React, { Component } from "react";
import NavBar from "../generic/navBarGeneric";
import { connect } from "react-redux";

//redux
import { setCurrentLeague } from "../../store/actions";
import store from "../../store/configureStore";

class NavBarLeague extends Component {
  state = {};

  render() {
    const { currentLeague: league, leagues } = this.props;

    const leaguesLight = leagues.map(a => {
      return a.name;
    });
    return (
      <NavBar
        navName={"navbar--zgarnijLige"}
        navTitle={league.name}
        options={leaguesLight}
        returnTabs={this.returnTabs}
        withButton={true}
        btnClasses={"navbar--zgarnijLige__btn"}
        checked={this.props.clicked}
        onClick={this.props.onClick}
        onSelectedDropDown={this.changeCurrentLeague}
      />
    );
  }

  returnTabs = () => {
    return [
      { name: "Drużyna", link: "/league", displayWhenLoggedUser: true },
      {
        name: "Pozycja w lidze",
        link: "/ranking",
        displayWhenLoggedUser: true
      },
      {
        name: "Ligi prywatne",
        link: "/privateLeagues",
        displayWhenLoggedUser: true
      }
      // { name: "Administracja", link: "/admin", displayWhenLoggedUser: true }
    ];
  };

  changeCurrentLeague = (dropDownName, league) => {
    const currentLeague = this.props.leagues.filter(e => e.name === league)[0];

    if (currentLeague) this.dispatchCurrentLeague(currentLeague);
  };

  dispatchCurrentLeague = currentLeague => {
    store.dispatch(setCurrentLeague(currentLeague));
  };
}

const mapStateToProps = state => {
  const { leagueReducer, leagueListReducer } = state;
  const leagues = leagueListReducer;

  return {
    currentLeague: leagueReducer,
    leagues
  };
};

// export default NavBarLeague;
export default connect(mapStateToProps)(NavBarLeague);
