import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import images from '../../../../assets/lucImage';
import BetRectangle from './BetRectangle';
import AnimationChip, { ConfirmChipStatus } from './AnimationChip';
import TableBetLabel from './TableBetLabel';
import { BET_TYPE, CLEAR_ALL_CHIP } from '../constBetting/gameTable';
import { CHIP_VALUES } from '../logicCore/animationHelp';
import * as tableChipCategory from '../logicCore/tableChipCategory';
import * as bettingChip from '../logicCore/bettingChip';

export const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: ${props => props.scale * 321}px;
  display: flex;
  flex-direction: row;
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  width: ${props => props.scale * 502}px;
  z-index: 2;
  overflow: visible;
`;

const Blank100 = styled.div`
  height: ${props => props.scale * 114}px;
`;

const ContainerTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: ${props => props.scale * 85}px;
`;

export const ContainerTable = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  user-select: none;
`;

const ContainerCenter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: ${props => props.scale * 120}px;
`;

export const multiplyObjectWithInt = (objInput, intParams) => {
  const result = { ...objInput };
  const keys = Object.keys(result);
  for (let i = 0; i < keys.length; i += 1) {
    result[keys[i]] *= intParams;
  }
  return result;
};

export const autoGenChip = (money) => {
  const chipValue = [...CHIP_VALUES];
  let sumCoin = money;
  const listChip = [];
  let i = chipValue.length - 1;
  let numberChip = 0;
  while (true) {
    if (i === -1 || numberChip > 30) break;
    if (sumCoin >= chipValue[i]) {
      listChip.push({
        value: chipValue[i],
        isConfirmed: true,
      });
      sumCoin -= chipValue[i];
      numberChip += 1;
    } else {
      i -= 1;
    }
  }

  return listChip;
};

const showAlertOutRange = () => {
};

export default class GameTable extends Component {
  constructor(props) {
    super(props);
    this.bankerPairRef = React.createRef();
    this.playerPairRef = React.createRef();
    this.bankerWinRef = React.createRef();
    this.playerWinRef = React.createRef();
    this.tieRef = React.createRef();
    this.animationChipRef = React.createRef();
    GameTable.instance = this;
    this.timeOutReceiveChip = null;
    this.waitReceiveChip = false;
    this.lockBet = false;
    this.timeOutLock = null;
  }

  componentWillMount() {
  }

  componentWillUnmount() {
    GameTable.instance = null;
    if (this.timeOutReceiveChip) {
      clearTimeout(this.timeOutReceiveChip);
      this.timeOutReceiveChip = null;
    }

    if (this.timeOutLock) {
      clearTimeout(this.timeOutLock);
      this.timeOutLock = null;
    }
  }

  onClickBet(refArea) {
    const {
      choseCoin, totalBet, finishBet, enableBet, turnId, userInfo, confirmBetData,
    } = this.props;
    const userTotalMoney = userInfo.total;
    if (choseCoin <= 0 || enableBet === false) return;
    if (this.waitReceiveChip === true) return;
    if (this.lockBet === true) return;
    const dataBet = { ...totalBet };
    let type;
    const canBetChipTypesNotLimit = this.getChipTypesByLimit(refArea);
    const canAddChipTypes = tableChipCategory.getChipCanAdd(dataBet.totalBet,
      canBetChipTypesNotLimit, choseCoin, userTotalMoney, confirmBetData.totalBet);
    if (canAddChipTypes.length === 0) {
      return;
    }
    dataBet.totalBet = tableChipCategory.addCoinToBetData(dataBet.totalBet,
      canAddChipTypes, choseCoin);
    dataBet.reset = false;

    switch (refArea) {
      case this.bankerPairRef:
        type = BET_TYPE.bankerPair;
        dataBet.betBankerPair = tableChipCategory.addCoinToBetData(dataBet.betBankerPair,
          canAddChipTypes, choseCoin);
        break;
      case this.playerPairRef:
        type = BET_TYPE.playerPair;
        dataBet.betPlayerPair = tableChipCategory.addCoinToBetData(dataBet.betPlayerPair,
          canAddChipTypes, choseCoin);
        break;
      case this.tieRef:
        type = BET_TYPE.tie;
        dataBet.betTie = tableChipCategory.addCoinToBetData(dataBet.betTie,
          canAddChipTypes, choseCoin);
        break;
      case this.bankerWinRef:
        type = BET_TYPE.bankerWin;
        dataBet.betBanker = tableChipCategory.addCoinToBetData(dataBet.betBanker,
          canAddChipTypes, choseCoin);
        break;
      case this.playerWinRef:
        type = BET_TYPE.playerWin;
        dataBet.betPlayer = tableChipCategory.addCoinToBetData(dataBet.betPlayer,
          canAddChipTypes, choseCoin);
        break;
      default:
    }
    if (this.checkBetRangeOut(dataBet, refArea) === true) return;
    const checkBothBet = tableChipCategory.checkBothBet(dataBet.betPlayer, dataBet.betBanker);
    if (checkBothBet) {
      return;
    }
    const checkEnough = this.checkCoinEnough(dataBet.totalBet);
    if (checkEnough === true) {
      for (let i = 0; i < canAddChipTypes.length; i += 1) {
        const pos = refArea.current.getPositionNewChip(choseCoin, turnId);
        this.animationChipRef.current.addChip(pos.x, pos.y, type, choseCoin,
          turnId, canAddChipTypes[i]);
      }
    } else {
      return;
    }
    finishBet(dataBet);
  }

