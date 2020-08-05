import React, { Component } from "react";

class Datalist extends Component {
  state = {};
  render() {
    const { options, name, title, team } = this.props;
    const idName = "datalist" + name;
    const idList = "list" + name;

    return (
      <div key={"div" + name}>
        <label htmlFor={idName}>{title}:</label>
        <input list={idList} onChange={this.handleChange} value={team.name} />
        <datalist id={idList}>
          {options.map((option) => {
            return (
              <option key={option._id || option}>
                {option.name || option}
              </option>
            );
          })}
        </datalist>
      </div>
    );
  }

  handleChange = ({ currentTarget: input }) => {
    this.props.select(this.props.name, input.value);
  };
}

export default Datalist;
