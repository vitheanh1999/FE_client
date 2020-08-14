import React from 'react';
import PropTypes from 'prop-types';
import MainTable from './gameElement/MainTable';
import LayoutResult from './gameResult/LayoutResult';
import GameMenu from './GameMenu';
import LayoutVideo from './gameElement/LayoutVideo';
import LayoutWoodPlane from './LayoutWoodPlane';
import {
  MAX_LOOK_TURN, dataDefaultBet,
} from './logicCore/bettingConst';
import * as reBet from './logicCore/reBet';
import * as limitBet from './logicCore/limitBet';
import SuperGameScene, { cancelPusher } from './SuperGameScene';
import * as tableChipCategory from './logicCore/tableChipCategory';
import {
  Wrapper, BackgroundBetting,
} from './styles/gameSceneStyles';
import { removeTimeout } from './logicCore/utils';
import StorageUtils, { STORAGE_KEYS } from '../../helpers/StorageUtils';
import { TableStatus } from '../../constants/Constants';
import images from '../../../assets/lucImage';
import i18n from '../../i18n/i18n';

const getCurrentTableName = botInfo => {
  const listGroupChangeTable = StorageUtils.getItemObject(STORAGE_KEYS.listGroupBotChangeTable);
  let nameOfTable = '';
  if (botInfo.group_id === null || botInfo.group_id === undefined) {
    nameOfTable = botInfo.table_name;
  } else {
    nameOfTable = botInfo && listGroupChangeTable &&
      (
        Object.keys(listGroupChangeTable).includes(botInfo.group_id.toString())
          ? listGroupChangeTable[botInfo.group_id] : botInfo.table_name
      );
  }
  return nameOfTable || 'C001';
}

class GameScene extends SuperGameScene {
  constructor(props) {
    super(props);
    this.state = {
      totalBet: { ...dataDefaultBet },
      confirmBetData: dataDefaultBet,
      statusBetText: 'No more bet',
      startDeal: false,
      choseCoin: 0,
      enableBtnOk: false, // true enable Bet
      turnId: -1,
      nameTable: getCurrentTableName(this.props.botInfo),
      timeTurn: 45, // default
      dataResult: null,
      lookCount: MAX_LOOK_TURN,
      preBetData: reBet.preBetDataDefault,
      limitData: {},
      timeBeforeMaintain: 0,
      tableId: -1,
      botIsBetting: true,
      tableStatus: {},
    };
    this.listCardRef = React.createRef();
    this.layoutVideoRef = React.createRef();
    this.woodPlaneRef = React.createRef();
    this.mainTableRef = React.createRef();
    this.changeTable = this.changeTable.bind(this);
    this.onSuccessFetchTableStatus = this.onSuccessFetchTableStatus.bind(this);
    this.onErrorFetchTableStatus = this.onErrorFetchTableStatus.bind(this);
    this.updateIsBetting = this.updateIsBetting.bind(this);
  }

  componentDidMount() {
    const info = {
      active: 1,
      banker_player_limit: '{"min":100,"max":100000}',
      created_at: '2019-05-29 12:23:04',
      deleted_at: null,
      id: 131,
      is_pause: 0,
      level: 2,
      list_chip: [
        {
          icon: 'https://luc888-api-public-resource.s3.ap-southeast-1.amazonaws.com/images/1564585836gc.png',
          id: 1,
          name: 'General GC',
          selected: true,
        }],
      name: 'C001',
      pair_limit: '{"min":10,"max":5000}',
      shuffled_at: '2019-08-14 01:48:55',
      shuffling: 1,
      status: 1,
      sub_name: null,
      tie_limit: '{"min":10,"max":5000}',
      time: 25,
      type: {
        active: 1,
        b_pair: 11,
        banker: 0.95,
        gc_rage_max: 100000,
        gc_rage_min: 100,
        id: 1,
        name: i18n.t('basic'),
        p_pair: 11,
        player: 1,
        tie: 8,
      },
      updated_at: '2019-08-14 02:34:31',
    };
    const limitData = limitBet.getLimitData(info);
    limitData.tableType = (info && info.type && info.type.name) || '';
    this.setState({
      timeTurn: info.time,
      tableId: info.id,
      tableChipTypes: tableChipCategory.initTableChipTypes(info.list_chip),
      limitData,
    }, () => {
      const { botInfo } = this.props;
      if (botInfo.status) {
        this.registerEvenPush(this.state.nameTable, this.socketConnection);
      }
    });
    this.refreshPredictTimeOut();
    this.props.fetchTableStatusNow(this.props.botInfo.id, this.onSuccessFetchTableStatus, this.onErrorFetchTableStatus)
  }

