import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  MAX_LOOK_TURN, dataDefaultBet, TIME_EXIT_TABLE, FREEZE_MESS_BET,
} from './logicCore/bettingConst';
import { removeTimeout } from './logicCore/utils';
import GameTable from './gameTable/GameTable';
import Utils, { socketConnection } from './Utils';
import * as tableChipCategory from './logicCore/tableChipCategory';
import * as bettingChip from './logicCore/bettingChip';
import ApiErrorCode from '../../constants/apiErrorCode';

export const cancelPusher = (nameTable, socket) => {
  socket.unsubscribe(`channel-turn-${nameTable}`);
  socket.unsubscribe(`channel-point-${nameTable}`);
  socket.unsubscribe(`channel-shuffle-${nameTable}`);
  socket.unsubscribe(`channel-terminate-${nameTable}`);
  socket.unsubscribe('channel-table');
  socket.unsubscribe('channel-system-status');
  socket.unsubscribe('channel-maintenance');
  socket.unsubscribe('channel-pause');
  socket.unsubscribe('channel-news');
  socket.unsubscribe('channel-reload-board')
  // socket.unsubscribe('channel-bot-change-table');
  socket.unsubscribe('lambda');
};

export const registerEventPauseTable = (socket, nameTb, alert, callback) => {
  const nameTablePaused = 'channel-pause';
  const pauseTable = socket.subscribe(nameTablePaused);
  pauseTable.bind('pause-table', (event) => {
    if (event.table === nameTb) {
      if (event.isPause) {
        callback(alert);
      } else {
        alert.hide();
      }
    }
  });
};

export const onError = () => { };

class SuperGameScene extends Component {
  constructor(props) {
    super(props);
    this.socketConnection = socketConnection;

    this.selectCoinRef = React.createRef();
    this.menuRef = React.createRef();
    this.onSuccess = this.onSuccess.bind(this);
    this.onErrorBetting = this.onErrorBetting.bind(this);
    this.onError = this.onError.bind(this);
    this.checkMaintenanceSuccess = this.checkMaintenanceSuccess.bind(this);
    this.refAlert = null;
    this.getAlertRef = this.getAlertRef.bind(this);
    this.saveCurrentState = this.saveCurrentState.bind(this);
    this.updateUserCoins = this.updateUserCoins.bind(this);
    this.gotoSetting = this.gotoSetting.bind(this);
    this.checkGoEventRanking = this.checkGoEventRanking.bind(this);
  }

  onSuccess(data) {
  }

  onError(error) {
  }

  onErrorBetting(error) {
    const { response, data } = error;
    try {
      const alert = this.getAlertRef();
      let message = (
        response && (response.message || (response.data && response.data.message))
      ) ? (response.message || (response.data && response.data.message)) : 'connectionTimeOut';
      if (data && data.code === ApiErrorCode.MAINTENANCE) {
        message = 'maintenance';
      }
      if (response && response.status === ApiErrorCode.NOT_FOUND) {
        message = 'notFound';
      }
      if (error.message && error.message === 'Network Error') {
        message = 'networkError';
      }
      alert.showAlertBetting('error', message, () => {
        if (response && response.status === ApiErrorCode.NOT_FOUND) window.history.back();
      });
    } catch (err) {
      // do something
    }
  }

  getAlertRef() {
    return this.refAlert;
  }

  gotoLogin() {
    const route = '/';
    const { history } = this.props;
    history.replace(route);
  }

  goToHall() {
    const { confirmBetData } = this.state;
    if (bettingChip.totalChipBetting(confirmBetData.totalBet)) {
      Utils.showPopupTimeCount(
        this.getAlertRef(),
        () => this.handleHall(),
        i18n.t('warning'),
        'betting.goToTopWarning',
        TIME_EXIT_TABLE,
        'betting.goToTopConfirm',
      );
    } else {
      this.handleHall();
    }
  }

  checkGoEventRanking() {
    const { confirmBetData } = this.state;
    if (bettingChip.totalChipBetting(confirmBetData.totalBet)) {
      Utils.showPopupTimeCount(
        this.getAlertRef(),
        () => this.goEventRanking(),
        i18n.t('warning'),
        'betting.goToTopWarning',
        TIME_EXIT_TABLE,
        'betting.goToTopConfirm',
      );
    } else {
      this.goEventRanking();
    }
  }

