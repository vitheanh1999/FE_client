import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as botsActions from '../../actions/ListBots';
import RevenueComponent from '../../components/revenue/Revenue';

class Revenue extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      fetchDataCharts, fetchPayOffHistory, listBots, fetchListBot, fetchBotHistory,
    } = this.props;
    const {
      history, bots, payOffsData,
    } = listBots;
    return (
      <RevenueComponent
        fetchDataCharts={fetchDataCharts}
        fetchPayOffHistory={fetchPayOffHistory}
        fetchListBot={fetchListBot}
        fetchBotHistory={fetchBotHistory}
        dataPayOff={history}
        chartData={history.data || []}
        listBots={bots}
        payOffsData={payOffsData}
      />
    );
  }
}

Revenue.defaultProps = {
};

Revenue.propTypes = {
  // listBots: PropTypes.object.isRequired,
  fetchDataCharts: PropTypes.func.isRequired,
  fetchPayOffHistory: PropTypes.func.isRequired,
  fetchListBot: PropTypes.func.isRequired,
  listBots: PropTypes.object.isRequired,
  fetchBotHistory: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  listBots: state.ListBots,
  state,
});

const mapDispatchToProps = dispatch => ({
  fetchPayOffHistory: bindActionCreators(botsActions.fetchPayOffHistory, dispatch),
  fetchDataCharts: bindActionCreators(botsActions.fetchChartData, dispatch),
  fetchListBot: bindActionCreators(botsActions.fetchListBots, dispatch),
  fetchBotHistory: bindActionCreators(botsActions.fetchBotHistory, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Revenue);
