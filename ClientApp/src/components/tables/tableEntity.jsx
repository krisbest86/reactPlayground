import React, { Component } from "react";
import Header from "../tableElements/theader";
import Body from "../tableElements/tbody";

class TableEntity extends Component {
  render() {
    return (
      <React.Fragment>
        <h2 className="headline headline--centered">{this.props.title}</h2>
        <div className="behaviour--overflow--auto wrapper">
          <table className={this.props.className || "table"}>
            <Header
              sorting={this.props.sorting}
              handleSorting={this.props.handleSorting}
              handleChangeFilter={this.props.handleChangeFilter}
              handleChangeFilterNameValue={
                this.props.handleChangeFilterNameValue
              }
              columnsDefinition={
                this.props.columnsDefinition || this.props.schema
              }
              actionsButtons={
                this.props.post ||
                this.props.get ||
                this.props.post ||
                this.props.delete
              }
            />

            <Body
              columnsDefinition={
                this.props.columnsDefinition || this.props.schema
              }
              dataDatalistInputs={this.props.dataDatalistInputs}
              tableData={this.props.data}
              deleteRow={this.props.delete}
              insertRow={this.props.post}
              downloadFile={this.props.download}
              updateData={this.props.put}
              trOnClick={this.props.trOnClick}
            />
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default TableEntity;
