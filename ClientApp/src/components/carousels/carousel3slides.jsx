import React, { Component } from "react";

import {
  returnHeightBasedOnScreen,
  isMobileDevice,
  isAtLeastSmallScreen,
  isObjectEmpty
} from "../../library/utils";
import LabelCenteredText from "../labels/labelTextCentered";

class Carousel3Slides extends Component {
  state = {}; //state may be useful to apply transitionons
  fixedStartingSlide = null;

  render() {
    const { firstSlide, selectedSlide } = this.props.scheduleProps;
    const isMobileOrTheSmallest = isMobileDevice() && !isAtLeastSmallScreen();
    return (
      <div className="container ">
        {!isObjectEmpty(this.props.schedule) &&
          this.props.schedule.length > 1 && (
            <div className="row container container--row">
              {isMobileOrTheSmallest
                ? this.arrowsSmallScreen(firstSlide, selectedSlide)
                : this.arrowsBiggerThanSmallcreen(firstSlide, selectedSlide)}
            </div>
          )}
      </div>
    );
  }

  arrowsSmallScreen = (firstSlide, selectedSlide) => {
    const { schedule } = this.props;

    return (
      <React.Fragment>
        <div
          className={
            schedule.length > 3
              ? " column__smallest-9 column--widthAdjustedWidth "
              : "column--widthAdjustedWidth column__smallest-12"
          }
        >
          {this.getSlideElement(firstSlide, selectedSlide)}
          {schedule.length > 1 &&
            this.getSlideElement(firstSlide + 1, selectedSlide)}
          {schedule.length > 2 &&
            this.getSlideElement(firstSlide + 2, selectedSlide)}
        </div>
        {schedule.length > 3 && (
          <div className="column__smallest-3">
            {this.getArrow("up", "back")}
            {this.getArrow("down", "forward")}
          </div>
        )}
      </React.Fragment>
    );
  };
  arrowsBiggerThanSmallcreen = (firstSlide, selectedSlide) => {
    const { schedule } = this.props;

    return (
      <React.Fragment>
        {schedule.length > 3 && this.getArrow("left", "back", true)}
        <div
          className={
            " container container--row column column__smallest-6 " +
            (schedule.length > 3 ? "column__medium-8" : "column__medium-12")
          }
        >
          {this.getSlideElement(firstSlide, selectedSlide, true)}
          {schedule.length > 1 &&
            this.getSlideElement(firstSlide + 1, selectedSlide, true)}
          {schedule.length > 2 &&
            this.getSlideElement(firstSlide + 2, selectedSlide, true)}
        </div>
        {schedule.length > 3 && this.getArrow("right", "forward", true)}
      </React.Fragment>
    );
  };

  getArrow = (arrowDirection, scheduleDirection, isNotSmallest) => {
    let classes = " behaviour--centered behaviour--vertical-center";

    classes += isNotSmallest
      ? " column column__smallest-3  column__medium-2"
      : " row__smallest-6 ";

    return (
      <div
        className={classes}
        onClick={
          scheduleDirection === "forward"
            ? this.incrementIndexArrow
            : this.decrementIndexArrow
        }
      >
        {(scheduleDirection === "forward"
          ? this.isVisibleRightArrow()
          : this.isVisibleLeftArrow()) && (
          <i
            className={"fa fa-chevron-" + arrowDirection}
            style={{ fontSize: "3rem" }}
          />
        )}
      </div>
    );
  };

  getSlideElement = (index, selectedSlide, isNotSmallest) => {
    return (
      <LabelCenteredText
        index={index}
        className={
          index === selectedSlide
            ? "  divBlock--selectedSlide " +
              (isNotSmallest ? " column__medium-6 column__smallest-6 " : " ")
            : "  divBlock--slide " +
              (isNotSmallest ? " column__medium-3 column__smallest-3 " : " ")
        }
        onClick={
          index < selectedSlide
            ? () => this.decrementIndex(index)
            : index > selectedSlide
            ? () => this.incrementIndex(index)
            : null
        }
        text={this.props.schedule[index] && this.props.schedule[index].name}
      />
    );
  };

  isVisibleLeftArrow = () => {
    return this.props.scheduleProps.selectedSlide > 0;
  };

  isVisibleRightArrow = () => {
    // console.log(this.props.scheduleProps.selectedSlide);
    // console.log(this.props.schedule.length - 1);
    return (
      this.props.scheduleProps.selectedSlide < this.props.schedule.length - 1
    );
  };

  incrementIndex = key => {
    const index = this.props.scheduleProps.selectedSlide + 1;
    if (index < this.props.schedule.length) {
      this.props.onScheduleChange(key, this.props.scheduleProps.firstSlide);
    }
  };

  decrementIndex = key => {
    const index = this.props.scheduleProps.selectedSlide - 1;
    if (index >= 0) {
      this.props.onScheduleChange(key, this.props.scheduleProps.firstSlide);
    }
  };

  incrementIndexArrow = () => {
    const index = this.props.scheduleProps.selectedSlide + 1;
    if (index < this.props.schedule.length) {
      this.props.onScheduleChange(
        index,
        Math.min(index - 1, this.props.schedule.length - 3)
      );
    }
  };

  decrementIndexArrow = () => {
    const index = this.props.scheduleProps.selectedSlide - 1;
    if (index >= 0) {
      this.props.onScheduleChange(index, Math.max(0, index - 1));
    }
  };
}

export default Carousel3Slides;