  componentWillUnmount() {
    const { nameTable } = this.state;
    cancelPusher(nameTable, this.socketConnection);
  }

  onSuccessFetchTableStatus(data) {
    const { botIsBetting } = this.state;
    this.setState({ tableStatus: data.data });
    if (data.data.table_is_pause
      || data.data.table_shuffling
      || data.data.table_status === TableStatus.Waiting
      || data.data.table_status === TableStatus.Off
      || (botIsBetting === false)) {
      this.woodPlaneRef.current.showNotiWaitBet();
    } else {
      this.woodPlaneRef.current.hiddenNotiWaitBet();
    }
  }

  onErrorFetchTableStatus(error) {
    console.log(error);
  }

  registerEventPauseTable(socket, nameTb) {
    const nameTablePaused = 'channel-pause';
    const pauseTable = socket.subscribe(nameTablePaused);
    pauseTable.bind('pause-table', (event) => {
      if (event.table === nameTb) {
        this.woodPlaneRef.current.showNotiWaitBet();
        if (event.isPause) {
          this.layoutVideoRef.current.pauseTableToUpdateLobby();
          const { tableStatus } = this.state;
          tableStatus.table_is_pause = true;
          this.setState({ tableStatus })
        } else {
          this.layoutVideoRef.current.resumeTable();
          const { tableStatus } = this.state;
          tableStatus.table_is_pause = false;
          this.setState({ tableStatus })
          this.props.fetchTableStatusNow(this.props.botInfo.id, this.onSuccessFetchTableStatus, this.onErrorFetchTableStatus);
        }
      }
    });
  }

  registerOperatorStopPush(socket, nameTb) {
    const nameChannelTable = 'channel-table';
    const startChannelTable = socket.subscribe(nameChannelTable);
    startChannelTable.bind('table', (event) => {
      if (event.table.table === nameTb) {
        if (!event.table.status) {
          this.woodPlaneRef.current.showNotiWaitBet();
        } else {
          this.props.fetchTableStatusNow(this.props.botInfo.id, this.onSuccessFetchTableStatus, this.onErrorFetchTableStatus);
        }
        const { tableStatus } = this.state;
        tableStatus.table_status = event.table.status;
        this.setState({ tableStatus });
      }
    });
  }

  registerUpdatedHistory(socket) {
    const historyUpdatedChannel = `lambda`;
    const resultUpdatedHistory = socket.subscribe(historyUpdatedChannel);
    resultUpdatedHistory.bind('history-betting', (e) => {
      const { historyRef } = this.mainTableRef.current;
      historyRef.current.updateHistory();
    });
  }

  registerOpenCardPush(socket, nameTb, bettingActions, userRole) {
    const { historyRef } = this.mainTableRef.current;
    const nameResult = `channel-point-${nameTb}`;
    const resultTurn = socket.subscribe(nameResult);
    resultTurn.bind(`point-${nameTb}`, (event) => {
      if (event.point.table === nameTb) {
        const {
          turnId, // tableId
        } = this.state;
        
        const { preBetData } = this.state;
        if (turnId > 0) {
          this.woodPlaneRef.current.updateDataLobby(event.point);
          this.setState({
            dataResult: event.point,
            preBetData: reBet.checkResetPreBetData(turnId, preBetData),
          }, () => {
            this.timeOutResult = setTimeout(() => {
              this.closeResult();
            }, 4000);
          });
        }
        this.props.fetchTableStatusNow(this.props.botInfo.id, this.onSuccessFetchTableStatus, this.onErrorFetchTableStatus)
      }
    });
  }

