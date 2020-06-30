import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const TYPE = {
  EMPTY: 'EMPTY',
  PLAYER: 'PLAYER',
  BANKER: 'BANKER',
  PLAYER_TIE: 'PLAYER_TIE',
  BANKER_TIE: 'BANKER_TIE',
  EMPTY_TIE: 'EMPTY_TIE',
};

export const DIRECT = {
  RIGHT: 'RIGHT',
  BOTTOM: 'BOTTOM',
  NONE: 'NONE',
};

export const Canvas = styled.canvas`
  background: transparent;
`;

export function drawTieLine(ctx, x, y, delta, offset) {
  const context = ctx;
  context.beginPath();
  context.moveTo(x - offset + delta, y + offset + delta);
  context.lineTo(x + offset + delta, y - offset + delta);
  context.strokeStyle = '#228a2b';
  context.stroke();
}

export function drawCircle(ctx, x, y, type, number, radius) {
  const context = ctx;
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.lineWidth = 2;

  const offset = radius * 0.428;
  const textOffset = radius * 0.571;
  switch (type) {
    case TYPE.BANKER:
      context.strokeStyle = '#d90504';
      break;
    case TYPE.PLAYER:
      context.strokeStyle = '#0000a9';
      break;
    case TYPE.BANKER_TIE:
      context.font = `${radius * 1.714}px Arial`;
      context.fillStyle = '#228a2b';
      context.fillText(number, x - textOffset, y + textOffset);
      context.strokeStyle = '#d90504';
      break;
    case TYPE.PLAYER_TIE:
      context.font = `${radius * 1.714}px Arial`;
      context.fillStyle = '#228a2b';
      context.fillText(number, x - textOffset, y + textOffset);
      context.strokeStyle = '#0000a9';
      break;
    case TYPE.EMPTY_TIE:
      if (number > 1) {
        context.font = `${radius * 1.714}px Arial`;
        context.fillStyle = '#228a2b';
        context.fillText(number, x - textOffset, y + textOffset);
      }
      context.strokeStyle = 'transparent';
      break;
    default:
      break;
  }
  context.stroke();
  if (type === TYPE.BANKER_TIE || type === TYPE.PLAYER_TIE) {
    drawTieLine(ctx, x, y, offset, offset);
  }

  if (type === TYPE.EMPTY_TIE) {
    drawTieLine(ctx, x, y, textOffset, offset);
  }
}

export const isNewCol = (itemData, result) => {
  const lastCol = result[result.length - 1];
  const lastItem = lastCol[lastCol.length - 1];
  if (
    itemData.banker === 1
    && (lastItem.type === TYPE.BANKER || lastItem.type === TYPE.BANKER_TIE)
  ) {
    return false;
  }
  if (
    itemData.player === 1
    && (lastItem.type === TYPE.PLAYER || lastItem.type === TYPE.PLAYER_TIE)
  ) {
    return false;
  }
  return true;
};

export const countConsecutiveTie = (index, data) => {
  const { length } = data;
  let count = 0;
  for (let i = index; i < length; i += 1) {
    if (data[i].tie === 1) {
      count += 1;
    } else return count;
  }
  return count;
};

export const getTypeOfPoint = (tieCount, turnData) => {
  if (tieCount !== 0) {
    return turnData.banker ? TYPE.BANKER_TIE : TYPE.PLAYER_TIE;
  }
  return turnData.banker ? TYPE.BANKER : TYPE.PLAYER;
};

export const compareLobbyData = (data1, data2) => {
  // require data1, data2 != null, undefined
  if (data1.length !== data2.length) return data1.length - data2.length;
  for (let i = data1.length - 1; i >= 0; i -= 1) {
    if (JSON.stringify(data1[i]) !== JSON.stringify(data2[i])) return 1;
  }
  return 0;
};

export default class BigRoad extends Component {
  constructor(props) {
    super(props);
    this.dataOrigin = [];
    this.logicTable = [];
    this.drawTable = [];
    this.tieCount = 0;
    // ------ auto config param ------------
    this.updateParam();
  }

  getLogicTable(data) {
    const { length } = data;
    const result = [];
    let i = 0;
    let step = 0;
    while (i < length) {
      // count tie in first
      if (i === 0 && data[0].tie === 1) {
        this.tieCount = countConsecutiveTie(0, data);
        i += this.tieCount;
      } else {
        if (i < length - 1) {
          step = countConsecutiveTie(i + 1, data);
          this.tieCount += step;
        }
        const type = getTypeOfPoint(this.tieCount, data[i]);
        // Add a new col
        if (result.length === 0 || isNewCol(data[i], result)) {
          const newCol = [];
          newCol.push({ type, number: this.tieCount });
          result.push(newCol);
        } else { // Add a item to col
          const lastCol = result[result.length - 1];
          lastCol.push({ type, number: this.tieCount });
        }
        i += step + 1;
        this.tieCount = 0;
      }
    }

    if (result.length === 0 && length > 0) {
      result.push([{ type: TYPE.EMPTY_TIE, number: this.tieCount }]);
    }
    return result;
  }

  updateParam() {
    const {
      columns, rows, width,
    } = this.props;
    this.COLUMN_NUMBER = columns;
    this.ROW_NUMBER = rows;
    this.WIDTH = width / columns;
    this.distance = this.WIDTH;
    this.MAX_COLUMN_LOGIC_VISIBLE_TABLE = 180;
  }

