import React, { Component } from 'react';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';
import images from '../../../../assets/lucImage';
import { rotateBoundingRect } from '../help/BettingUtils';
import { CLEAR_ALL_CHIP } from '../constBetting/gameTable';
import * as animationHelp from '../logicCore/animationHelp';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  background-color: rgba(0, 0, 0, 0.4);
`;

export const AnimationState = {
  waiting: 'waiting',
  betting: 'betting',
  payChip: 'payChip',
  returnChip: 'returnChip',
};

const ImgCoin = styled.img`
  pointer-events: none;
  width: 26px;
  height: 20px;
`;

export const getImageChip = (value) => {
  switch (value) {
    case 1:
      return images.coins.coin1;
    case 5:
      return images.coins.coin5;
    case 10:
      return images.coins.coin10;
    case 50:
      return images.coins.coin50;
    case 100:
      return images.coins.coin100;
    case 250:
      return images.coins.coin250;
    case 500:
      return images.coins.coin500;
    case 1000:
      return images.coins.coin1k;
    case 5000:
      return images.coins.coin5k;
    case 10000:
      return images.coins.coin10k;
    case 25000:
      return images.coins.coin25k;
    case 50000:
      return images.coins.coin50k;
    case 100000:
      return images.coins.coin100K;
    case 500000:
      return images.coins.coin500K;
    default:
      return null;
  }
};

export const ConfirmChipStatus = {
  notConfirm: 0,
  waitingConfirm: 0.5,
  confirmed: 1,
};

export default class AnimationChip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listChip: [],
      status: AnimationState.waiting,
      arrTypeWin: [],
    };
    this.rootRef = React.createRef();
    AnimationChip.userChipRef = React.createRef();
    this.timeOutGetChip = null;
    this.timeOutDelay = null;
    this.currentBetTurnIndex = 0;
  }

  componentWillUnmount() {
    if (this.timeOutGetChip) {
      clearTimeout(this.timeOutGetChip);
    }
    if (this.timeOutDelay) {
      clearTimeout(this.timeOutDelay);
    }
  }

  setChipWaitingConfirm() {
    const { listChip } = this.state;
    for (let i = 0; i < listChip.length; i += 1) {
      if (listChip[i].isConfirmed === ConfirmChipStatus.notConfirm) {
        listChip[i].isConfirmed = ConfirmChipStatus.waitingConfirm;
      }
    }
    this.setState({ listChip });
  }

  getUserChipPosition(chipType) {
    const rootElement = AnimationChip.userChipRef.current.querySelector(`#chip-type-${chipType}`);
    let rootPos = null;
    if (rootElement) {
      rootPos = rootElement.getBoundingClientRect();
    } else {
      rootPos = AnimationChip.userChipRef.current.getBoundingClientRect();
    }

    rootPos = rotateBoundingRect(rootPos);
    const scale = window.getScale();
    let Zero = this.rootRef.current.getBoundingClientRect();
    Zero = rotateBoundingRect(Zero);
    return {
      x: (rootPos.left - Zero.left) / scale,
      y: (rootPos.top - Zero.top) / scale,
    };
  }

  getChipBetting(chipInfo, index) {
    return chipInfo.value === 0 ? null : this.creatChip(chipInfo.x, chipInfo.y, index,
      chipInfo.newCreat, chipInfo.isPlayerChip, chipInfo.value, chipInfo.chipType);
  }

  cancelChipWaitingConfirm(startDeal) {
    const { listChip } = this.state;
    for (let i = 0; i < listChip.length; i += 1) {
      if (listChip[i].isConfirmed === ConfirmChipStatus.waitingConfirm) {
        listChip[i].isConfirmed = ConfirmChipStatus.notConfirm;
      }
    }
    this.setState({ listChip }, () => {
      if (startDeal === false) {
        // time out, delete all chip notConfirm
        this.clearNotConfirmChip();
      }
    });
  }

  creatChip(xAxis, yAxis, key, newCreat, isPlayerChip, value, chipType) {
    let startChipPos = {
      x: xAxis,
      y: yAxis - 20,
    };
    if (isPlayerChip === true) startChipPos = this.getUserChipPosition(chipType);
    const targetX = newCreat ? startChipPos.x : xAxis;
    const targetY = newCreat ? startChipPos.y : yAxis;
    return (
      <Motion
        defaultStyle={{ x: startChipPos.x, y: startChipPos.y }}
        style={{ x: spring(targetX), y: spring(targetY) }}
        key={key}
      >
        {({ x, y }) => (
          <div
            style={{
              position: 'absolute',
              top: y,
              left: x,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            <img src={getImageChip(value)} width={26} height={20} alt="" />
          </div>
        )}
      </Motion>
    );
  }

  playerReceiveChip(key, value, chipType) {
    const userChipPos = this.getUserChipPosition(chipType);
    return (
      <Motion
        style={{ x: spring(userChipPos.x), y: spring(userChipPos.y) }}
        key={key}
      >
        {({ x, y }) => (
          <div
            style={{
              position: 'absolute',
              top: y,
              left: x,
              userSelect: 'none',
            }}
          >
            <ImgCoin src={getImageChip(value)} alt="" />
          </div>
        )}
      </Motion>
    );
  }

  addChip(x, y, type, choseCoin, turnID, chipType, confirmStatus = ConfirmChipStatus.notConfirm) {
    this.currentBetTurnIndex += 1;
    this.pushChipToQueue(x, y, type, choseCoin, confirmStatus, turnID, chipType);
  }

  addChipOneTurn(x, y, type, choseCoin, turnID, chipType,
    confirmStatus = ConfirmChipStatus.notConfirm) {
    this.pushChipToQueue(x, y, type, choseCoin, confirmStatus, turnID, chipType);
  }

  pushChipToQueue(x, y, type, choseCoin, confirmStatus, turnID, chipType) {
    const { listChip } = this.state;
    const scale = window.getScale();
    let zero = this.rootRef.current.getBoundingClientRect();
    zero = rotateBoundingRect(zero);
    listChip.push({
      turnID,
      turnIndex: this.currentBetTurnIndex,
      x: (x - zero.left) / scale,
      y: (y - zero.top) / scale,
      newCreat: true,
      isConfirmed: confirmStatus,
      isPlayerChip: true,
      value: choseCoin,
      type,
      chipType,
    });
    this.setState({ listChip, status: AnimationState.betting });
  }

  addWinChip(x, y, type, choseCoin, turnID, chipType) {
    const { listChip } = this.state;
    const scale = window.getScale();
    let zero = this.rootRef.current.getBoundingClientRect();
    zero = rotateBoundingRect(zero);
    listChip.push({
      turnID,
      turnIndex: -1,
      x: (x - zero.left) / scale,
      y: (y - zero.top) / scale,
      newCreat: true,
      isConfirmed: ConfirmChipStatus.notConfirm,
      isPlayerChip: false,
      value: choseCoin,
      type,
      chipType,
    });
    this.setState({ listChip /* , status: AnimationState.betting */ });
  }

  confirmAllChip() {
    const { listChip } = this.state;
    let countChipNotConfirm = 0;
    for (let i = 0; i < listChip.length; i += 1) {
      if (listChip[i].isConfirmed === ConfirmChipStatus.waitingConfirm) {
        listChip[i].isConfirmed = ConfirmChipStatus.confirmed;
      } else if (listChip[i].isConfirmed === ConfirmChipStatus.notConfirm) {
        countChipNotConfirm += 1;
      }
    }
    this.setState({ listChip });
    return countChipNotConfirm;
  }

  clearAllChip(turnID = CLEAR_ALL_CHIP) {
    if (turnID === CLEAR_ALL_CHIP) {
      this.setState({ listChip: [] });
    } else {
      const { listChip } = this.state;
      const lsChipRemove = listChip.filter(chip => chip.turnID > turnID);
      this.setState({ listChip: lsChipRemove });
    }
    this.currentBetTurnIndex = 0;
  }

  clearAllChipExcept(arrTypeWin) {
    const { listChip } = this.state;
    let check = false;
    const { length } = arrTypeWin;
    for (let i = listChip.length - 1; i >= 0; i -= 1) {
      check = false;
      for (let j = 0; j < length; j += 1) {
        listChip[i].newCreat = true;
        if (listChip[i].type === arrTypeWin[j]) {
          check = true;
          break;
        }
      }

      if (check === false) {
        listChip.splice(i, 1);
      }
    }

    this.setState({ listChip });
    if (this.timeOutGetChip) clearTimeout(this.timeOutGetChip);
    this.timeOutGetChip = setTimeout(() => {
      this.setState({ status: AnimationState.returnChip });
      this.timeOutGetChip = null;
    }, 1000);
  }

  delayReceiveChip(arrTypeWin) {
    if (this.timeOutGetChip) clearTimeout(this.timeOutGetChip);
    this.timeOutGetChip = setTimeout(() => {
      this.setState({ status: AnimationState.returnChip, arrTypeWin });
      this.timeOutGetChip = null;
    }, 1000);
  }

  clearNotConfirmChip() {
    const { listChip } = this.state;
    const lsChipRemove = listChip.filter(chip => chip.isConfirmed !== ConfirmChipStatus.notConfirm);
    this.setState({ listChip: lsChipRemove });
  }

  clearChipUndo() {
    const betTurn = this.currentBetTurnIndex;
    const { listChip } = this.state;
    const lsChipRemove = [];
    for (let i = listChip.length - 1; i >= 0; i -= 1) {
      if (listChip[i].isConfirmed === ConfirmChipStatus.notConfirm
        && listChip[i].turnIndex >= betTurn) {
        lsChipRemove.push({ ...listChip[i] });
        listChip.splice(i, 1);
      }
    }
    this.setState({ listChip });
    if (lsChipRemove.length > 0) {
      this.currentBetTurnIndex -= 1;
    }
    return lsChipRemove;
  }

  mergeChipByType() {
    const { listChip } = this.state;
    const lsPlayerWin = [];
    const lsPlayerPair = [];
    const lsBankerWin = [];
    const lsBankerPair = [];
    const lsTie = [];

    const { length } = listChip;
    for (let i = 0; i < length; i += 1) {
      const chip = listChip[i];
      if (listChip[i].value > 0 && listChip[i].isConfirmed) {
        switch (chip.type) {
          case 'playerWin':
            lsPlayerWin.push(chip);
            break;
          case 'playerPair':
            lsPlayerPair.push(chip);
            break;
          case 'bankerWin':
            lsBankerWin.push(chip);
            break;
          case 'bankerPair':
            lsBankerPair.push(chip);
            break;
          case 'tie':
            lsTie.push(chip);
            break;
          default: break;
        }
      }
    }

    animationHelp.repositionChip(animationHelp.mergeChips(lsPlayerWin));
    animationHelp.repositionChip(animationHelp.mergeChips(lsPlayerPair));
    animationHelp.repositionChip(animationHelp.mergeChips(lsBankerWin));
    animationHelp.repositionChip(animationHelp.mergeChips(lsBankerPair));
    animationHelp.repositionChip(animationHelp.mergeChips(lsTie));

    this.setState({ listChip });
    return animationHelp.getMapChip(listChip);
  }

  checkNewChip(checkNewCreat) {
    if (checkNewCreat === true) {
      if (this.timeOutDelay) clearTimeout(this.timeOutDelay);
      this.timeOutDelay = setTimeout(() => {
        this.setState({});
        this.timeOutDelay = null;
      }, 100);
    }
  }

  render() {
    const lsImage = [];
    const { listChip, status, arrTypeWin } = this.state;
    let checkNewCreat = false;
    for (let i = 0; i < listChip.length; i += 1) {
      let chip = null;
      if (status === AnimationState.betting) {
        chip = this.getChipBetting(listChip[i], i);
      } else if (status === AnimationState.returnChip) {
        if (arrTypeWin.includes(listChip[i].type) === true) {
          chip = this.playerReceiveChip(i, listChip[i].value, listChip[i].chipType);
        }
      } else {
        break;
      }

      if (listChip[i].newCreat === true) {
        listChip[i].newCreat = false;
        checkNewCreat = true;
      }
      if (chip) lsImage.push(chip);
    }

    this.checkNewChip(checkNewCreat);
    this.state.listChip = listChip;

    return (
      <Wrapper ref={this.rootRef} id="AllChip">
        {
          lsImage
        }
      </Wrapper>
    );
  }
}

AnimationChip.propTypes = {
};

AnimationChip.defaultProps = {
};
