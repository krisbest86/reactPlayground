import React, { Component } from "react";

class Slider extends Component {
  state = {};

  get sliderId() {
    return "slider" + this.props.name;
  }
  get spanId() {
    return "span" + this.props.name;
  }
  render() {
    const { min, max, step } = this.props;
    return (
      <React.Fragment>
        <span id={this.spanId}>{max}</span>
        <div className="slidecontainer">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            className="slider"
            id={this.sliderId}
            onInput={this.onInput}
          ></input>
        </div>
      </React.Fragment>
    );
  }

  onInput = () => {
    const element = document.getElementById(this.sliderId);

    document.getElementById(this.spanId).innerHTML = element.value;
    this.props.onChange(this.props.name, Number(element.value));
  };
}

export default Slider;
