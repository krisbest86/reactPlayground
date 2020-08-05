import React from "react";
import { getLeagues, saveUserLeagues } from "../services/leagueService";
import { isObjectEmpty } from "../library/utils";
import JoinTableRow from "../components/tableRows/joinTableRow";
import Form from "../components/generic/form";
import Joi from "joi";

class JoinTeamComponent extends Form {
  state = {
    data: {},
    errors: {}
  };

  render() {
    const { data } = this.state;

    return (
      <div className="wrapper">
        <h2 className="headline headline--centered">Dołącz do Ligi</h2>
        {this.renderForm(this.renderLeagues(data))}
      </div>
    );
  }

  async componentDidMount() {
    const leagues = await getLeagues();

    console.log(leagues);
    this.setState({ data: leagues });
  }

  get schema() {
    return Joi.array();
  }
  renderLeagues = data => {
    console.log(data);
    // console.log(Array.isArray(data));

    return (
      <React.Fragment>
        <table className="table">
          <tbody>
            {!isObjectEmpty(data) &&
              data.map(league => {
                return (
                  <JoinTableRow
                    league={league}
                    key={league._id}
                    handleCheckBox={() =>
                      this.toggleFlag("isSigned", "_id", league._id)
                    }
                  ></JoinTableRow>
                );
              })}
          </tbody>
        </table>

        {this.renderButton("Zapisz zmiany", "btn behaviour--horizontal-center")}
      </React.Fragment>
    );
  };

  doSubmit = async () => {
    const { data } = this.state;
    const result = await saveUserLeagues(data);

    //todo handle situation when save has not been succssful
    if (result.status === 200) this.props.onSubmit();
  };
}

export default JoinTeamComponent;
