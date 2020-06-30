import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as botsActions from '../../actions/ListBots';
import Spinner from '../../components/common/Spinner';
import RevenueMobileComponent from '../../components/revenueMobile/RevenueMobile';
import SuperRevenue from './SuperRevenue';
import HistoryMobile from '../../components/common/HistoryMobile';

const HistoryArea = styled.div`
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const RevenueMobileArea = styled.div`
  width: 100%;
`;

class RevenueMobile extends SuperRevenue {
  render() {
    const { listBots } = this.props;
    const { chartData } = listBots;
    const { selectedBotId, startDate, endDate } = this.state;
    const date = { startDate, endDate };

    return (
      <Content>
        <Spinner isLoading={this.state.isLoading} />
        <RevenueMobileArea>
          <RevenueMobileComponent
            labels={chartData.labels}
            revenueHistory={chartData.gc}
            lastestUpdateAt={chartData.lastestUpdateAt}
            onChangeSelectBots={this.onChangeSelectBots}
            selectedBotId={selectedBotId}
            listBots={listBots.bots}
            date={date}
            handleChangeDate={this.onChangeDate}
          />
        </RevenueMobileArea>
        <HistoryArea>
          <HistoryMobile
            data={listBots.history.data}
          />
        </HistoryArea>
      </Content>
    );
  }
}

RevenueMobile.defaultProps = {
};

RevenueMobile.propTypes = {
  listBots: PropTypes.object.isRequired,
  fetchListBots: PropTypes.func.isRequired,
  fetchBotHistory: PropTypes.func.isRequired,
  fetchChartData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  listBots: state.ListBots,
});

const mapDispatchToProps = dispatch => ({
  fetchListBots: bindActionCreators(botsActions.fetchListBots, dispatch),
  fetchBotHistory: bindActionCreators(botsActions.fetchBotHistory, dispatch),
  fetchChartData: bindActionCreators(botsActions.fetchChartData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RevenueMobile);
