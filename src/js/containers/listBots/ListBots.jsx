import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ModalBody } from 'reactstrap';
import * as botActions from '../../actions/ListBots';
import * as DepositActions from '../../actions/Deposit';
import * as authActions from '../../actions/auth';
import * as chargeAction from '../../actions/charge';
import * as campaignAction from '../../actions/campaign';
import * as tableActions from '../../actions/table';
import AutoBots from '../../components/listBots/AutoBots';
import BotDetail from '../../components/botDetail/BotDetail';
import { socketConnection } from '../../components/viewScreenGame/Utils';
import StorageUtils, { STORAGE_KEYS } from '../../helpers/StorageUtils';
import { PER_PAGE, SORT_BOT_OPTIONS } from '../../constants/Constants';
import i18n from '../../i18n/i18n';
import { ModalWrapper, ModalHeaderCustom } from '../../components/common/CommonStyle';
import { Content, JapanFont } from '../../components/listBots/listBotsStyle';

class ListBots extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowDetail: false,
      bot: null,
      sortBy: SORT_BOT_OPTIONS[0].value,
      currentPage: 1,
    };

    this.showBotDetail = this.showBotDetail.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.registerChangeTable = this.registerChangeTable.bind(this);
    this.handleSortBots = this.handleSortBots.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.fetchListBots = this.fetchListBots.bind(this);
  }

  componentDidMount() {
    this.props.actions.refreshToken(() => { }, () => { });
    this.registerChangeTable(socketConnection);
  }

  componentWillUnmount() {
    socketConnection.unsubscribe('change-table');
  }

  onChangePage(currentPage, onSuccess, onError) {
    this.setState({ currentPage }, () => this.fetchListBots(onSuccess, onError));
  }

  closeModal(isDeleteBot = null) {
    const { data } = this.props;
    let { currentPage } = this.state;
    if (data.listBots.bots.length === 1 && isDeleteBot === true) {
      currentPage = 1;
    }
    this.setState({
      isShowDetail: false,
      bot: null,
      currentPage,
    }, () => this.fetchListBots());
    this.registerChangeTable(socketConnection);
  }

  handleSortBots(value, onSuccess, onError) {
    this.setState({ sortBy: value }, () => this.fetchListBots(onSuccess, onError));
  }

  showBotDetail(bot) {
    this.setState({
      isShowDetail: true,
      bot,
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

  fetchListBots(onSuccess = () => { }, onError = null) {
    const { sortBy, currentPage } = this.state;
    this.props.actions.listBots.fetchListBots(onSuccess, onError, {
      sortBy,
      currentPage,
      perPage: PER_PAGE,
    });
  }

  renderDetailModal() {
    const {
      handleChangeTab, data,
      actions, fontSize,
      isMobile,
    } = this.props;
    const {
      bot, isShowDetail,
      sortBy, currentPage,
    } = this.state;
    const botId = bot.id;
    return (
      <ModalWrapper
        isOpen={isShowDetail}
        toggle={this.closeModal}
        isMobile={isMobile}
      >
        <ModalHeaderCustom toggle={this.closeModal}>
          <JapanFont>{i18n.t('botDetailHeader', { botId })}</JapanFont>
        </ModalHeaderCustom>
        <ModalBody>
          <BotDetail
            botId={botId}
            bot={data.listBots.botDetail}
            listTable={data.listTable}
            handleChangeTab={handleChangeTab}
            actions={actions}
            listBotAction={actions.listBots}
            lucUserGC={data.listBots.lucUserGC}
            historyData={data.listBots.history.data}
            labels={data.listBots.chartData.labels}
            revenueHistory={data.listBots.chartData.gc}
            lastestUpdateAt={data.listBots.chartData.lastestUpdateAt}
            depositData={data.deposit}
            fetchListBots={this.fetchListBots}
            sortBy={sortBy}
            currentPage={currentPage}
            fontSize={fontSize}
            isMobile={isMobile}
            listCampaigns={data.listCampaigns}
            closeModal={this.closeModal}
          />
        </ModalBody>
      </ModalWrapper>
    );
  }

  render() {
    const {
      data, actions, isMobile,
      handleChangeTab, fontSize,
    } = this.props;
    const { isShowDetail, currentPage } = this.state;
    return (
      <Content>
        <AutoBots
          data={data}
          actions={actions}
          fetchListTable={actions.fetchListTable}
          fetchListBots={this.fetchListBots}
          updateBotStatus={actions.listBots.updateBotStatus}
          fetchUser={actions.fetchUser}
          fetchBotHistoryNow={actions.listBots.fetchBotHistoryNow}
          createBots={actions.listBots.createBots}
          listBotAction={actions.listBots}
          fetchBotGCNow={actions.listBots.fetchBotGCNow}
          fetchTableStatusNow={actions.listBots.fetchTableStatusNow}
          fetchMinProfitValue={actions.listBots.fetchMinProfitValue}
          updateNameTable={actions.listBots.updateNameTable}
          fetchListCampaigns={actions.fetchListCampaigns}
          updateCampaign={actions.updateCampaign}
          fetchBotDetail={actions.listBots.fetchBotDetail}
          showBotDetail={this.showBotDetail}
          handleChangeTab={handleChangeTab}
          handleSortBots={this.handleSortBots}
          onChangePage={this.onChangePage}
          registerChangeTable={this.registerChangeTable}
          fontSize={fontSize}
          isMobile={isMobile}
          pageInfo={{ currentPage, perPage: PER_PAGE }}
        />
        {isShowDetail && (
          this.renderDetailModal()
        )}
      </Content>
    );
  }
}

ListBots.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
  fontSize: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    data: {
      listBots: state.ListBots,
      userInfo: state.User,
      deposit: state.Deposit,
      listCampaigns: state.Campaigns.listCampaigns,
      listTable: state.table.listTable,
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
      fetchMinProfitValue: bindActionCreators(botActions.fetchMinProfitValue, dispatch),
      updateNameTable: bindActionCreators(botActions.updateNameTable, dispatch),
      updateChargeGc: bindActionCreators(chargeAction.updateChargeGc, dispatch),
      fetchListCampaigns: bindActionCreators(campaignAction.fetchListCampaigns, dispatch),
      updateCampaign: bindActionCreators(botActions.updateBotCampaign, dispatch),
      refreshToken: bindActionCreators(authActions.refreshToken, dispatch),
      fetchListTable: bindActionCreators(tableActions.fetchListTable, dispatch),
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListBots);