  getChipTypesByLimit(refArea) {
    const result = [];
    const {
      choseCoin, totalBet, tableChipTypes, limitData,
    } = this.props;
    const dataBet = { ...totalBet };
    let betAreaData = null;
    let max = -1;
    switch (refArea) {
      case this.bankerPairRef:
        max = limitData.pairMax;
        betAreaData = dataBet.betBankerPair;
        break;
      case this.playerPairRef:
        max = limitData.pairMax;
        betAreaData = dataBet.betPlayerPair;
        break;
      case this.tieRef:
        max = limitData.tieMax;
        betAreaData = dataBet.betTie;
        break;
      case this.bankerWinRef:
        max = limitData.baseMax;
        betAreaData = dataBet.betBanker;
        break;
      case this.playerWinRef:
        max = limitData.baseMax;
        betAreaData = dataBet.betPlayer;
        break;
      default:
        return result;
    }
    for (let i = 0; i < tableChipTypes.length; i += 1) {
      if (tableChipTypes[i].selected) {
        const currentBet = betAreaData[tableChipTypes[i].id] || 0;
        if ((currentBet + choseCoin) <= max) {
          result.push({ ...tableChipTypes[i] });
        }
      }
    }

    return result;
  }

  setChipWaitingConfirm() {
    this.animationChipRef.current.setChipWaitingConfirm();
    this.bankerPairRef.current.setChipWaitingConfirm();
    this.playerPairRef.current.setChipWaitingConfirm();
    this.bankerWinRef.current.setChipWaitingConfirm();
    this.playerWinRef.current.setChipWaitingConfirm();
    this.tieRef.current.setChipWaitingConfirm();
  }

  checkBetRangeOut(dataBet, refArea) {
    const { limitData } = this.props;
    switch (refArea) {
      case this.bankerPairRef:
        if (tableChipCategory.checkOutOfRange(dataBet.betBankerPair, limitData.pairMax)) {
          showAlertOutRange('BANKER_PAIR', limitData.pairMin, limitData.pairMax);
          return true;
        }
        break;
      case this.playerPairRef:
        if (tableChipCategory.checkOutOfRange(dataBet.betPlayerPair, limitData.pairMax)) {
          showAlertOutRange('PLAYER_PAIR', limitData.pairMin, limitData.pairMax);
          return true;
        }
        break;
      case this.tieRef:
        if (tableChipCategory.checkOutOfRange(dataBet.betTie, limitData.tieMax)) {
          showAlertOutRange('TIE', limitData.tieMin, limitData.tieMax);
          return true;
        }
        break;
      case this.bankerWinRef:
        if (tableChipCategory.checkOutOfRange(dataBet.betBanker, limitData.baseMax)) {
          showAlertOutRange('BANKER', limitData.baseMin, limitData.baseMax);
          return true;
        }
        break;
      case this.playerWinRef:
        if (tableChipCategory.checkOutOfRange(dataBet.betPlayer, limitData.baseMax)) {
          showAlertOutRange('PLAYER', limitData.baseMin, limitData.baseMax);
          return true;
        }
        break;
      default:
        return false;
    }
    return false;
  }

  cancelChipWaitingConfirm(startDeal) {
    this.animationChipRef.current.cancelChipWaitingConfirm(startDeal);
    this.bankerPairRef.current.cancelChipWaitingConfirm(startDeal);
    this.playerPairRef.current.cancelChipWaitingConfirm(startDeal);
    this.bankerWinRef.current.cancelChipWaitingConfirm(startDeal);
    this.playerWinRef.current.cancelChipWaitingConfirm(startDeal);
    this.tieRef.current.cancelChipWaitingConfirm();
  }

