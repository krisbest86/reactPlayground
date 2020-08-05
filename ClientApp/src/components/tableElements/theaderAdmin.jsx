import React, { Component } from "react";
import _ from "lodash";
import { getKeyFixed, getArrayFromObject } from "../../library/utils";
import DropDown from "../generic/dropdown";
import Slider from "../generic/slider.jsx";

class HeaderTable extends Component {
  state = {};
  render() {
    const columns = Array.isArray(this.props.columnsDefinition)
      ? this.props.columnsDefinition
      : getArrayFromObject(this.props.columnsDefinition);

    // console.log(columns);
    return (
      <thead>
        {columns && !_.isEmpty(columns) && (
          <tr>
            {this.props.actionsButtons && <th key={"actionsButtons"} />}
            {}
            {columns.map(
              (column) => (
                // !column.content && (
                <th key={getKeyFixed("th", column.key)}>
                  <div>
                    {this.renderSortIcon(column.key)}
                    {this.renderTitle(column)}

                    {column.input && this.renderInput(column)}
                    {column.dropdown && this.renderDropDown(column)}
                    {column.slider && this.renderSlider(column)}
                  </div>
                </th>
              )
              // )
            )}
          </tr>
        )}
      </thead>
    );
  }

  renderTitle = (column) => {
    return (
      <span
        className="clickable"
        onClick={() => this.props.handleSorting(this.sortingObject(column.key))}
      >
        {column.title}
      </span>
    );
  };

  sortingObject = (name) => {
    let field = this.props.sorting.filter((a) => a.field === name);

    // console.log(this.props.sorting);
    // console.log(field);

    if (!field.length) {
      this.props.sorting.push({
        order: "desc",
        field: name,
      });

      // console.log(this.props.sorting);

      return this.props.sorting;
    }

    return this.props.sorting.reduce((agg, i) => {
      if (i.field === name)
        i.order === "asc"
          ? (i.order = "desc")
          : i.order === "desc"
          ? (i.order = "")
          : (i.order = "asc");

      agg.push(i);
      return agg;
    }, []);
  };

  renderSortIcon = (column) => {
    // console.log(this.props.sorting);

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

  renderSlider = (column) => {
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
    console.log(column.filter);
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