  UNSAFE_componentWillMount() {
    const { dataOrigin } = this.props;
    this.updateData(dataOrigin);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.dataOrigin.length === 0
      || (newProps.dataOrigin && compareLobbyData(newProps.dataOrigin, this.dataOrigin) !== 0)) {
      this.updateData(newProps.dataOrigin);
      this.setState({});
    }
  }

  updateData(dataOrigin) {
    const { maxColumnVisible } = this.props;
    this.dataOrigin = [...dataOrigin];
    this.logicTable = this.getLogicTable(this.dataOrigin);
    const maxColumn = this.calculateDrawTable();
    if (maxColumn > maxColumnVisible) {
      this.calculateDrawTable(maxColumn - maxColumnVisible);
    }
    if (this.renderCanvas() === false) {
      setTimeout(() => {
        this.renderCanvas();
      }, 500);
    }
  }

  calculateDrawTable(firstColumn = 0) {
    let maxColumn = firstColumn;
    this.drawTable = [];
    // init array
    for (let i = 0; i < this.MAX_COLUMN_LOGIC_VISIBLE_TABLE; i += 1) {
      this.drawTable.push([
        { type: TYPE.EMPTY },
        { type: TYPE.EMPTY },
        { type: TYPE.EMPTY },
        { type: TYPE.EMPTY },
        { type: TYPE.EMPTY },
        { type: TYPE.EMPTY },
      ]);
    }

    if (!this.logicTable) return 0;
    const maxLogicColumn = this.logicTable.length;
    let lastCol;
    let lastRow = -1;
    for (let i = firstColumn; i < maxLogicColumn; i += 1) {
      lastCol = this.findStartOfColumn(i);
      lastRow = -1;
      let oldDirect = DIRECT.BOTTOM;
      for (let j = 0; j < this.logicTable[i].length; j += 1) {
        const { type, number } = this.logicTable[i][j];
        const direct = this.findNextPosition(lastCol, lastRow, oldDirect);
        switch (direct) {
          case DIRECT.BOTTOM:
            lastRow += 1;
            break;
          case DIRECT.RIGHT:
            oldDirect = DIRECT.RIGHT;
            lastCol += 1;
            break;
          default:
            break;
        }
        this.drawTable[lastCol][lastRow].type = type;
        this.drawTable[lastCol][lastRow].number = number;
        if (lastCol > maxColumn) maxColumn = lastCol;
      }
    }
    this.shiftToLeftDrawTable(firstColumn);
    return maxColumn - firstColumn + 1;
  }

  shiftToLeftDrawTable(distance) {
    const numberColumn = this.drawTable.length;
    for (let i = 0; i < numberColumn; i += 1) {
      for (let j = 0; j < this.drawTable[i].length; j += 1) {
        if (i + distance < numberColumn) {
          this.drawTable[i][j] = this.drawTable[i + distance][j];
        } else {
          this.drawTable[i][j] = TYPE.EMPTY;
        }
      }
    }
  }

  findNextPosition(lastPointCol, lastPointRow, oldDirect) {
    if (this.drawTable[lastPointCol + 1][lastPointRow] && oldDirect === DIRECT.RIGHT) {
      return DIRECT.RIGHT;
    }
    if (
      this.drawTable[lastPointCol][lastPointRow + 1]
      && this.drawTable[lastPointCol][lastPointRow + 1].type === TYPE.EMPTY
    ) {
      return DIRECT.BOTTOM;
    }
    if (
      this.drawTable[lastPointCol + 1][lastPointRow]
      && this.drawTable[lastPointCol + 1][lastPointRow].type === TYPE.EMPTY
    ) {
      return DIRECT.RIGHT;
    }
    return DIRECT.NONE;
  }

  findStartOfColumn(columnIndex) {
    for (let i = columnIndex; i < this.drawTable.length; i += 1) {
      if (this.drawTable[i][0].type === TYPE.EMPTY) return i;
    }
    return -1;
  }

  renderCanvas() {
    const { tableName, tableId } = this.props;
    const idCanvas = `bigRoadCanvas${tableName}${tableId}`;
    const canvas = document.getElementById(idCanvas);
    if (!canvas) return false;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 1;
    for (let i = 0; i < this.COLUMN_NUMBER; i += 1) {
      for (let j = 0; j < this.ROW_NUMBER; j += 1) {
        if (this.drawTable[i][j].type !== TYPE.EMPTY) {
          drawCircle(
            context,
            i * this.distance + this.WIDTH / 2,
            j * this.distance + this.WIDTH / 2,
            this.drawTable[i][j].type,
            this.drawTable[i][j].number,
            this.WIDTH * 0.3538,
          );
        }
      }
    }
    return true;
  }

  render() {
    const {
      tableName, width, height, tableId,
    } = this.props;
    const idCanvas = `bigRoadCanvas${tableName}${tableId}`;
    return <Canvas id={idCanvas} width={width} height={height} />;
  }
}

BigRoad.propTypes = {
  dataOrigin: PropTypes.arrayOf(PropTypes.any),
  tableName: PropTypes.string,
  columns: PropTypes.number,
  rows: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  maxColumnVisible: PropTypes.number,
  tableId: PropTypes.number,
};

BigRoad.defaultProps = {
  dataOrigin: [],
  tableName: '',
  columns: 32,
  rows: 6,
  width: 505,
  height: 95,
  maxColumnVisible: 31,
  tableId: -1,
};
