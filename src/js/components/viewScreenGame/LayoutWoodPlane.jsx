import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { connect } from 'react-redux';
import images from '../../../assets/lucImage';
import SummaryCount from './gameCommon/SummaryCount';
import LobbyBoard from './gameCommon/lobbyBoard';
import Toast from '../common/Toast/Toast';
import { socketConnection } from './Utils';
// import StorageUtils, { STORAGE_KEYS } from '../../helpers/StorageUtils';

const WoodPlane = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: ${props => props.height}px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  top: ${props => 325 * props.width / 1060}px;
`;
const Background = styled.img`
  width: 100%;
  height: ${props => props.height}px;
  position: absolute;
  user-select: none;
`;
const WrapperLobby = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: ${props => props.width * 0.18381}px;
  left: 0;
  right: 0;
  margin-right: auto;
  top: ${props => props.width / 1060 * 132}px;
`;

const getSummary = (lobbyData) => {
  const summary = {
    summary: 0,
    banker: 0,
    player: 0,
    tie: 0,
    p_pair: 0,
    b_pair: 0,
  };

  if (!lobbyData) return summary;
  const { length } = lobbyData;
  for (let i = 0; i < length; i += 1) {
    const item = lobbyData[i];
    summary.summary += 1;
    summary.banker += item.banker;
    summary.player += item.player;
    summary.tie += item.tie;
    summary.p_pair += item.p_pair;
    summary.b_pair += item.b_pair;
  }
  return summary;
};