  lockTable(timeLock = 300) {
    this.lockBet = true;
    this.timeOutLock = setTimeout(() => {
      this.lockBet = false;
      this.timeOutLock = null;
    }, timeLock);
  }

  checkCoinEnough(totalBet) {
    const { userInfo, confirmBetData } = this.props;
    const oldBet = (confirmBetData && confirmBetData.totalBet) ? confirmBetData.totalBet : {};
    const delta = tableChipCategory.getDeltaBet(totalBet, oldBet);
    return tableChipCategory.checkEnough(userInfo.total, delta);
  }

  confirmAllChip() {
    const countChipNotConfirm = this.animationChipRef.current.confirmAllChip();
    this.bankerPairRef.current.confirmAllChip();
    this.playerPairRef.current.confirmAllChip();
    this.bankerWinRef.current.confirmAllChip();
    this.playerWinRef.current.confirmAllChip();
    this.tieRef.current.confirmAllChip();
    return countChipNotConfirm;
  }

  clearAllChip(turnId = CLEAR_ALL_CHIP) {
    this.animationChipRef.current.clearAllChip(turnId);
    this.bankerPairRef.current.clearAllChip(turnId);
    this.playerPairRef.current.clearAllChip(turnId);
    this.bankerWinRef.current.clearAllChip(turnId);
    this.playerWinRef.current.clearAllChip(turnId);
    this.tieRef.current.clearAllChip(turnId);
    this.timeOutReceiveChip = setTimeout(() => {
      this.waitReceiveChip = false;
      this.timeOutReceiveChip = null;
    }, 100);
  }

  addWinChipToArea(moneyWin, refArea, type, turnId) {
    const keys = Object.keys(moneyWin);
    for (let i = 0; i < keys.length; i += 1) {
      const value = moneyWin[keys[i]];
      if (value > 0) {
        this.autoGenWinChip(value, refArea, type, turnId, keys[i]);
      }
    }
  }

  addPlayerChipToArea(moneyWin, refArea, type, turnId,
    confirmStatus = ConfirmChipStatus.notConfirm) {
    let sum = 0;
    const keys = Object.keys(moneyWin);
    for (let i = 0; i < keys.length; i += 1) {
      const value = moneyWin[keys[i]];
      sum += value;
      if (confirmStatus !== ConfirmChipStatus.confirmed) {
        this.autoGenPlayerChip(value, refArea, type, turnId, keys[i], confirmStatus);
      }
    }
    if (sum > 0 && confirmStatus === ConfirmChipStatus.confirmed) {
      this.autoGenPlayerChip(sum, refArea, type, turnId, keys[0], confirmStatus);
    }
  }

  clearAllChipExcept(arrTypeWin) {
    this.animationChipRef.current.clearAllChipExcept(arrTypeWin);
    this.addWinChip(arrTypeWin);
  }

  addReBetChip(preBetData) {
    const { turnId } = this.props;
    this.addPlayerChipToArea(preBetData.betBankerPair, this.bankerPairRef, BET_TYPE.bankerPair,
      turnId);
    this.addPlayerChipToArea(preBetData.betBanker, this.bankerWinRef, BET_TYPE.bankerWin, turnId);
    this.addPlayerChipToArea(preBetData.betPlayerPair, this.playerPairRef, BET_TYPE.playerPair,
      turnId);
    this.addPlayerChipToArea(preBetData.betPlayer, this.playerWinRef, BET_TYPE.playerWin, turnId);
    this.addPlayerChipToArea(preBetData.betTie, this.tieRef, BET_TYPE.tie, turnId);
  }

  restoreBetChipConfirmed(betData) {
    if (!betData) return;
    const { turnId } = this.props;
    const confirm = ConfirmChipStatus.confirmed;
    this.addPlayerChipToArea((betData.betBankerPair || {}), this.bankerPairRef, BET_TYPE.bankerPair,
      turnId, confirm);
    this.addPlayerChipToArea((betData.betBanker || {}), this.bankerWinRef, BET_TYPE.bankerWin,
      turnId, confirm);
    this.addPlayerChipToArea((betData.betPlayerPair || {}), this.playerPairRef, BET_TYPE.playerPair,
      turnId, confirm);
    this.addPlayerChipToArea((betData.betPlayer || {}), this.playerWinRef, BET_TYPE.playerWin,
      turnId, confirm);
    this.addPlayerChipToArea((betData.betTie || {}), this.tieRef, BET_TYPE.tie, turnId, confirm);
  }

