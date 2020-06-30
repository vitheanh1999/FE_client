import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as botsActions from '../../actions/ListBots';
import * as newsActions from '../../actions/news';
import DashBoardComponent from '../../components/dashboard/DashBoard';

class DashBoard extends Component {
  componentDidMount() { }

  componentWillUnmount() {}

  render() {
    const {
      actions, data, handleChangeTab, portrait,
    } = this.props;
    const { listBots } = data;
    return (
      <DashBoardComponent
        fetchListBots={actions.fetchListBots}
        fetchChartData={actions.fetchChartData}
        fetchBotHistory={actions.fetchBotHistory}
        fetchListNews={actions.fetchListNews}
        handleChangeTab={handleChangeTab}
        listBots={listBots}
        portrait={portrait}
      />
    );
  }
}

DashBoard.propTypes = {
  actions: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
  portrait: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  data: {
    deposit: state.Deposit,
    listBots: state.ListBots,
  },
});

const mapDispatchToProps = dispatch => ({
  actions: {
    fetchListBots: bindActionCreators(botsActions.fetchListBots, dispatch),
    fetchChartData: bindActionCreators(botsActions.fetchChartData, dispatch),
    fetchBotHistory: bindActionCreators(botsActions.fetchBotHistory, dispatch),
    fetchListNews: bindActionCreators(newsActions.fetchListNews, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