  registerChangeTable(socket) {
    const { botInfo, updateNameTable } = this.props;
    const nameResult = 'change-table';
    socket.unsubscribe('change-table')
    const resultTurn = socket.subscribe(nameResult);
    resultTurn.bind('change-table', (event) => {
      const { data } = event;
      let dataPusher = data;
      if (Array.isArray(dataPusher)) {
        dataPusher = Object.assign({}, dataPusher);
      }
      StorageUtils.setItemObject(STORAGE_KEYS.listGroupBotChangeTable, dataPusher);
      if (botInfo && Object.keys(dataPusher).includes((botInfo.group_id.toString()))) {
        cancelPusher(this.state.nameTable, this.socketConnection);
        updateNameTable(dataPusher);
        this.setState({
          nameTable: dataPusher[botInfo.group_id],
          startDeal: false,
          confirmBetData: dataDefaultBet,
          totalBet: dataDefaultBet,
          enableBtnOk: false,
          statusBetText: 'noMoreBet',
          lookCount: MAX_LOOK_TURN,
          dataResult: null, // close animation show result
        }, () => {
          this.registerEvenPush(dataPusher[botInfo.group_id], this.socketConnection);
          this.layoutVideoRef.current.resumeTable();
        });
        this.timeOutResult = removeTimeout(this.timeOutResult);
      }
    });
  }

  registerShuffling(nameTb, socket) {
    const shuffleChannelName = `channel-shuffle-${nameTb}`;
    const resultShuffle = socket.subscribe(shuffleChannelName);
    resultShuffle.bind(`shuffle-${nameTb}`, (event) => {
      if (event.table === nameTb) {
        this.woodPlaneRef.current.showNotiWaitBet();
        this.woodPlaneRef.current.shuffling();
        const { tableStatus } = this.state;
        tableStatus.table_shuffling = true;
        this.setState({ tableStatus });
      }
    });
  }

  registerEvenPush(nameTb, socket) {
    const { bettingActions } = this.props;
    const userRole = 'Player';

    this.registerNewTurnPush(socket, nameTb);
    this.registerUpdatedHistory(socket);
    this.registerEventPauseTable(socket, nameTb);
    this.registerOpenCardPush(socket, nameTb, bettingActions, userRole);
    this.registerShuffling(nameTb, socket);
    this.registerChangeTable(socket);
    this.registerOperatorStopPush(socket, nameTb);
  }

  openCard() {
    this.listCardRef.current.addCardToOpen();
  }

  updateIsBetting(isBetting) {
    const { tableStatus } = this.state;
    this.setState({ botIsBetting: isBetting })

    if (Object.keys(tableStatus).length === 0) {
      if (isBetting === false) {
        this.woodPlaneRef.current.showNotiWaitBet();
      }
      return;
    }

    if (tableStatus.table_is_pause || tableStatus.table_shuffling || !tableStatus.table_status || (isBetting === false)) {
      this.woodPlaneRef.current.showNotiWaitBet();
    } else {
      this.woodPlaneRef.current.hiddenNotiWaitBet();
    }
  }

  changeTable(tableData) {
    const { nameTable } = this.state;
    if (nameTable === tableData.name) {
      return;
    }
    cancelPusher(nameTable, this.socketConnection);
    this.setState({
      startDeal: false,
      nameTable: tableData.name,
      confirmBetData: dataDefaultBet,
      totalBet: dataDefaultBet,
      enableBtnOk: false,
      statusBetText: 'noMoreBet',
      lookCount: MAX_LOOK_TURN,
      dataResult: null, // close animation show result
    }, () => {
      this.registerEvenPush(tableData.name, this.socketConnection);
    });

    this.timeOutResult = removeTimeout(this.timeOutResult);
  }

