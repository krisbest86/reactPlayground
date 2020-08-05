import React, { Component } from "react";
import { connect } from "react-redux";

class PrivateLeagueDetails extends Component {
  state = {};
  render() {
    console.log(this.props.privateLeagueId);
    return "private leagues";
  }
}
const mapStateToProps = (state) => {
  const { privateLeagueReducer } = state;

  if (!privateLeagueReducer) return;

  return {
    privateLeagueId: privateLeagueReducer._id || privateLeagueReducer,
  };
};
export default connect(mapStateToProps)(PrivateLeagueDetails);
