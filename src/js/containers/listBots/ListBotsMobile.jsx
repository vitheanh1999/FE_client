import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as botActions from '../../actions/ListBots';
import * as DepositActions from '../../actions/Deposit';
import * as authActions from '../../actions/auth';
import BotInfoMobile from '../../components/listBots/BotInfoMobile';
import ListBotsMobile from '../../components/listBots/ListBotsMobile';
import { socketConnection } from '../../components/viewScreenGame/Utils';
import StorageUtils, { STORAGE_KEYS } from '../../helpers/StorageUtils';
import BotDetailMobile from '../../components/botDetail/BotDetailMobile';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const WrapperBotsInfo = styled.div`
  height: 20%;
  width: 100%;
`;

const WrapperListBots = styled.div`
  min-height: 80%;
  margin-top: 1em;
  background: #fff;
`;

class MobileBots extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowBotDetail: false,
      botId: null,
      sortBy: 'register_time',
    };

    this.showBotDetail = this.showBotDetail.bind(this);
  }

  showBotDetail(id) {
    const { isShowBotDetail } = this.state;
    this.setState({
      botId: id,
      isShowBotDetail: !isShowBotDetail,
    });
  }

  registerChangeTable(socket = socketConnection) {
    socket.unsubscribe('change-table');
    const nameResult = 'change-table';
    const resultTurn = socket.subscribe(nameResult);
    resultTurn.bind('change-table', (event) => {
      this.setState({});
      StorageUtils.setItemObject(STORAGE_KEYS.listGroupBotChangeTable, event.data);
    });
  }

  renderBotsInfo() {
    const { actions, data } = this.props;
    return (
      <BotInfoMobile
        fetchUser={actions.fetchUser}
        currentUser={data.userInfo}
      />
    );
  }

  renderListBots() {
    const { actions, data } = this.props;
    const { botId } = this.state;
    return (
      <ListBotsMobile
        listBots={data.listBots}
        fetchUser={actions.fetchUser}
        showBotDetail={this.showBotDetail}
        userInfo={data.userInfo}
        handleChangeTab={this.props.handleChangeTab}
        handleSortBots={this.handleSortBots}
        registerChangeTable={this.registerChangeTable}
        botActions={actions.botActions}
        botId={botId}
      />
    );
  }

  renderBotDetail() {
    const { botId } = this.state;
    const { handleChangeTab, data, actions } = this.props;
    return (
      <BotDetailMobile
        botId={botId}
        bot={data.listBots.botDetail}
        handleChangeTab={handleChangeTab}
        updateBotStatus={actions.listBots.updateBotStatus}
        userInfo={data.userInfo}
        fetchBotHistory={actions.listBots.fetchBotHistory}
        historyData={data.listBots.history.data}
        labels={data.listBots.chartData.labels}
        revenueHistory={data.listBots.chartData.gc}
        lastestUpdateAt={data.listBots.chartData.lastestUpdateAt}
        fetchChartData={actions.listBots.fetchChartData}
        depositData={data.deposit}
        fetchPaymentInfo={actions.fetchPaymentInfo}
        requestPaying={actions.requestPaying}
        getPriceUSD={actions.getPriceUSD}
        getPriceBTC={actions.getPriceBTC}
        fetchListBots={actions.listBots.fetchListBots}
        fetchBotDetail={actions.listBots.fetchBotDetail}
        fetchBotHistoryNow={this.props.actions.listBots.fetchBotHistoryNow}
        fetchUser={actions.fetchUser}
        listBotAction={this.props.actions.listBots}
        gift={this.props.actions.gift}
        payout={this.props.actions.payout}
        sortBy={this.state.sortBy}
        fetchBotGCNow={actions.listBots.fetchBotGCNow}
        fetchTableStatusNow={actions.listBots.fetchTableStatusNow}
        onCloseBotDetail={this.showBotDetail}
      />
    );
  }

  render() {
    const { isShowBotDetail } = this.state;
    return (
      <Wrapper>
        <WrapperBotsInfo>
          {this.renderBotsInfo()}
        </WrapperBotsInfo>
        <WrapperListBots>
          {this.renderListBots()}
        </WrapperListBots>
        {isShowBotDetail && (
          this.renderBotDetail()
        )}
      </Wrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: {
      listBots: state.ListBots,
      userInfo: state.User,
      deposit: state.Deposit,
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      listBots: bindActionCreators(botActions, dispatch),
      fetchPaymentInfo: bindActionCreators(DepositActions.fetchPaymentInfo, dispatch),
      getPriceUSD: bindActionCreators(DepositActions.getPriceUSD, dispatch),
      getPriceBTC: bindActionCreators(DepositActions.getPriceBTC, dispatch),
      requestPaying: bindActionCreators(DepositActions.requestPaying, dispatch),
      fetchUser: bindActionCreators(authActions.fetchUser, dispatch),
      gift: bindActionCreators(DepositActions.gift, dispatch),
      payout: bindActionCreators(botActions.payout, dispatch),
      botActions: bindActionCreators(botActions, dispatch),
    },
  };
}

MobileBots.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MobileBots);