  renderFullViewMode() {
    const ratioWH = 1.6319;
    const { closeViewMode, goDashBoard, botInfo, listBotAction, width } = this.props;
    const height = width / ratioWH;
    const { totalBet, nameTable, dataResult, tableStatus } = this.state;
    const viewResult = (dataResult && dataResult.turnId > 0)
      ? (
        <LayoutResult
          data={dataResult}
          closeResult={() => this.closeResult()}
          chipCategory={null}
          scale={width / 1060}
        />
      ) : null;
    return (
      <React.Fragment>
        <BackgroundBetting width={width} height={height} images={images.BackgroundSprite} />
        <GameMenu
          isDeal
          nameTable={botInfo.table_name_display}
          tableId={-1}
          clickHall={() => this.goToHall()}
          choseTable={tableData => this.changeTable(tableData)}
          clickLogout={() => closeViewMode()}
          id="GameMenu"
          getAlertRef={() => this.getAlertRef()}
          clickSetting={() => this.gotoSetting()}
          ref={this.menuRef}
          scale={width / 1060}
        />
        <LayoutVideo
          ref={this.layoutVideoRef}
          nameTable={nameTable}
          getAlertRef={null}
          width={width}
          height={height}
          closeViewMode={() => closeViewMode()}
          tableStatus={tableStatus}
        />
        <LayoutWoodPlane
          ref={this.woodPlaneRef}
          enable
          placeYourBet="statusBetText"
          clickOK={() => {
          }}
          clickClean={() => { }}
          undoBet={() => { }}
          nameTable={nameTable}
          dataUpdate={null}
          startDeal
          history={null}
          goDashBoard={goDashBoard}
          getAlertRef={null}
          id="GameLobbyBoard"
          resetLookCount={() => this.resetLookCount()}
          enableLookButton
          menuRef={this.menuRef}
          width={width}
          height={width * 0.19717}
          listBotAction={listBotAction}
          botInfo={botInfo}
        />
        <MainTable
          ref={this.mainTableRef}
          totalBet={totalBet}
          confirmBetData={{}}
          userInfo={null}
          timeOut={() => { }}
          isDeal
          placeBet={0}
          betting={(result) => { }}
          timeTurn={35}
          id="MainTable"
          maintenanceInfo={null}
          turnId={-1}
          limitData={null}
          eventData={null}
          tableChipTypes={null}
          handleChangeSelectChip={this.handleChangeSelectChip}
          width={width}
          botInfo={botInfo}
          fetchBotHistoryNow={this.props.fetchBotHistoryNow}
          fetchBotGCNow={this.props.fetchBotGCNow}
          changeTable={this.changeTable}
          nameTable={nameTable}
          updateIsBetting={this.updateIsBetting}
        />
        {
          viewResult
        }
      </React.Fragment>
    )
  }

  renderHistoryOnly() {
    const ratioWH = 1.6319;
    const { botInfo, width } = this.props;
    const height = width / ratioWH;
    const { totalBet, nameTable } = this.state;
    return (
      <React.Fragment>
        <BackgroundBetting
          isOnBot={botInfo.status}
          width={width}
          height={height}
        />
        <MainTable
          ref={this.mainTableRef}
          totalBet={totalBet}
          confirmBetData={{}}
          userInfo={null}
          timeOut={() => { }}
          isDeal
          placeBet={0}
          betting={(result) => { }}
          timeTurn={35}
          id="MainTable"
          maintenanceInfo={null}
          turnId={-1}
          limitData={null}
          eventData={null}
          tableChipTypes={null}
          handleChangeSelectChip={this.handleChangeSelectChip}
          width={width}
          botInfo={botInfo}
          fetchBotHistoryNow={this.props.fetchBotHistoryNow}
          fetchBotGCNow={this.props.fetchBotGCNow}
          changeTable={this.changeTable}
          nameTable={nameTable}
        />
      </React.Fragment>
    )
  }

  render() {
    const ratioWH = 1.6319;
    const { botInfo, width } = this.props;
    const height = width / ratioWH;
    return (
      <Wrapper
        isOnBot={botInfo.status}
        width={width}
        height={height}
        id="GameCanvas"
      >
        {botInfo.status ? this.renderFullViewMode() : this.renderHistoryOnly()}
      </Wrapper>
    );
  }
}

GameScene.propTypes = {
  closeViewMode: PropTypes.func.isRequired,
  goDashBoard: PropTypes.func.isRequired,
  botInfo: PropTypes.objectOf(PropTypes.any),
  fetchBotHistoryNow: PropTypes.func.isRequired,
  listBotAction: PropTypes.objectOf(PropTypes.any).isRequired,
  fetchBotGCNow: PropTypes.func.isRequired,
  fetchTableStatusNow: PropTypes.func.isRequired,
  width: PropTypes.number,
  updateNameTable: PropTypes.func.isRequired,
};

GameScene.defaultProps = {
  botInfo: null,
  width: window.innerWidth * 0.8,
};

export default GameScene;
