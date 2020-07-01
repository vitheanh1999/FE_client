import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import moment from 'moment';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import Alert from '../common/Alert/Alert';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import {
  ModalWrapper, ContentArea,
  Wrapper, ModalHeaderCustom,
} from './BotDetailStyle';
import History from '../common/History';
import ChartRevenueHistory from './ChartRevenueHistory';
import {
  TAB, getMinDate,
  FORMAT_DATE_TIME, NUMBER_GC_FOR_BOT,
  BOT_STATUSES, PER_PAGE,
  DEFAULT_DATE_DIFF, convertToLocalTime,
} from '../../constants/Constants';
import GameScene from '../viewScreenGame/GameScene';
import i18n from '../../i18n/i18n';
import Spinner from '../common/Spinner';
import BotDetailInfo from './BotDetailInfo';
import PopupOnBot from '../common/PopupOnBot';
import { SpanRed, WrapperTimeUpdate } from '../revenue/RevenueStyle';

export const DEPOSIT_STATUS = {
  DEPOSITED: 1,
  CAN_DEPOSIT: 0,
  WAITING: 2,
};

class BotDetail extends Component {
  constructor(props) {
    super(props);
    dayjs.extend(utc);
    this.state = {
      history: {
        currentPage: 1,
        sumPage: 1,
        perPage: 10,
        isShowPopupOnBot: false,
      },
      endDate: dayjs.utc().format(FORMAT_DATE_TIME),
      startDate: (getMinDate() < dayjs.utc().subtract(DEFAULT_DATE_DIFF, 'day').format(FORMAT_DATE_TIME))
        ? dayjs.utc().subtract(DEFAULT_DATE_DIFF, 'day').format(FORMAT_DATE_TIME)
        : getMinDate(),
      showGameScene: false,
      isLoading: false,
      chartUpdateTime: null,
    };

    this.onError = this.onError.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onSuccessChangeBotName = this.onSuccessChangeBotName.bind(this);
    this.onSuccessBotHistory = this.onSuccessBotHistory.bind(this);
    this.fetchUser = this.fetchUser.bind(this);
    this.closeViewMode = this.closeViewMode.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.gameSceneRef = React.createRef();
    this.onResize = this.onResize.bind(this);
    this.openViewMode = this.openViewMode.bind(this);
    this.handleUpdateBotStatus = this.handleUpdateBotStatus.bind(this);
    this.handleUpdateBotName = this.handleUpdateBotName.bind(this);
    this.handleUpdateBotCampaign = this.handleUpdateBotCampaign.bind(this);
    this.onSuccessDeleteBot = this.onSuccessDeleteBot.bind(this);
    this.handleDeleteBot = this.handleDeleteBot.bind(this);
    this.gcForBot = NUMBER_GC_FOR_BOT;
    window.addEventListener('resize', this.onResize);
    this.botDetailInfoRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const { botId, listBotAction, actions } = this.props;
    const { endDate, startDate } = this.state;
    listBotAction.fetchBotDetail(botId, () => { }, () => { });
    this.fetchBotHistory();
    actions.fetchListTable(() => { }, this.onError);
    listBotAction.fetchChartData(botId, startDate, endDate, () => {
      this.setState({ isLoading: false });
    }, this.onError);
    listBotAction.fetchMinProfitValue((data) => {
      ApiErrorUtils.handleServerError(data, Alert.instance, () => {
        this.gcForBot = data.data.deposit;
      });
    }, this.onError);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.setState({});
    if (this.resizeTimeOut) clearTimeout(this.resizeTimeOut);
    this.resizeTimeOut = setTimeout(() => {
      if (this.gameSceneRef.current) {
        this.gameSceneRef.current.woodPlaneRef.current.lobbyBoardRef.current.reRenderCanvas();
      }
      this.resizeTimeOut = null;
    }, 500);
  }

