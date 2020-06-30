import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import Alert from '../common/Alert/Alert';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import { LineChartOptions, ChartArea } from '../dashboard/Main';
import {
  JapaneseDiv, DropdownArea, TitleChart,
  ModalWrapper, ModalHeaderCustom,
} from './BotDetailStyle';
import {
  TAB, getMinDate, FORMAT_DATE, NUMBER_GC_FOR_BOT, BOT_STATUSES,
} from '../../constants/Constants';
import GameScene from '../viewScreenGame/GameScene';
import i18n from '../../i18n/i18n';
import Dropdown from '../common/Dropdown/Dropdown';
import Spinner from '../common/Spinner';
import {
  WrapperMobile, ContentAreaMobile, Chart,
  GcAreaMobile, NoticeMobile, PayoutButtonMobile, Background,
} from './BotDetailStyleMobile';
import HistoryMobile from '../common/HistoryMobile';
import BotDetailInfoMobile from './BotDetailInfoMobile';

export const DEPOSIT_STATUS = {
  DEPOSITED: 1,
  CAN_DEPOSIT: 0,
  WAITING: 2,
};

class BotDetailMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endDate: moment().format(FORMAT_DATE),
      startDate: (getMinDate() < moment().add(-9, 'd').format(FORMAT_DATE))
        ? moment().add(-9, 'd').format(FORMAT_DATE)
        : getMinDate(),
      showGameScene: false,
      isOpenning: false,
      isLoading: false,
      optionPayoutValue: -1,
    };

    this.handleGift = this.handleGift.bind(this);
    this.onError = this.onError.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onSuccessPayOut = this.onSuccessPayOut.bind(this);
    this.onSuccessGift = this.onSuccessGift.bind(this);
    this.closeViewMode = this.closeViewMode.bind(this);
    this.onClose = this.onClose.bind(this);
    this.changeOptionPayout = this.changeOptionPayout.bind(this);
    this.onClickPayout = this.onClickPayout.bind(this);
    this.gameSceneRef = React.createRef();
    this.onResize = this.onResize.bind(this);
    this.openViewMode = this.openViewMode.bind(this);
    this.handleUpdateBotStatus = this.handleUpdateBotStatus.bind(this);
    window.addEventListener('resize', this.onResize);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const { botId } = this.props;
    const { endDate, startDate } = this.state;
    this.props.fetchBotDetail(botId, (data) => {
      if (data.data.GC > NUMBER_GC_FOR_BOT) {
        this.setState({ optionPayoutValue: -1 });
      } else {
        this.setState({ optionPayoutValue: 1 });
      }
    }, () => {
    });
    this.props.fetchBotHistory(botId, startDate, endDate, () => { }, this.onError);
    this.props.fetchChartData(botId, startDate, endDate, () => {
      this.setState({ isLoading: false });
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
    const { botId } = this.props;
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      Alert.instance.showAlert(i18n.t('success'), data.message);
      this.props.fetchBotDetail(botId, (dataBot) => {
        if (dataBot.data.GC > NUMBER_GC_FOR_BOT) {
          this.setState({ optionPayoutValue: -1 });
        } else {
          this.setState({ optionPayoutValue: 1 });
        }
      }, () => { });
      this.props.fetchListBots(this.props.sortBy, () => { }, () => { });
      this.props.fetchUser(
        userData => ApiErrorUtils.handleServerError(
          userData, Alert.instance, () => { }, this.onError,
        ),
        err => ApiErrorUtils.handleHttpError(err, Alert.instance, () => { }),
      );
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

  onSuccessPayOut(data) {
    this.setState({ isLoading: false });
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => {
        this.props.fetchListBots(this.props.sortBy, () => { }, this.onError);
        Alert.instance.hideAlert();
        this.props.fetchBotDetail(this.props.botId, (dataBot) => {
          if (dataBot.data.GC > NUMBER_GC_FOR_BOT) {
            this.setState({ optionPayoutValue: -1 });
          } else {
            this.setState({ optionPayoutValue: 1 });
          }
        }, this.onError);
        Alert.instance.showAlert(i18n.t('success'), data.message);
      },
    );
  }

  onSuccessGift(data) {
    const { botId } = this.props;
    this.setState({ isLoading: false });
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => {
        this.props.fetchListBots(this.props.sortBy, () => { }, this.onError);
        Alert.instance.hideAlert();
        this.setState({ isLoading: false });
        this.props.fetchBotDetail(botId, (dataBot) => {
          if (dataBot.data.GC > NUMBER_GC_FOR_BOT) {
            this.setState({ optionPayoutValue: -1 });
          } else {
            this.setState({ optionPayoutValue: 1 });
          }
        }, this.onError);
        Alert.instance.showAlert(i18n.t('success'), data.message);
      },
    );
  }

  onClickPayout() {
    const { botId } = this.props;
    const { optionPayoutValue } = this.state;
    this.handleConfirmPayout(botId, optionPayoutValue);
  }

  onClose() {
    this.setState({ isOpenning: false });
  }

  changeOptionPayout(optionId, option) {
    this.setState({
      optionPayoutValue: option.value,
    });
  }

  handleUpdateBotStatus(botId, isBotOn) {
    const { userInfo } = this.props;
    if (userInfo.detail && userInfo.detail.luc_user_id) {
      Alert.instance.showAlertTwoButtons(
        i18n.t('warning'),
        // `Do you want to ${isBotOn ? 'off' : 'on'} this bot?`,
        isBotOn ? i18n.t('offBotMessage') : i18n.t('onBotMessage'),
        [i18n.t('cancel'), i18n.t('ok')],
        [
          () => Alert.instance.hideAlert(),
          () => {
            Alert.instance.hideAlert();
            this.setState({ isLoading: true });
            this.props.updateBotStatus(botId, isBotOn ? 0 : 1, this.onSuccess, this.onError);
          },
        ],
        Alert.instance.hideAlert(),
      );
    } else {
      Alert.instance.showAlert(
        i18n.t('warning'),
        i18n.t('askToConnectToNormalAcc'),
        i18n.t('ok'),
        () => {
          Alert.instance.hideAlert();
          // this.props.handleChangeTab(TAB.CONNECT_TO_LUC);
        },
        Alert.instance.hideAlert(),
      );
    }
  }

  handleConfirmPayout(botId, optionPayoutValue) {
    const { userInfo, payout } = this.props;
    if (userInfo.detail.luc_user_id) {
      Alert.instance.showAlertTwoButtons(
        i18n.t('warning'),
        i18n.t('askPayout'),
        [i18n.t('cancel'), i18n.t('ok')],
        [
          () => Alert.instance.hideAlert(),
          () => {
            Alert.instance.hideAlert();
            this.setState({ isLoading: true });
            payout(botId, optionPayoutValue, this.onSuccessPayOut, this.onError);
          },
        ],
        Alert.instance.hideAlert(),
      );
    } else {
      Alert.instance.showAlert(
        i18n.t('warning'),
        i18n.t('askToConnectToNormalAcc'),
        i18n.t('OK'),
        () => {
          Alert.instance.hideAlert();
          // this.props.handleChangeTab(TAB.CONNECT_TO_LUC);
        },
        Alert.instance.hideAlert(),
      );
    }
  }

  handlePayOut() {
    const { botId } = this.props;
    const { optionPayoutValue } = this.state;
    this.props.payout(botId, optionPayoutValue, this.onSuccessPayOut, this.onError);
  }

  handleGift(botId) {
    Alert.instance.showAlertTwoButtons(
      i18n.t('warning'),
      i18n.t('giftMessage'),
      [i18n.t('cancel'), i18n.t('OK')],
      [
        () => Alert.instance.hideAlert(),
        () => {
          Alert.instance.hideAlert();
          this.gift([botId]);
        },
      ],
    );
  }

  gift(listBotIds) {
    this.setState({ isLoading: true });
    this.props.gift(listBotIds, this.onSuccessGift, this.onError);
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


  renderGameScene() {
    const { bot } = this.props;
    return (
      <ModalWrapper
        id="modal-view-mode"
        isOpen={this.state.showGameScene}
        toggle={() => { }}
        centered
        width={window.innerWidth * 0.8}
      >
        <ModalHeaderCustom toggle={this.closeViewMode}>
          {
            bot && bot.status === BOT_STATUSES.OFF ? i18n.t('checkHistory') : i18n.t('viewMode')
          }
        </ModalHeaderCustom>
        <GameScene
          closeViewMode={this.closeViewMode}
          goDashBoard={() => this.props.handleChangeTab(TAB.DASHBOARD)}
          botInfo={this.props.bot}
          fetchBotHistoryNow={this.props.fetchBotHistoryNow}
          fetchBotGCNow={this.props.fetchBotGCNow}
          fetchTableStatusNow={this.props.fetchTableStatusNow}
          listBotAction={this.props.listBotAction}
          ref={this.gameSceneRef}
          width={window.innerWidth * 0.8}
        />
      </ModalWrapper>
    );
  }

  renderTitleChart() {
    const { bot } = this.props;
    const tz = new Date().getTimezoneOffset();
    let options = [];
    if (bot.GC > NUMBER_GC_FOR_BOT) {
      options = [
        {
          id: -1,
          text: 'デポジット分のGCを残す',
          value: -1,
        },
        {
          id: 1,
          text: '全てのGC',
          value: 1,
        },
      ];
    } else {
      options = [
        {
          id: -1,
          text: '全てのGC',
          value: 1,
        },
      ];
    }
    return (
      <JapaneseDiv>
        <GcAreaMobile isRed={bot.GC < 0}>
          GC: <span>{bot.GC && bot.GC.toLocaleString('ja')}</span>
        </GcAreaMobile>
        <TitleChart>
          <DropdownArea>
            <Dropdown
              data={options}
              width={14}
              onChangeSelected={this.changeOptionPayout}
              customStyle={{ fontSize: '0.7em' }}
            />
            <PayoutButtonMobile
              isActive={bot.GC > 0 && !bot.status}
              onClick={(bot.GC > 0 && !bot.status) ? this.onClickPayout : () => { }}
            >
              {i18n.t('payout')}
            </PayoutButtonMobile>

          </DropdownArea>
        </TitleChart>
        <NoticeMobile>
          {i18n.t('sendGCToNormalAcc')}
        </NoticeMobile>
        <span
          style={{
            color: 'red',
            fontSize: '0.6em',
            marginTop: '1em',
          }}
        >
          *{i18n.t('lastTimeUpdated')}:
          {moment(this.props.lastestUpdateAt).add(-tz, 'm').format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </JapaneseDiv>
    );
  }

  renderRevenue() {
    const { revenueHistory, labels } = this.props;
    return (
      <Chart>
        {this.renderTitleChart()}
        <ChartArea>
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: 'GC',
                  borderColor: revenueHistory && revenueHistory[revenueHistory.length - 1] >= 0 ? '#2fa2e9' : 'red',
                  backgroundColor: 'transparent',
                  pointBackgroundColor: revenueHistory && revenueHistory[revenueHistory.length - 1] >= 0 ? '#2fa2e9' : 'red',
                  data: revenueHistory,
                },
              ],
            }}
            options={LineChartOptions}
          />
        </ChartArea>
      </Chart>
    );
  }

  render() {
    return (
      <Background>
        <WrapperMobile id="BotDetailMobile">
          <BotDetailInfoMobile
            bot={this.props.bot}
            openViewMode={this.openViewMode}
            updateBotStatus={this.handleUpdateBotStatus}
            gift={this.handleGift}
            handleChangeTab={tab => this.props.handleChangeTab(tab)}
            userInfor={this.props.userInfo}
            onCloseBotDetail={this.props.onCloseBotDetail}
          />
          <ContentAreaMobile>
            {this.renderRevenue()}
          </ContentAreaMobile>
          <ContentAreaMobile>
            <HistoryMobile
              data={this.props.historyData}
            />
          </ContentAreaMobile>
          {this.renderGameScene()}
          <Spinner isLoading={this.state.isLoading} />
        </WrapperMobile>
      </Background>
    );
  }
}

