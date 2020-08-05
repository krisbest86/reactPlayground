import React, { Component } from "react";

class Pagination extends Component {
  state = {};
  render() {
    // console.log(`number of pages ${this.props.numberOfPages}`);
    return (
      <div
        className="pagination__container pagination "
        actpage={this.props.actualPage}
      >
        {this.getPage("prev")}
        {this.getPages(this.props.numberOfPages)}
        {this.getPage("next")})
      </div>
    );
  }

  getPages = numberOfPages => {
    let pages = [];
    const { actualPage } = this.props;
    pages.push(this.getPage(1));

    if (actualPage > 3) pages.push(this.get3dots("..."));

    for (let index = 2; index < numberOfPages; index++) {
      if (actualPage - 3 < index && actualPage + 3 > index)
        pages.push(this.getPage(index));
    }

    if (actualPage < numberOfPages - 3) pages.push(this.get3dots("..."));

    if (numberOfPages > 1 && numberOfPages > 1)
      pages.push(this.getPage(numberOfPages));

    return pages;
  };

  get3dots = text => {
    return (
      <a className="pagination__i " key={text}>
        {text}
      </a>
    );
  };

  getPage = text => {
    let classes = "pagination__i clickable";

    if (text === this.props.actualPage) classes += " pagination__i--selected";

    return (
      <a
        className={classes}
        key={text}
        onClick={() =>
          this.props.handlePagination(text, this.props.numberOfPages)
        }
      >
        {text}
      </a>
    );
  };
}

export default Pagination;