  onSuccess(data) {
    const { botId, listBotAction } = this.props;
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      Alert.instance.showAlert(i18n.t('success'), data.message);
      listBotAction.fetchBotDetail(botId, () => { }, () => { });
      listBotAction.fetchListBots(() => { }, () => { }, {
        sortBy: this.props.sortBy,
        currentPage: this.props.currentPage,
        perPage: PER_PAGE,
      });
    }, () => { });
    this.setState({ isLoading: false });
  }

  onSuccessChangeBotName(data) {
    const { botId, listBotAction } = this.props;
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      Alert.instance.showAlert(i18n.t('success'), data.message);
      listBotAction.fetchBotDetail(botId, () => { }, () => { });
      listBotAction.fetchListBots(() => { }, () => { }, {
        sortBy: this.props.sortBy,
        currentPage: this.props.currentPage,
        perPage: PER_PAGE,
      });
    }, () => {
      this.botDetailInfoRef.current.handleChangeBotNameErrol();
    });
    this.setState({ isLoading: false });
  }

  onSuccessDeleteBot(data) {
    const { closeModal } = this.props;
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      setTimeout(() => {
        Alert.instance.showAlert(
          i18n.t('success'),
          data.message,
          i18n.t('OK'),
          () => {
            closeModal(true);
            Alert.instance.hideAlert();
          },
          () => {
            closeModal(true);
            Alert.instance.hideAlert();
          },
        );
      }, 500);
    }, () => { });
    this.setState({ isLoading: false });
  }

  onError(error) {
    try {
      ApiErrorUtils.handleHttpError(error, Alert.instance, () => { });
    } catch (err) {
      // do something
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }

  onSuccessBotHistory(data) {
    const { history } = this.state;
    const { sum_page: sumPage } = data;
    history.sumPage = sumPage;
    this.setState({ history, isLoading: false });
  }

  onChangePage(page) {
    const { history } = this.state;
    if (history.currentPage !== page) {
      history.currentPage = page;
      this.setState(
        { history, isLoading: true },
        () => { this.fetchBotHistory(); },
      );
    }
  }

  handleUpdateBotStatus(botId, isBotOn) {
    if (isBotOn) {
      Alert.instance.showAlertTwoButtons(
        i18n.t('warning'),
        i18n.t('offBotMessage'),
        [i18n.t('cancel'), i18n.t('ok')],
        [
          () => Alert.instance.hideAlert(),
          () => this.props.listBotAction.updateBotStatus(botId, isBotOn ? 0 : 1, isBotOn ? '' : true,
            this.onSuccess, this.onError),
        ],
        Alert.instance.hideAlert(),
      );
    } else {
      this.setState({
        isShowPopupOnBot: true,
      });
    }
  }

  handleUpdateBotName(botId, name) {
    const { listBotAction } = this.props;
    this.setState({ isLoading: true });
    listBotAction.updateBotName(botId, name, this.onSuccessChangeBotName, this.onError);
  }

  handleUpdateBotCampaign(botId, idCampaign) {
    const { listBotAction } = this.props;
    this.setState({ isLoading: true });
    listBotAction.updateBotCampaign(botId, idCampaign, this.onSuccess, this.onError);
  }

  handleDeleteBot(botId) {
    const { listBotAction } = this.props;
    this.setState({ isLoading: true });
    const params = {
      botId,
    };
    listBotAction.deleteBot(params, this.onSuccessDeleteBot, this.onError);
  }

  openViewMode() {
    this.setState({
      showGameScene: true,
    });
  }

  closeViewMode() {
    this.setState({
      showGameScene: false,
    });
  }

  fetchBotHistory() {
    const { listBotAction, botId } = this.props;
    const {
      startDate,
      endDate,
      history,
    } = this.state;
    const params = {
      botId,
      startDate,
      endDate,
      currentPage: history.currentPage,
      perPage: history.perPage,
    };
    listBotAction.fetchBotHistory(params, this.onSuccessBotHistory, this.onError);
  }

  fetchUser() {
    this.props.actions.fetchUser(
      userData => ApiErrorUtils.handleServerError(
        userData, Alert.instance, () => { }, this.onError,
      ),
      err => ApiErrorUtils.handleHttpError(err, Alert.instance, () => { }),
    );
  }

  renderGameScene() {
    const { bot, listBotAction } = this.props;
    const isOffBot = bot && bot.status === BOT_STATUSES.OFF;
    return (
      <ModalWrapper
        id="modal-view-mode"
        isOpen={this.state.showGameScene}
        toggle={() => { }}
        centered
        width={window.innerWidth * 0.8}
        isOffBot={isOffBot}
      >
        <ModalHeaderCustom isOffBot={isOffBot} toggle={this.closeViewMode}>
          {
            isOffBot ? i18n.t('checkHistory') : i18n.t('viewMode')
          }
        </ModalHeaderCustom>
        <GameScene
          closeViewMode={this.closeViewMode}
          goDashBoard={() => this.props.handleChangeTab(TAB.DASHBOARD)}
          botInfo={this.props.bot}
          fetchBotHistoryNow={listBotAction.fetchBotHistoryNow}
          fetchBotGCNow={listBotAction.fetchBotGCNow}
          fetchTableStatusNow={listBotAction.fetchTableStatusNow}
          listBotAction={this.props.listBotAction}
          ref={this.gameSceneRef}
          width={window.innerWidth * 0.8}
          updateNameTable={listBotAction.updateNameTable}
        />
      </ModalWrapper>
    );
  }

  renderChartRevenue() {
    const {
      revenueHistory, labels,
      isMobile, fontSize,
      bot,
    } = this.props;
    const { chartUpdateTime } = this.state;
    const display = isMobile ? '' : 'flex';
    const widthChart = isMobile ? '' : '50%';
    const heightChart = isMobile ? 250 : 100;
    const timeZoneFull = moment().format('Z');
    const timeZone = timeZoneFull[1] === '0'
      ? timeZoneFull[0] + timeZoneFull[2]
      : timeZoneFull[0] + timeZoneFull[1] + timeZoneFull[2];
    return (
      <div>
        <WrapperTimeUpdate>
          <div>
            <SpanRed marginTop={1} size={0.8}>{i18n.t('lastTimeUpdated')}</SpanRed>
            <SpanRed marginLeft={1} size={0.8}>
              <span>{i18n.t('UTC')}</span>
              <span>: {dayjs(chartUpdateTime || bot.updated_at).format(FORMAT_DATE_TIME)}</span>
            </SpanRed>
            <SpanRed marginLeft={1} size={0.8}>
              <span>{i18n.t('utcCurrent', { timeZone })}</span> <span>: {convertToLocalTime(chartUpdateTime || bot.updated_at)}</span>
            </SpanRed>
          </div>
        </WrapperTimeUpdate>
        <ContentArea bgrColor="#e9e9e9" display={display}>
          <ChartRevenueHistory
            revenueHistory={revenueHistory}
            labels={labels}
            width={widthChart}
            height={heightChart}
            title={i18n.t('incomeChart')}
            fontSize={fontSize}
          />
          {/* <ChartRevenueCampaign
          revenueHistory={revenueHistory}
          labels={labels}
          width={widthChart}
          height={heightChart}
        /> */}
        </ContentArea>
      </div>
    );
  }

  renderHistory() {
    const { historyData } = this.props;
    const { currentPage, sumPage, perPage } = this.state.history;
    return (
      <ContentArea>
        <History
          data={historyData.data}
        />
        {
          (sumPage > 1) ? (
            <Pagination
              type="autoBot"
              current={currentPage}
              total={sumPage * perPage}
              onChange={this.onChangePage}
              pageSize={perPage}
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            />
          ) : ''
        }
      </ContentArea>
    );
  }

  render() {
    const { isLoading, isShowPopupOnBot } = this.state;
    const {
      fontSize, isMobile, fetchListBots,
      actions, sortBy, currentPage,
      listCampaigns, bot, lucUserGC,
      listBotAction, listTable,
    } = this.props;
    return (
      <Wrapper fontSize={fontSize} id="BotDetail">
        <BotDetailInfo
          lucUserGC={lucUserGC}
          bot={this.props.bot}
          listTable={listTable}
          openViewMode={this.openViewMode}
          updateBotStatus={this.handleUpdateBotStatus}
          updateBotName={this.handleUpdateBotName}
          updateBotCampaign={this.handleUpdateBotCampaign}
          handleDeleteBot={this.handleDeleteBot}
          payout={actions.payout}
          fetchListCampaigns={actions.fetchListCampaigns}
          listCampaigns={listCampaigns}
          gift={actions.gift}
          handleChangeTab={tab => this.props.handleChangeTab(tab)}
          fontSize={fontSize}
          isMobile={isMobile}
          fetchListBots={fetchListBots}
          fetchBotDetail={listBotAction.fetchBotDetail}
          sortBy={sortBy}
          currentPage={currentPage}
          fetchUser={this.fetchUser}
          ref={this.botDetailInfoRef}
        />
        {this.renderChartRevenue()}
        {this.renderHistory()}
        {this.renderGameScene()}
        <Spinner isLoading={isLoading} />
        {
          isShowPopupOnBot && (
            <PopupOnBot
              bot={bot}
              listTable={listTable}
              fetchListTable={actions.fetchListTable}
              onClose={() => { this.setState({ isShowPopupOnBot: false }); }}
              updateBotCampaign={listBotAction.updateBotCampaign}
              listCampaigns={listCampaigns}
              lucUserGC={lucUserGC}
              isMobile={isMobile}
              fetchUser={actions.fetchUser}
              fetchBotDetail={listBotAction.fetchBotDetail}
              fetchListBots={() => {
                this.props.fetchListBots(() => { }, () => { }, {
                  sortBy: this.props.sortBy,
                  currentPage: this.props.currentPage,
                  perPage: PER_PAGE,
                });
              }}
              updateBotStatus={listBotAction.updateBotStatus}
            />
          )
        }
      </Wrapper>
    );
  }
}

BotDetail.defaultProps = {
  revenueHistory: [],
  labels: [],
  handleChangeTab: () => { },
  historyData: {},
  listTable: [],
};

BotDetail.propTypes = {
  bot: PropTypes.object.isRequired,
  listTable: PropTypes.array,
  actions: PropTypes.object.isRequired,
  revenueHistory: PropTypes.array,
  labels: PropTypes.array,
  handleChangeTab: PropTypes.func,
  lucUserGC: PropTypes.number.isRequired,
  historyData: PropTypes.object,
  fetchListBots: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  currentPage: PropTypes.number.isRequired,
  botId: PropTypes.number.isRequired,
  listBotAction: PropTypes.objectOf(PropTypes.any).isRequired,
  fontSize: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
  listCampaigns: PropTypes.any.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default BotDetail;