  restoreBetChipNotConfirmed(betConfirmData, totalBetData) {
    if (!totalBetData) return;
    const { turnId } = this.props;
    const confirm = ConfirmChipStatus.notConfirm;
    this.addPlayerChipToArea(tableChipCategory.subBetAreaData(totalBetData.betBankerPair,
      betConfirmData.betBankerPair), this.bankerPairRef, BET_TYPE.bankerPair,
    turnId, confirm);

    this.addPlayerChipToArea(tableChipCategory.subBetAreaData(totalBetData.betBanker,
      betConfirmData.betBanker), this.bankerWinRef, BET_TYPE.bankerWin,
    turnId, confirm);

    this.addPlayerChipToArea(tableChipCategory.subBetAreaData(totalBetData.betPlayerPair,
      betConfirmData.betPlayerPair), this.playerPairRef, BET_TYPE.playerPair,
    turnId, confirm);

    this.addPlayerChipToArea(tableChipCategory.subBetAreaData(totalBetData.betPlayer,
      betConfirmData.betPlayer), this.playerWinRef, BET_TYPE.playerWin, turnId, confirm);

    this.addPlayerChipToArea(tableChipCategory.subBetAreaData(totalBetData.betTie,
      betConfirmData.betTie), this.tieRef, BET_TYPE.tie, turnId, confirm);
  }

  addWinChip(arrTypeWin, turnId) {
    const { totalBet } = this.props;
    this.waitReceiveChip = true;
    const arrTypeWin2 = [...arrTypeWin];
    for (let i = 0; i < arrTypeWin.length; i += 1) {
      switch (arrTypeWin[i]) {
        case BET_TYPE.bankerPair:
          this.addWinChipToArea(
            multiplyObjectWithInt(totalBet.betBankerPair, 11),
            this.bankerPairRef,
            arrTypeWin[i],
            turnId,
          );
          break;
        case BET_TYPE.bankerWin:
          this.addWinChipToArea(
            multiplyObjectWithInt(totalBet.betBanker, 0.95),
            this.bankerWinRef,
            arrTypeWin[i],
            turnId,
          );
          break;
        case BET_TYPE.playerPair:
          this.addWinChipToArea(
            multiplyObjectWithInt(totalBet.betPlayerPair, 11),
            this.playerPairRef,
            arrTypeWin[i],
            turnId,
          );
          break;
        case BET_TYPE.playerWin:
          this.addWinChipToArea(
            multiplyObjectWithInt(totalBet.betPlayer, 1),
            this.playerWinRef,
            arrTypeWin[i],
            turnId,
          );
          break;
        case BET_TYPE.tie:
          this.addWinChipToArea(
            multiplyObjectWithInt(totalBet.betTie, 8),
            this.tieRef,
            arrTypeWin[i],
            turnId,
          );
          // when result = tie, return coin in playerWin and bankerWin
          arrTypeWin2.push(BET_TYPE.playerWin);
          arrTypeWin2.push(BET_TYPE.bankerWin);
          break;
        default:
          break;
      }
    }

    this.animationChipRef.current.delayReceiveChip(arrTypeWin2);
  }

  autoGenWinChip(money, refArea, type, turnId, chipType) {
    const listChip = autoGenChip(money);
    const { length } = listChip;
    for (let i = length - 1; i >= 0; i -= 1) {
      const pos = refArea.current.getPositionNewChip(listChip[i].value, turnId);
      this.animationChipRef.current.addWinChip(pos.x,
        pos.y, type, listChip[i].value, turnId, chipType);
    }
  }

  autoGenPlayerChip(money, refArea, type, turnId, chipType, confirmStatus) {
    const listChip = autoGenChip(money);
    const { length } = listChip;
    for (let i = length - 1; i >= 0; i -= 1) {
      const pos = refArea.current.getPositionNewChip(listChip[i].value, turnId);
      this.animationChipRef.current.addChipOneTurn(pos.x, pos.y, type,
        listChip[i].value, turnId, chipType, confirmStatus);
    }
  }

  clearNotConfirmChip() {
    this.animationChipRef.current.clearNotConfirmChip();
    this.bankerPairRef.current.clearNotConfirmChip();
    this.playerPairRef.current.clearNotConfirmChip();
    this.bankerWinRef.current.clearNotConfirmChip();
    this.playerWinRef.current.clearNotConfirmChip();
    this.tieRef.current.clearNotConfirmChip();
  }

