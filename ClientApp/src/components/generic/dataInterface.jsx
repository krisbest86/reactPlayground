import { Component } from "react";
import _ from "lodash";

class DataInterface extends Component {
  state = {};

  sortData = input => {
    if (!this.state.sorting) return input;

    const fields = this.state.sorting.reduce((agg, current) => {
      if (current.order) agg.push(current.orderType || current.field);
      return agg;
    }, []);
    const orders = this.state.sorting.reduce((agg, current) => {
      if (current.order) agg.push(current.order);
      return agg;
    }, []);

    const sorted = _.orderBy(input, fields, orders);

    return sorted;
  };

  filterDataByColumn = input => {
    const activeFilters = _.pickBy(this.state.filterColumn, _.identity);

    if (_.isEmpty(activeFilters, true)) return input;

    let result = input;
    for (const key in activeFilters) {
      if (activeFilters.hasOwnProperty(key)) {
        const value = activeFilters[key];

        if (value === "...") continue;

        if (typeof value === "number") {
          result = this.filterNumber(
            key,
            value,
            this.state.filterComparers[key],
            result
          );
        } else if (typeof value === "string") {
          result = this.filterString(
            key,
            value,
            this.state.filterComparers[key],
            result
          );
        }
      }
    }

    return result;
  };

  filterNumber = (key, value, comparer, data) => {
    if (!comparer)
      return data.filter(function(item) {
        if (item[key] === value) return true;

        return false;
      });

    if (comparer.toUpperCase().indexOf("MAXEQUAL") > -1)
      return data.filter(function(item) {
        if (item[key] <= value) return true;
        return false;
      });
    if (comparer.toUpperCase().indexOf("MINEQUAL") > -1)
      return data.filter(function(item) {
        if (item[key] >= value) return true;
        return false;
      });
    if (comparer.toUpperCase().indexOf("MAX") > -1)
      return data.filter(function(item) {
        if (item[key] < value) return true;
        return false;
      });
    if (comparer.toUpperCase().indexOf("MIN") > -1)
      return data.filter(function(item) {
        if (item[key] > value) return true;
        return false;
      });
  };

  filterString = (key, value, comparer, data) => {
    if (!comparer)
      return data.filter(function(item) {
        if (
          !_.startsWith(item[key].toString().toUpperCase(), value.toUpperCase())
        )
          return false;

        return true;
      });

    if (comparer.toUpperCase().indexOf("BYSURNAME") > -1)
      return data.filter(function(item) {
        const surname = item[key].substring(item[key].indexOf(" ") + 1);
        if (
          !_.startsWith(surname.toString().toUpperCase(), value.toUpperCase())
        )
          return false;

        return true;
      });
  };
  //handle
  handleSortClick = sorting => {
    // console.log(sorting);
    this.setState({ sorting });
  };

  handleChangeFilter = ({ currentTarget: input }) => {
    const { filterColumn, filterComparers } = this.state;

    filterColumn[input.name] = input.value;

    if (input.getAttribute("data-filter"))
      filterComparers[input.name] = input.getAttribute("data-filter");

    this.setState({ filterColumn });
  };

  handleChangeFilterNameValue = (name, value, comparer) => {
    // console.log("handleChangeFilterFromDropDown");
    // console.log(name);
    // console.log(value);
    const { filterColumn, filterComparers } = this.state;

    filterColumn[name] = value;
    filterComparers[name] = comparer;

    this.setState({ filterColumn });
  };

  handlePagination = (text, numberOfPages) => {
    const { pagination } = this.state;

    // console.log(numberOfPages);
    // console.log(this.state.pagination.actualPage + 1);
    switch (text) {
      case "prev":
        pagination.actualPage = Math.max(
          1,
          this.state.pagination.actualPage - 1
        );
        break;
      case "next":
        pagination.actualPage = Math.min(
          numberOfPages,
          this.state.pagination.actualPage + 1
        );
        break;
      default:
        pagination.actualPage = text;
    }

    pagination.numberOfPages = numberOfPages;
    // console.log(pagination);
    this.setState({ pagination });
  };

  pageData = () => {
    const { data } = this.state;
    return data.slice(
      (this.state.pagination.actualPage - 1) * this.state.pagination.size,
      this.state.pagination.actualPage * this.state.pagination.size
    );
  };
}

export default DataInterface;