  gotoSetting() {
    const { confirmBetData } = this.state;
    const { history } = this.props;

    if (bettingChip.totalChipBetting(confirmBetData.totalBet)) {
      Utils.showPopupTimeCount(
        this.getAlertRef(),
        () => history.replace('/my-page'),
        i18n.t('warning'),
        'betting.goToTopWarning',
        TIME_EXIT_TABLE,
        'betting.goToSettingConfirm',
      );
    } else {
      history.replace('/my-page');
    }
  }

  handleHall() {
    const { nameTable } = this.state;
    const { history } = this.props;
    cancelPusher(nameTable, this.socketConnection);
    history.replace('/top');
  }

  goEventRanking() {
    const { nameTable } = this.state;
    const { history } = this.props;
    cancelPusher(nameTable, this.socketConnection);
    history.replace('/event-ranking');
  }

  saveCurrentState() {
  }

  updateUserCoins() {
    const { bettingActions } = this.props;
    const nameOfTable = 'Undefine';
    // request api userInfo
    const { turnId } = this.state;
    bettingActions.requestUser(turnId, nameOfTable, () => { }, this.onError); // update in Redux
  }

  callBackRequestUserInfo(data, turnId) {
    const { tableChipTypes } = this.state;

    const isSuccess = this.onSuccess(data);
    if (!isSuccess) return;
    const { turn_win: turnWin, transactions } = data;
    if (data.event) {
      this.setState({
        eventData: {
          ...data.event,
          goEventRanking: this.checkGoEventRanking,
        },
      });
    }

    if (
      transactions
      && turnWin !== null
      && turnWin !== undefined
    ) {
      const { dataResult } = this.state;

      if (dataResult) {
        dataResult.winMoneys = [];
        for (let i = 0; i < tableChipTypes.length; i += 1) {
          let value = 0;
          for (let j = 0; j < transactions.length; j += 1) {
            if (transactions[j].chip_category_id === tableChipTypes[i].id) {
              value += transactions[j].value;
            }
          }
          if (value !== 0) {
            dataResult.winMoneys.push({
              id: tableChipTypes[i].id,
              value,
            });
          }
        }
        dataResult.turnWin = turnWin;
      }

      this.setState({ dataResult });
      this.woodPlaneRef.current.getWrappedInstance().checkShuffling();
      if (this.layoutVideoRef.current.bettingHistoryRef.current) {
        this.layoutVideoRef.current.bettingHistoryRef.current.updateListHistory(data);
      }
      this.mainTableRef.current.gameTableRef.current.clearAllChip(turnId);
    }
  }

  logOut() {
    const { confirmBetData } = this.state;
    if (confirmBetData.totalBet != null
      && bettingChip.totalChipBetting(confirmBetData.totalBet) > 0) {
      Utils.showPopupTimeCount(
        this.getAlertRef(),
        () => this.handleLogout(),
        'logout',
        'logout.confirmCountTime',
        TIME_EXIT_TABLE,
        'logout.confirm',
      );
    } else {
      Utils.showPopupConfirm(
        this.getAlertRef(),
        () => this.handleLogout(),
        'logout',
        'logout.confirm',
      );
    }
  }

  handleLogout() {
    const { nameTable } = this.state;
    cancelPusher(nameTable, this.socketConnection);
    const { logoutAction } = this.props;
    logoutAction(() => {
      this.gotoLogin();
    }, () => {
      this.gotoLogin();
    });
  }

  resetAlertSate() {
    this.getAlertRef().hide();
  }

  resetLookCount() {
    this.setState({ lookCount: MAX_LOOK_TURN });
    let message = 'viewMore';
    message = message.replace('(param1)', `${MAX_LOOK_TURN - 1}`);
    this.woodPlaneRef.current.getWrappedInstance().showToast(message, 3000);
  }

