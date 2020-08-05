import React, { Component } from "react";
import ButtonComponent from "../generic/button";
import DropDown from "../generic/dropdown";
import InputComponent from "../generic/input";
import { errorToast } from "../../library/toasts";
import RadioButton from "../generic/radiobutton";
import { getOrigin } from "../../services/gameService";

class PointsEvents extends Component {
  state = {
    currentEvent: { name: "", value: 0 },
    positions: "",
    checkedPosition: this.DefaultCheckedPosition
  };

  componentDidMount = async () => {
    const { origin } = this.props;
    // console.log(origin);
    if (!origin) return;

    var originDb = await getOrigin(origin);

    if (!originDb || !originDb.positionTypesValues) return;
    const options = originDb.positionTypesValues;
    options.push(this.DefaultCheckedPosition);
    console.log(options);
    this.setState({ positions: options });
  };

  render() {
    const { events } = this.props;

    //todo get origin and take positions and pass to redio button

    const options = events
      ? events.map(a => {
          return this.mapEvent(a);
        })
      : [];
    return (
      <React.Fragment>
        <div>
          <DropDown
            name={"events"}
            options={options}
            deleteOption={this.deleteEvent}
          ></DropDown>
        </div>

        <div className="behaviour--minwidth15">
          <InputComponent
            placeholder="event name"
            onChange={e => this.onChange(e, "name")}
          ></InputComponent>
          <InputComponent
            type="number"
            placeholder="points"
            onChange={e => this.onChange(e, "value")}
          ></InputComponent>
          <RadioButton
            options={this.state.positions}
            default={this.DefaultCheckedPosition}
            parentKey={this.props.parentkey || "key"}
            onCheckedChanged={this.onCheckedChanged}
            checked={this.state.checkedPosition}
          ></RadioButton>
        </div>
        <div>
          <ButtonComponent
            className="btn"
            name={"add"}
            onClick={this.addEvent}
          ></ButtonComponent>
        </div>
      </React.Fragment>
    );
  }

  get DefaultCheckedPosition() {
    return "All";
  }
  onChange = (input, type) => {
    let { currentEvent } = this.state;

    currentEvent[type] = input.target.value;

    this.setState({ currentEvent });
  };
  addEvent = () => {
    let { currentEvent, checkedPosition } = this.state;

    if (!currentEvent.name) return errorToast("Missing name", 3000);
    if (!currentEvent.value) return errorToast("Missing points value", 3000);

    this.props.addEvent("pointEvents", {
      name: currentEvent.name,
      value: currentEvent.value,
      position: checkedPosition
    });
  };
  deleteEvent = event => {
    this.props.deleteEvent(this.props.name, element => {
      return (
        `${element.name} ${element.value} punkty (position:${element.position})` ===
        event
      );
    });
  };

  mapEvent = a => {
    return (
      `${a.name} ${a.value} punkty ` + (a.position ? `(${a.position})` : "")
    );
  };

  onCheckedChanged = checkedPosition => {
    // console.log(checked);
    this.setState({ checkedPosition });
  };
}

export default PointsEvents;