BotDetailMobile.propTypes = {
  bot: PropTypes.object.isRequired,
  revenueHistory: PropTypes.array,
  labels: PropTypes.array,
  handleChangeTab: PropTypes.func,
  userInfo: PropTypes.object.isRequired,
  updateBotStatus: PropTypes.func.isRequired,
  fetchBotHistory: PropTypes.func.isRequired,
  historyData: PropTypes.arrayOf(PropTypes.any).isRequired,
  fetchChartData: PropTypes.func.isRequired,

  depositData: PropTypes.object.isRequired,
  requestPaying: PropTypes.func.isRequired,
  getPriceBTC: PropTypes.func.isRequired,
  getPriceUSD: PropTypes.func.isRequired,
  fetchPaymentInfo: PropTypes.func.isRequired,
  fetchListBots: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  fetchUser: PropTypes.func.isRequired,

  fetchTableStatusNow: PropTypes.func.isRequired,
  fetchBotGCNow: PropTypes.func.isRequired,
  fetchBotHistoryNow: PropTypes.func.isRequired,
  fetchBotDetail: PropTypes.func.isRequired,
  botId: PropTypes.number.isRequired,
  lastestUpdateAt: PropTypes.string,

  listBotAction: PropTypes.objectOf(PropTypes.any).isRequired,
  gift: PropTypes.func.isRequired,
  payout: PropTypes.func.isRequired,
  onCloseBotDetail: PropTypes.func.isRequired,
};

BotDetailMobile.defaultProps = {
  revenueHistory: [],
  lastestUpdateAt: '',
  labels: [],
  handleChangeTab: () => { },
};

export default BotDetailMobile;
