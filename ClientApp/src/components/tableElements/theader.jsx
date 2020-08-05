import React, { Component } from "react";
import _ from "lodash";
import { getKeyFixed } from "../../library/utils";
import DropDown from "../generic/dropdown";
import Slider from "../generic/slider.jsx";

class HeaderTable extends Component {
  state = {};
  render() {
    return (
      <thead>
        {!_.isEmpty(this.props.columnsDefinition) && (
          <tr>
            {this.props.actionsButtons && <th key={"actionsButtons"} />}
            {}
            {this.props.columnsDefinition.map(
              column =>
                !column.content && (
                  <th key={getKeyFixed("th", column.key)}>
                    <div>
                      {this.renderSortIcon(column.key)}
                      <span
                        className={this.props.handleSorting ? "clickable" : ""}
                        onClick={() =>
                          this.props.handleSorting(
                            this.sortingObject(column.key)
                          )
                        }
                      >
                        {column.title}
                      </span>

                      {column.input && this.renderInput(column)}
                      {column.dropdown && this.renderDropDown(column)}
                      {column.slider && this.renderSlider(column)}
                    </div>
                  </th>
                )
            )}
          </tr>
        )}
      </thead>
    );
  }

  sortingObject = name => {
    if (!this.props.sorting || this.props.sorting.length === 0) {
      this.props.sorting.unshift({
        order: "desc",
        field: name
      });
      return this.props.sorting;
    }

    const pos = this.props.sorting
      .map(function(e) {
        return e.field;
      })
      .indexOf(name);

    if (pos < 0) {
      this.props.sorting.unshift({
        order: "desc",
        field: name
      });
      return this.props.sorting;
    }

    let sortElement = this.props.sorting.splice(pos, 1)[0];

    sortElement.order === "asc"
      ? (sortElement.order = "desc")
      : sortElement.order === "desc"
      ? (sortElement.order = "")
      : (sortElement.order = "asc");

    this.props.sorting.unshift(sortElement);

    return this.props.sorting;
  };

  renderSortIcon = column => {
    if (this.props.sorting) {
      for (const i of this.props.sorting) {
        if (i.field === column) {
          if (i.order) {
            if (i.order === "asc") return <i className="fa fa-sort-asc" />;

            return <i className="fa fa-sort-desc" />;
          }
        }
      }
      return null;
    }
  };

  renderSlider = column => {
    return (
      <Slider
        min={column.slider.min}
        max={column.slider.max}
        step={column.slider.step}
        name={column.key}
        onChange={this.handleSlider}
      ></Slider>
    );
  };

  renderInput(column) {
    return (
      <React.Fragment>
        <input
          name={column.key}
          placeholder="filtruj"
          onChange={this.props.handleChangeFilter}
          data-filter={column.filter}
        />
      </React.Fragment>
    );
  }

  renderDropDown(column, autofocusId) {
    // console.log(column.selected);
    return (
      <div>
        <DropDown
          autofocusId={autofocusId}
          options={column.dropdown}
          name={column.key}
          title={column.selected || "..."}
          onSelectedDropDown={this.props.handleChangeFilterNameValue}
        ></DropDown>
      </div>
    );
  }

  handleSlider = (name, value) => {
    this.props.handleChangeFilterNameValue(name, value, "MaxEqual");
  };
}

export default HeaderTable;
