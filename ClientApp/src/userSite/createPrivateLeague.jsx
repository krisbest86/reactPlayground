import Form from "../components/generic/form";
import React from "react";
import Joi from "joi";
import { getTeam } from "../services/teamService";

class CreatePrivateLeague extends Form {
  state = {
    data: { newPrivateLeagueName: "" },
    errors: {},
  };

  schema = this.schemaObject;

  get schemaObject() {
    const schema = {};

    schema["newPrivateLeagueName"] = Joi.string()
      .required()
      .label("League name");

    return schema;
  }

  render() {
    return (
      <div className="wrapper ">
        <div className="behaviour--inner--centered">
          {this.renderForm(this.renderContent())}
        </div>
      </div>
    );
  }

  renderContent = () => {
    return (
      <React.Fragment>
        {this.renderInput(
          "newPrivateLeagueName",
          "Name",
          "input",
          "Enter league name",
          "input--login",
          {
            hideLabels: true,
          }
        )}
        {this.renderButton("Utwórz")}
      </React.Fragment>
    );
  };

  doSubmit = async () => {
    // console.log(this.props.league);
    const publicTeam = await getTeam(this.props.league);
    const leagueObject = { ...this.props.league };

    this.addTeamTothePrivateLeague(leagueObject, publicTeam);

    this.props.onClick(leagueObject);
    this.setState({ data: { newPrivateLeagueName: "" } });
  };

  addTeamTothePrivateLeague(leagueObject, publicTeam) {
    leagueObject.name = this.state.data.newPrivateLeagueName;
    leagueObject.privateLeagueRanking = [
      {
        _id: publicTeam._id,
        name: publicTeam.name,
        position: 1,
        sumOfPoints: publicTeam.sumOfPoints,
      },
    ];
  }
}

export default CreatePrivateLeague;
