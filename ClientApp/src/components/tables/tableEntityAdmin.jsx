import React, { Component } from "react";
import Header from "../tableElements/theaderAdmin";
import Body from "../tableElements/tbodyAdmin";

class TableEntity extends Component {
  render() {
    return (
      <React.Fragment>
        <h2 className="headline headline--centered">{this.props.title}</h2>
        <div className="behaviour--overflow--auto wrapper">
          <table className="table">
            <Header
              sorting={this.props.sorting}
              handleSorting={this.props.handleSorting}
              handleChangeFilter={this.props.handleChangeFilter}
              columnsDefinition={this.props.schema}
              actionsButtons={
                this.props.post ||
                this.props.get ||
                this.props.post ||
                this.props.delete
              }
            />

            <Body
              columnsDefinition={this.props.schema}
              dataDatalistInputs={this.props.dataDatalistInputs}
              tableData={this.props.data}
              deleteRow={this.props.delete}
              insertRow={this.props.post}
              downloadFile={this.props.download}
              updateData={this.props.put}
            />
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default TableEntity;