  undoBetting() {
    const lsRemove = this.animationChipRef.current.clearChipUndo();
    for (let i = 0; i < lsRemove.length; i += 1) {
      switch (lsRemove[i].type) {
        case BET_TYPE.bankerPair:
          this.bankerPairRef.current.removeChipInList(lsRemove[i].value);
          break;
        case BET_TYPE.bankerWin:
          this.bankerWinRef.current.removeChipInList(lsRemove[i].value);
          break;
        case BET_TYPE.playerPair:
          this.playerPairRef.current.removeChipInList(lsRemove[i].value);
          break;
        case BET_TYPE.playerWin:
          this.playerWinRef.current.removeChipInList(lsRemove[i].value);
          break;
        case BET_TYPE.tie:
          this.tieRef.current.removeChipInList(lsRemove[i].value);
          break;
        default:
          break;
      }
    }

    return lsRemove;
  }

  mergeChipByType() {
    const allChips = this.animationChipRef.current.mergeChipByType();
    this.playerWinRef.current.updateListChipMerge(allChips.playerWinChips);
    this.playerPairRef.current.updateListChipMerge(allChips.playerPairChips);
    this.bankerWinRef.current.updateListChipMerge(allChips.bankerWinChips);
    this.bankerPairRef.current.updateListChipMerge(allChips.bankerPairChips);
    this.tieRef.current.updateListChipMerge(allChips.tieChips);
  }

  render() {
    const { totalBet, tableChipTypes, scale } = this.props;
    return (
      <Wrapper id="GameTable" scale={scale}>
        <Container scale={scale} />
        <ContainerTable scale={scale}>
          <Blank100 scale={scale} />
          <ContainerTop scale={scale}>
            <BetRectangle
              width={174 * scale}
              height={78 * scale}
              margin={2 * scale}
              imageBG={totalBet.betPlayerPair ? images.playerPairOn : images.playerPair}
              numberCoin={bettingChip.totalChipBetting(totalBet.betPlayerPair)}
              ref={this.playerPairRef}
              onClick={() => this.onClickBet(this.playerPairRef)}
              numberColumn={2}
            />
            <BetRectangle
              width={174 * scale}
              height={77 * scale}
              imageBG={totalBet.betTie ? images.tieOn : images.tieImage}
              numberCoin={bettingChip.totalChipBetting(totalBet.betTie)}
              ref={this.tieRef}
              onClick={() => this.onClickBet(this.tieRef)}
              numberColumn={2}
            />
            <BetRectangle
              width={174 * scale}
              height={77 * scale}
              margin={2 * scale}
              imageBG={totalBet.betBankerPair ? images.bankerPairOn : images.bankerPair}
              numberCoin={bettingChip.totalChipBetting(totalBet.betBankerPair)}
              ref={this.bankerPairRef}
              onClick={() => this.onClickBet(this.bankerPairRef)}
              numberColumn={2}
            />
          </ContainerTop>
          <ContainerCenter scale={scale}>
            <BetRectangle
              width={260 * scale}
              height={114 * scale}
              imageBG={totalBet.betPlayer ? images.playerOn : images.playerWin}
              numberCoin={bettingChip.totalChipBetting(totalBet.betPlayer)}
              ref={this.playerWinRef}
              onClick={() => this.onClickBet(this.playerWinRef)}
              margin={3 * scale}
              numberColumn={3}
            />
            <BetRectangle
              width={260 * scale}
              height={114 * scale}
              imageBG={totalBet.betBanker ? images.bankerOn : images.bankerWin}
              numberCoin={bettingChip.totalChipBetting(totalBet.betBanker)}
              ref={this.bankerWinRef}
              onClick={() => this.onClickBet(this.bankerWinRef)}
              margin={3 * scale}
              numberColumn={3}
            />
          </ContainerCenter>
          <AnimationChip ref={this.animationChipRef} />
          <TableBetLabel totalBet={totalBet} tableChipTypes={tableChipTypes} scale={scale} />
        </ContainerTable>
      </Wrapper>
    );
  }
}

GameTable.propTypes = {
  choseCoin: PropTypes.number.isRequired,
  totalBet: PropTypes.objectOf(PropTypes.any).isRequired,
  confirmBetData: PropTypes.objectOf(PropTypes.any).isRequired,
  userInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  finishBet: PropTypes.func.isRequired,
  enableBet: PropTypes.bool.isRequired,
  turnId: PropTypes.number.isRequired,
  limitData: PropTypes.objectOf(PropTypes.any).isRequired,
  tableChipTypes: PropTypes.arrayOf(PropTypes.any).isRequired,
  scale: PropTypes.number,
};

GameTable.defaultProps = {
  scale: 1,
};
