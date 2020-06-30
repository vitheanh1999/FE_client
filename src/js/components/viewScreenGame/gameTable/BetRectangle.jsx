import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import {
  CHIP_HEIGHT, CHIP_WIDTH, MAX_CHIP_PER_COLUMN, CLEAR_ALL_CHIP,
} from '../constBetting/gameTable';
import { ConfirmChipStatus } from './AnimationChip';
import { rotateBoundingRect } from '../help/BettingUtils';
import { CHIP_VALUES } from '../logicCore/animationHelp';

const Wrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  margin: ${props => props.margin}px;
  background-image: url(${props => props.imageBG});
  background-repeat: no-repeat;
  justify-content: center;
  align-items: center;
  display: flex;
  background-size: 100% 100%;
`;

export default class BetRectangle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listChip: [],
    };
    this.rootRef = React.createRef();
    this.columnPos = null;
  }

  componentDidMount() {
    this.autoGenListChip();
  }

  onClickRectangle() {
    const { onClick, lockBet } = this.props;
    if (onClick && lockBet === false) onClick();
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

  getBoundingClientRect() {
    return this.rootRef.current.getBoundingClientRect();
  }

  getPositionColumns() {
    this.columnPos = [];
    let rootPos = this.rootRef.current.getBoundingClientRect();
    rootPos = rotateBoundingRect(rootPos);
    const { width, height } = rootPos;
    const scale = window.getScale();
    const { numberColumn } = this.props;
    if (numberColumn === 2) {
      this.columnPos.push({
        x: rootPos.left + width / 2 - CHIP_WIDTH * scale - 1,
        y: rootPos.top + height / 2,
      });

      this.columnPos.push({
        x: rootPos.left + width / 2 + 1,
        y: rootPos.top + height / 2,
      });
    } else {
      this.columnPos.push({
        x: rootPos.left + width / 2 - CHIP_WIDTH * scale - 1,
        y: rootPos.top + height / 2 - CHIP_HEIGHT * scale / 3,
      });

      this.columnPos.push({
        x: rootPos.left + width / 2 + 1,
        y: rootPos.top + height / 2 - CHIP_HEIGHT * scale / 3,
      });

      this.columnPos.push({
        x: rootPos.left + width / 2 - CHIP_WIDTH * scale / 2,
        y: rootPos.top + height / 2 + CHIP_HEIGHT * scale / 3,
      });
    }
  }

  getPositionNewChip(chipValue, turnId) {
    this.getPositionColumns();
    const { numberColumn } = this.props;
    const length = this.addNewChipToList(chipValue, turnId);
    let columnIndex = 0;
    let columnOffset = 0;
    if (length % MAX_CHIP_PER_COLUMN === 0) {
      columnIndex = length / MAX_CHIP_PER_COLUMN - 1;
      columnOffset = MAX_CHIP_PER_COLUMN;
      if (columnIndex >= numberColumn) {
        columnIndex = numberColumn - 1;
      }
    } else {
      columnIndex = Math.ceil(length / MAX_CHIP_PER_COLUMN) - 1;
      if (columnIndex >= numberColumn) {
        columnIndex = numberColumn - 1;
        columnOffset = MAX_CHIP_PER_COLUMN;
      } else {
        columnOffset = length % MAX_CHIP_PER_COLUMN;
      }
    }
    return {
      x: this.columnPos[columnIndex].x,
      y: this.columnPos[columnIndex].y - columnOffset * 4 * window.getScale(),
    };
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

  addNewChipToList(chipValue, turnId) {
    const { listChip } = this.state;
    listChip.push({
      turnId,
      value: chipValue,
      isConfirmed: ConfirmChipStatus.notConfirm,
    });
    this.state.listChip = listChip;
    const { length } = listChip;
    this.setState({ listChip });
    return length;
  }

  removeChipInList(totalValue) {
    const { listChip } = this.state;
    let removeValue = 0;
    for (let i = listChip.length - 1; i >= 0; i -= 1) {
      if ((removeValue < totalValue) && ((removeValue + listChip[i].value) <= totalValue)) {
        removeValue += listChip[i].value;
        listChip.splice(i, 1);
        if (removeValue === totalValue) break;
      }
    }
    this.setState({ listChip });
  }

  confirmAllChip() {
    const { listChip } = this.state;
    for (let i = 0; i < listChip.length; i += 1) {
      if (listChip[i].isConfirmed === ConfirmChipStatus.waitingConfirm) {
        listChip[i].isConfirmed = ConfirmChipStatus.confirmed;
      }
    }
    this.setState({ listChip });
  }

  clearAllChip(turnId = CLEAR_ALL_CHIP) {
    if (turnId === CLEAR_ALL_CHIP) {
      this.setState({ listChip: [] });
    } else {
      const { listChip } = this.state;
      const lsChipRemove = listChip.filter(chip => chip.turnId > turnId);
      this.setState({ listChip: lsChipRemove });
    }
  }

  clearNotConfirmChip() {
    const { listChip } = this.state;
    const lsChipRemove = listChip.filter(chip => chip.isConfirmed !== ConfirmChipStatus.notConfirm);
    this.setState({ listChip: lsChipRemove });
  }

  removeAllCoin() {
    this.setState({ listChip: [] });
  }

  autoGenListChip(_numberCoin = null) {
    const chipValue = [...CHIP_VALUES];
    let { numberCoin: sumCoin } = this.props;
    if (_numberCoin) sumCoin = _numberCoin;
    const listChip = [];
    let i = chipValue.length - 1;
    while (true) {
      if (i === -1) break;
      if (sumCoin >= chipValue[i]) {
        listChip.push({
          value: chipValue[i],
          isConfirmed: ConfirmChipStatus.confirmed,
        });
        sumCoin -= chipValue[i];
      } else {
        i -= 1;
      }
    }

    // reverse listChip
    this.setState({ listChip: listChip.reverse() });
  }

  updateListChipMerge(listChipMerged) {
    const chips = [];
    const { length } = listChipMerged;
    for (let i = 0; i < length; i += 1) {
      if (listChipMerged[i].value > 0) {
        chips.push({
          turnId: listChipMerged[i].turnId,
          value: listChipMerged[i].value,
          isConfirmed: listChipMerged[i].isConfirmed,
        });
      }
    }
    this.setState({ listChip: chips });
  }

  render() {
    const {
      width, height, margin, imageBG, lockBet,
    } = this.props;
    return (
      <Wrapper
        width={width}
        height={height}
        margin={margin}
        imageBG={imageBG}
        onClick={() => {
          if (isMobile === false) this.onClickRectangle();
        }}
        onTouchStart={() => {
          if (isMobile === true) this.onClickRectangle();
        }}
        ref={this.rootRef}
        lockBet={lockBet}
      />
    );
  }
}

BetRectangle.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.number,
  imageBG: PropTypes.string,
  onClick: PropTypes.func,
  numberCoin: PropTypes.number.isRequired,
  numberColumn: PropTypes.number,
  lockBet: PropTypes.bool,
};

BetRectangle.defaultProps = {
  margin: 0,
  imageBG: null,
  onClick: null,
  numberColumn: 2,
  lockBet: false,
};