  checkBettingCoin(result) {
    let canBet = false;
    const { confirmBetData } = this.state;
    const { userInfo } = this.props;
    const oldBet = (confirmBetData && confirmBetData.totalBet) ? confirmBetData.totalBet : {};
    const delta = tableChipCategory.getDeltaBet(result.totalBet, oldBet);
    if (tableChipCategory.checkEnough(userInfo.total, delta)) {
      this.setState({
        totalBet: result,
        enableBtnOk: true,
      });
      canBet = true;
    }
    return canBet;
  }

  reBet() {
    const { preBetData } = this.state;
    const canBet = this.checkBettingCoin(preBetData);
    if (canBet) {
      GameTable.instance.addReBetChip(preBetData);
    }
  }

  closeResult() {
    removeTimeout(this.timeOutResult);
    this.setState({ dataResult: null });
    if(this.mainTableRef.current) {
      this.mainTableRef.current.historyRef.current.fetchBotGCNow();
      // this.mainTableRef.current.historyRef.current.updateHistory();
    }
    this.timeOutResult = null;
  }

  refreshPredictTimeOut() {
  }

  analyzeResultTurn(dataResult) {
  }

  registerOperatorStopPush(socket, nameTb, alert) {
    const nameChannelTable = 'channel-table';
    const startChannelTable = socket.subscribe(nameChannelTable);
    startChannelTable.bind('table', (event) => {
      if (!event.table.status && event.table.table === nameTb) {
        alert.show(
          i18n.t('warning'),
          'unStableSignal',
          () => this.handleHall(),
          null, null, null,
          () => this.handleHall(),
        );
      }
    });
  }

  checkMaintenanceSuccess(maintenanceData) {
    const { onCheckMaintenanceSuccess } = this.props;
    const { data } = maintenanceData;
    onCheckMaintenanceSuccess(data);
  }

  registerNewTurnPush(socket, nameTb) {
    const nameTurn = `channel-turn-${nameTb}`;
    const startTurn = socket.subscribe(nameTurn);
    startTurn.bind(`turn-${nameTb}`, (event) => {
      if (event.turn.table_name === nameTb) {
        const TurnID = event.turn && event.turn.turn_id;
        if (TurnID >= 0) {
          this.setState({
            startDeal: true,
            confirmBetData: {},
            turnId: TurnID,
            totalBet: dataDefaultBet,
            statusBetText: 'placeYourBet',
          });
          this.woodPlaneRef.current.closeToast(FREEZE_MESS_BET);
        } else {
          this.setState({
            startDeal: false,
            confirmBetData: {},
            turnId: TurnID,
            totalBet: dataDefaultBet,
            statusBetText: i18n.t('noMoreBet'),
          });
          this.woodPlaneRef.current.getWrappedInstance().showToast(
            'freezeBetting',
            100000000000000,
            FREEZE_MESS_BET,
          );
        }
      }
    });
  }

  registerMaintainPush(socket, onCheckMaintenance, onUpdateMaintenanceShow) {
    const nameChannelSystemStatus = 'channel-system-status';
    const startChannelSystemStatus = socket.subscribe(nameChannelSystemStatus);
    startChannelSystemStatus.bind('system-status', (event) => {
      if (!event.systemStatus.status) {
        window.location.href = '/maintenance';
      }
    });
    onCheckMaintenance(this.checkMaintenanceSuccess, onError);

    const nameChannelMaintenance = 'channel-maintenance';
    const startChannelMaintenance = socket.subscribe(nameChannelMaintenance);
    startChannelMaintenance.bind('maintenance', event => onUpdateMaintenanceShow(event.maintenance));
  }


  registerHasNews(socket) {
    const { onUpdateHasNews } = this.props;
    const nameChannelNews = 'channel-news';
    const startChannelNews = socket.subscribe(nameChannelNews);
    startChannelNews.bind('create-news', () => onUpdateHasNews(true));
  }

  render() {
    return (<div />);
  }
}

SuperGameScene.propTypes = {
  bettingActions: PropTypes.objectOf(PropTypes.func).isRequired,
  logoutAction: PropTypes.func.isRequired,
  userInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  onCheckMaintenanceSuccess: PropTypes.func.isRequired,
  onUpdateHasNews: PropTypes.func.isRequired,
};

export default SuperGameScene;