class LayoutWoodPlane extends Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.updateDataLobby = this.updateDataLobby.bind(this);
    const lobbyList = [
      // {
      //   id: 60330, p_pair: 0, b_pair: 0, tie: 1, banker: 0, player: 0, miss_turn: 0,
      // },
      // {
      //   id: 60331, p_pair: 0, b_pair: 0, tie: 1, banker: 0, player: 0, miss_turn: 0,
      // },
    ];
    this.state = {
      shuffling: false,
      lobbyList,
      isWaitBet: false,
      lastRound: null,
    };
    this.toastRef = React.createRef();
    this.lobbyBoardRef = React.createRef();
    this.fakeData = this.fakeData.bind(this);
    this.unFakeData = this.unFakeData.bind(this);
  }

  componentDidMount() {
    this.setState({
      shuffling: false,
    });
    this.registerReloadBoardMissTurn();
    this.updateLobbyBoard(this.props.nameTable);
  }

  updateLobbyBoard(nameTable) {
    if (nameTable && nameTable.length > 0) {
      const { listBotAction } = this.props;
      listBotAction.fetchHistoryTable(nameTable, this.onSuccess, this.onError);
    }
  }

  componentWillUnmount() {
    const socket = socketConnection;
    socket.unsubscribe('channel-reload-board');
  }

  onError(error) {
  }

  onSuccess(data) {
    const { nameTable } = this.props;

    if (data.code === 200) {
      const arrTurn = data.data[nameTable].history;
      const lastRound = data.data[nameTable].last_round;
      this.setState({ lobbyList: arrTurn, lastRound }, () => this.updateFakeResultButton());
    }
  }

  shuffling() {
    this.showStopBetToast();
    this.setState({ lobbyList: [] });
  }

  updateDataLobby(result) {
    const { lobbyList, lastRound } = this.state;
    if (result.round !== lastRound + 1) {
      this.updateLobbyBoard(this.props.nameTable);
    } else {
      const item = {
        id: 0, banker: 0, player: 0, tie: 0, b_pair: 0, p_pair: 0,
      };
      item.id = result.turnId;
      const sub = parseInt(result.banker, 10) - parseInt(result.player, 10);
      if (sub > 0) {
        item.banker = 1;
      } else if (sub === 0) {
        item.tie = 1;
      } else {
        item.player = 1;
      }

      if (result.playerCard.card_2.substring(6) === result.playerCard.card_3.substring(6)) {
        item.p_pair = 1;
      }
      if (result.bankerCard.card_1.substring(6) === result.bankerCard.card_2.substring(6)) {
        item.b_pair = 1;
      }
      if (lobbyList.length >= 1) {
        const lastTurn = lobbyList[lobbyList.length - 1];
        if (result.turnId !== lastTurn.id) {
          this.setState({
            lobbyList: lobbyList.concat(item),
            lastRound: result.round,
          }, () => this.updateFakeResultButton());
        }
      }
      else this.setState({
        lobbyList: lobbyList.concat(item),
        lastRound: result.round,
      }, () => this.updateFakeResultButton());
    }
  }

  registerReloadBoardMissTurn() {
    const socket = socketConnection;
    const { nameTable } = this.props;
    const nameChannel = 'channel-reload-board';
    const startChannel = socket.subscribe(nameChannel);
    startChannel.bind('reload-board', (event) => {
      if (event.data.table === nameTable) {
        const { menuRef } = this.props;
        this.updateLobbyBoard(nameTable);
      }
    });
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { nameTable } = this.props;
    if (nameTable !== newProps.nameTable) {
      this.updateLobbyBoard(newProps.nameTable);
    }
  }

  checkShuffling() {
  }

  showStopBetToast() {
    //this.toastRef.current.showToast('Stop bet', 3000);
  }

  showToast(content, time = 3000, idToast = '') {
    //this.toastRef.current.showToast(content, time, idToast);
  }

  closeToast(idToast = '') {
    //this.toastRef.current.closeToast(idToast);
  }

  checkDoubleData(result) {
    const { lobbyList } = this.props;
    if (!lobbyList) return false;
    if (lobbyList.length < 1) return false;
    const lastItem = lobbyList[lobbyList.length - 1];
    if (lastItem.id === result.turnId) return true;
    return false;
  }

  updateFakeResultButton() {
    this.lobbyBoardRef.current.getFakeData();
  }

  eventShuffling() {
    this.setState({ shuffling: true }, () => {
      this.showStopBetToast();
    });
  }

  showNotiWaitBet() {
    this.setState({
      isWaitBet: true,
    })
  }

  hiddenNotiWaitBet() {
    this.setState({
      isWaitBet: false,
    })
  }

  fakeData(itemFake) {
    const { lobbyList } = this.state;
    lobbyList.push(itemFake);
    this.setState({ lobbyList });
  }

  unFakeData() {
    const FakeId = -9999;
    const { lobbyList } = this.state;
    const result = [];
    const { length } = lobbyList;
    for (let i = 0; i < length; i += 1) {
      if (lobbyList[i].id !== FakeId) {
        result.push(lobbyList[i]);
      }
    }
    this.setState({ lobbyList: result });

  }

  render() {
    const {
      enable, placeYourBet, clickClean, clickOK, nameTable,
      startDeal, resetLookCount, enableLookButton, botInfo,
    } = this.props;
    const { lobbyList, isWaitBet } = this.state;
    const {
      undoBet, width, height, goDashBoard,
    } = this.props;

    const summary = getSummary(lobbyList);
    return (
      <WoodPlane id="WoodPlane" width={width} height={height}>
        <Background src={images.WoodPlaneSprite} width={width} height={height} />
        <SummaryCount
          enable={enable}
          placeYourBet={placeYourBet}
          clickOK={clickOK}
          clickClean={clickClean}
          undoBet={undoBet}
          summary={summary}
          resetLookCount={resetLookCount}
          enableLookButton={enableLookButton}
          scale={width / 1060}
          goDashBoard={goDashBoard}
          botInfo={botInfo}
          isWaitBet={isWaitBet}
        />
        <WrapperLobby width={width * 0.99057}>
          <LobbyBoard
            nameTable={nameTable}
            lobbyList={lobbyList}
            shuffling={false}
            startDeal={startDeal}
            ref={this.lobbyBoardRef}
            scale={width / 1060}
            fakeData={this.fakeData}
            unFakeData={this.unFakeData}
          />
        </WrapperLobby>
      </WoodPlane>
    );
  }
}

LayoutWoodPlane.propTypes = {
  enable: PropTypes.bool.isRequired,
  clickClean: PropTypes.func.isRequired,
  clickOK: PropTypes.func.isRequired,
  undoBet: PropTypes.func.isRequired,
  placeYourBet: PropTypes.string.isRequired,
  startDeal: PropTypes.bool.isRequired,
  resetLookCount: PropTypes.func.isRequired,
  enableLookButton: PropTypes.bool.isRequired,
  menuRef: PropTypes.objectOf(PropTypes.any).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  goDashBoard: PropTypes.func.isRequired,
  listBotAction: PropTypes.objectOf(PropTypes.any).isRequired,
  botInfo: PropTypes.objectOf(PropTypes.any),
  nameTable: PropTypes.string.isRequired,
};

export default LayoutWoodPlane;
