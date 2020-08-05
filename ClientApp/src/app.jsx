//modules
import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";

//components
import NavBarLeague from "./components/navBars/navBarLeague";
import Login from "./components/userComponents/login";
import Logout from "./components/userComponents/logout";
import Register from "./components/userComponents/register";
import Profile from "./components/userComponents/profile";
import NotFound from "./components/notFound";
import ProtectedRoute from "./components/generic/protectedRoute";

import NavBarMain from "./userSite/navBarMain";
import Home from "./userSite/home";
import Team from "./userSite/footballTeamComponent";
import JoinTeam from "./userSite/joinTeamComponenet";
import Ranking from "./userSite/ranking";
import "react-toastify/dist/ReactToastify.css";

//services
import { getCurrentUser, getJwt } from "./services/sharedServices/loginService";
import { getLeague } from "./services/leagueService";
import { isMobileDevice, isAtLeastSmallScreen } from "./library/utils";
import Footer from "./components/generic/footer";

//redux
import { setLeagues, setLanguage } from "./store/actions";
import store from "./store/configureStore";
//functions
import { isObjectEmpty } from "./library/utils";
import PrivateLeagues from "./userSite/privateLeagues";
import PrivateLeagueDetails from "./userSite/privateLeagueDetails";
import ContactUs from "./components/userComponents/contactUs";
import { errorToast } from "./library/toasts";

class App extends Component {
  state = {
    token: "",
    user: {},
    settings: {
      navbarLeagueClicked: false,
    },
    leagues: [],
  };

  async componentDidMount() {
    // console.log("componentDidMount")
    store.dispatch(setLanguage("pl"));

    if (
      process.env.REACT_APP_RUN_LOCALLY &&
      process.env.REACT_APP_RUN_LOCALLY === "true"
    ) {
      this.RunLocally();
    } else {
      try {
        await this.refreshUser();
      } catch (e) {
        errorToast(e.message);
      }
    }
  }

  RunLocally() {
    console.log("RunLocally");
    const leagues = [{ name: "liga" }];
    store.dispatch(setLeagues(leagues, store));
    this.setState({ user: { name: "me" }, token: "token", leagues: leagues });
  }

  render() {
    const { user, token } = this.state;

    const mainClasses =
      "main  " +
      (this.state.settings.navbarLeagueClicked
        ? " behaviour--moveDown--17"
        : "");

    return (
      <div className="container container--column ">
        <div className="header">
          <NavBarMain user={user} />
          {token && this.isCurrentleague && (
            <NavBarLeague
              onClick={this.navbarLeagueClicked}
              clicked={this.state.settings.navbarLeagueClicked}
            />
          )}
        </div>
        <div className={mainClasses}>
          <Switch>
            {
              <ProtectedRoute
                path="/league"
                render={(props) => this.isCurrentleague && <Team {...props} />}
              />
            }
            {
              <ProtectedRoute
                path="/jointeam"
                render={(props) => (
                  <JoinTeam {...props} onSubmit={this.refreshUser}></JoinTeam>
                )}
              ></ProtectedRoute>
            }

            {
              <ProtectedRoute
                path="/ranking"
                render={(props) =>
                  this.isCurrentleague && <Ranking {...props} />
                }
              />
            }
            {<ProtectedRoute path="/contactus" component={ContactUs} />}
            {
              <ProtectedRoute
                path="/privateLeagues"
                component={PrivateLeagues}
              />
            }
            {
              <ProtectedRoute
                path="/privateLeagueDetails"
                component={PrivateLeagueDetails}
              />
            }

            {<ProtectedRoute path="/logout" component={Logout} />}
            {<ProtectedRoute path="/profile" component={Profile} />}
            {!token && <Route path="/login" component={Login} />}
            {!token && <Route path="/register" component={Register} />}
            <Route path="/notFound" component={NotFound} />
            <Route path="/" component={Home} />
            <Redirect from="*" to="/notFound" />
          </Switch>
          <ToastContainer />
        </div>
        <Footer />
      </div>
    );
  }

  get isCurrentleague() {
    return !isObjectEmpty(store.getState().leagueReducer);
  }

  navbarLeagueClicked = () => {
    if (isMobileDevice() && !isAtLeastSmallScreen()) {
      const { settings } = this.state;
      settings.navbarLeagueClicked = !settings.navbarLeagueClicked;

      if (isMobileDevice()) this.setState({ settings });
    }
  };

  getToken = async () => {
    return await getJwt();
  };
  getUser = async () => {
    return await getCurrentUser(true);
  };

  refreshUser = async () => {
    const token = await this.getToken();

    if (!token) return;

    const user = await this.getUser();

    if (token) {
      try {
        const leagues = [];

        if (user && user.leagues) {
          for (const element of user.leagues) {
            const l = await getLeague(element._id);
            if (l) leagues.push(l);
          }
        }

        // console.log(store);
        store.dispatch(setLeagues(leagues, store));
        this.setState({
          user,
          token,
          leagues,
        });
      } catch (error) {
        this.setState({
          token,
          user,
        });
      }
    }
  };
}

export default App;
