import React from "react";
import Form from "../generic/form";
import Joi from "joi";

class JoinTableRow extends Form {
  state = {};

  render() {
    const { league } = this.props;

    return (
      <tr>
        <td>{league.name}</td>
        <td>
          {this.renderCheckBox(
            this.props.handleCheckBox,
            league.isSigned || false,
            {
              checked: "Gram",
              notChecked: "Nie gram"
            }
          )}
        </td>
      </tr>
    );
  }
}

export default JoinTableRow;
