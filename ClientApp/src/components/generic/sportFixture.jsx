import React, { Component } from "react";

class SportFixture extends Component {
  state = {};

  render() {
    return (
      <div className="wrapper  behaviour--centered">
        {this.props.events.map(a => {
          return (
            <p className="clickable" key={a.Home.name + a.Away.name}>
              <a>{a.Home.name + " - " + a.Away.name}</a>
            </p>
          );
        })}
      </div>
    );
  }
}

export default SportFixture;
