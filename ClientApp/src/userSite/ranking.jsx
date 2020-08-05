import React, { Component } from "react";
import TableRanking from "../components/tables/tableLeagueRanking";
import { getCurrentRanking } from "../services/leagueService";
import DataInterface from "../components/generic/dataInterface";
import Pagination from "../components/generic/pagination";
import _ from "lodash";
import { connect } from "react-redux";
import Modal from "../components/modalWindows/modalOnlyContent";
import { ToggleModal, getImages } from "../library/utils";
import FieldCanvas from "../components/generic/fieldCanvas";
import { getTeamById } from "../services/teamService";

class RankingComponent extends DataInterface {
  state = {
    data: "",
    currentLeagueId: "",
    sorting: {
      order: "desc",
      field: ""
    },
    filterColumn: {},
    pagination: { actualPage: 1, size: 20 },
    currentModalTeam: {}
  };

  async componentDidMount() {
    await this.refreshData();
  }

  async refreshData() {
    const data = await getCurrentRanking(this.props.leagueSettings._id);
    // console.log(data);
    this.setState({
      data: (data && data.ranking) || [],
      currentLeagueId: (data && data._id) || this.props.leagueSettings._id
    });
  }

  render() {
    const { data, currentLeagueId } = this.state;

    if (
      this.props.leagueSettings &&
      currentLeagueId !== this.props.leagueSettings._id
    )
      this.refreshData();

    const numberOfPages = Math.ceil(data.length / this.state.pagination.size);

    // console.log(this.props)
    return (
      <React.Fragment>
        {this.props.leagueSettings.name && (
          <h2 className="headline headline--centered">
            {this.props.leagueSettings.name} Ranking
          </h2>
        )}
        {this.state.data && (
          <TableRanking
            // sortColumn={this.state.sortColumn}
            data={this.pageData()}
            displayedItems={data.length}
            onSort={this.handleSortClick}
            handleChangeFilter={this.handleChangeFilter}
            onRowClick={this.OpenTeam}
          />
        )}

        {numberOfPages > 1 && (
          <Pagination
            numberOfPages={numberOfPages}
            actualPage={this.state.pagination.actualPage}
            handlePagination={this.handlePagination}
          />
        )}

        <Modal idButton={"teamField"}>
          <FieldCanvas
            team={this.state.currentModalTeam}
            images={getImages()}
            gamesOn={true}
          ></FieldCanvas>
        </Modal>
      </React.Fragment>
    );
  }

  handleSortClick = sortColumn => {
    this.setState({ sortColumn });
  };

  OpenTeam = async team => {
    // console.log(team);
    const response = await getTeamById(team._id);
    // console.log(response.data);
    ToggleModal("teamField", null);
    this.setState({ currentModalTeam: response.data });
  };
}

const mapStateToProps = state => {
  const { leagueReducer } = state;
  const leagueSettings = leagueReducer;

  return { leagueSettings };
};

export default connect(mapStateToProps)(RankingComponent);
