import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compareLobbyData } from './BigRoad';

export const ROW_NUMBER = 6;

export const RED = 0;
export const BLUE = 1;
export const NONE_COLOR = -1;
export const DIRECT = {
  RIGHT: 'right',
  BOTTOM: 'bottom',
  NONE: 'none',
};

export default class BigEyeBoy extends Component {
  constructor(props) {
    super(props);
    this.lineWidth = 1;
    this.dataOrigin = [];
    this.MAX_COLUMN_LOGIC_VISIBLE_TABLE = 180;
    // ------ auto config param ------------
    this.updateParam();
  }

  getColorNewColumn(currentColumn) {
    return this.logicBigRoadTable[currentColumn - 1].length
    === this.logicBigRoadTable[currentColumn - 2].length ? RED : BLUE;
  }

  getColorSameColumn(currentColumn, currentRow) {
    return this.logicBigRoadTable[currentColumn - 1][currentRow]
    === this.logicBigRoadTable[currentColumn - 1][currentRow - 1] ? RED : BLUE;
  }

  getPointDistance(i, lineWidth) {
    const stepX = parseInt(i / 2, 10) + 1;
    let x = 0;
    if (i % 2 === 0) {
      x = (stepX - 1) * this.distance * 2 + lineWidth / 4 + this.distance / 2;
    } else {
      x = stepX * this.distance * 2 - lineWidth / 4 - this.distance / 2;
    }
    return x;
  }

  getLastPointColor() {
    let result = 'none';
    // get last point in logicCore
    if (this.logicBigEyeTable) {
      const { length } = this.logicBigEyeTable;
      if (length > 0) {
        const lastIndex = this.logicBigEyeTable[length - 1].length - 1;
        result = this.logicBigEyeTable[length - 1][lastIndex] === 0 ? 'red' : 'blue';
      }
    }
    return result;
  }

  updateParam() {
    const {
      columns, width, tableName, tableId,
    } = this.props;
    this.COLUMN_NUMBER = columns;
    this.distance = width / columns;
    this.radioCircle = this.distance * 0.404;
    this.canvasName = `bigEyeBoyCanvas${tableName}${tableId}`;
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

  addPointToLogicBigEyeTable(colorPoint, lastColorPoint) {
    if (colorPoint !== lastColorPoint) { // creat new column
      this.logicBigEyeTable.push([colorPoint]);
    } else {
      this.logicBigEyeTable[this.logicBigEyeTable.length - 1].push(colorPoint);
    }
  }

  logicCore() {
    this.calculateLogicBigEyeBoy(); // overwrite in child class
  }

  calculateLogicBigRoad() {
    if (!this.dataSimple) return;
    this.logicBigRoadTable = [];

    const dataSimpleLength = this.dataSimple.length;
    let lastPoint = -1;
    for (let i = 0; i < dataSimpleLength; i += 1) {
      const currentPoint = this.dataSimple[i];
      if (currentPoint !== lastPoint) {
        this.logicBigRoadTable.push([currentPoint]); // add new column
      } else {
        this.logicBigRoadTable[this.logicBigRoadTable.length - 1].push(currentPoint);
      }
      lastPoint = currentPoint;
    }
  }

  updateData(_dataOrigin) {
    const { maxColumnVisible } = this.props;
    this.dataOrigin = [..._dataOrigin];
    this.dataSimple = [];
    const dataOriginLength = this.dataOrigin.length;
    for (let i = 0; i < dataOriginLength; i += 1) {
      if (this.dataOrigin[i].tie === 0) {
        this.dataSimple.push(this.dataOrigin[i].player);
      }
    }

    this.calculateLogicBigRoad();
    this.logicCore();
    const maxColumn = this.calculateVisibleTable(0);
    if (maxColumn > maxColumnVisible) {
      this.calculateVisibleTable(maxColumn - maxColumnVisible);
    }
    if (this.renderCanvas() === false) {
      setTimeout(() => {
        this.renderCanvas();
      }, 500);
    }
  }

  calculateLogicBigEyeBoy() {
    if (!this.logicBigRoadTable) return;
    const columnNum = this.logicBigRoadTable.length;
    if (columnNum < 2) {
      this.logicBigEyeTable = [];
      return;
    }
    if (columnNum === 2 && this.logicBigRoadTable[1].length < 2) {
      this.logicBigEyeTable = [];
      return;
    }
    this.logicBigEyeTable = [];

    let currentColumn = 1;
    let currentRow = 1;
    let lastColumn = 1;
    let startColumn = -1;
    let startRow = -1;
    if (this.logicBigRoadTable[1].length >= 2) {
      startColumn = 1; // start at column 1 (from 0)
      startRow = 1;
    } else {
      startColumn = 2; // start at column 2 (from 0)
      startRow = 0;
    }

    let colorPoint;
    let lastColorPoint = -1;
    for (let i = startColumn; i < columnNum; i += 1) {
      const firstRow = i === startColumn ? startRow : 0;
      for (let j = firstRow; j < this.logicBigRoadTable[i].length; j += 1) {
        currentRow = j;
        currentColumn = i;
        // calculate colorPoint
        if (currentColumn !== lastColumn) { // new column
          colorPoint = this.getColorNewColumn(currentColumn);
        } else { // same column
          colorPoint = this.getColorSameColumn(currentColumn, currentRow);
        }

        this.addPointToLogicBigEyeTable(colorPoint, lastColorPoint);

        lastColorPoint = colorPoint;
        lastColumn = currentColumn;
      }
    }
  }

  // --------- Predict next turn ------------
  addPointToBigRoad(isPlayerWin) {
    const value = isPlayerWin === true ? 1 : 0;
    if (!this.logicBigRoadTable) this.logicBigRoadTable = [];
    const { length } = this.logicBigRoadTable;
    if (length === 0) {
      this.logicBigRoadTable.push([value]); // add first column
      return;
    }

    const lastPointColor = this.logicBigRoadTable[length - 1][0];
    if (value === lastPointColor) { // same color
      this.logicBigRoadTable[length - 1].push(value);
    } else {
      this.logicBigRoadTable.push([value]); // add new column
    }
  }

  removeLastPointBigRoad() {
    if (!this.logicBigRoadTable) return;
    const { length } = this.logicBigRoadTable;
    if (length === 0) return;
    if (this.logicBigRoadTable[length - 1].length === 1) {
      this.logicBigRoadTable.pop(); // remove last column
    } else {
      this.logicBigRoadTable[length - 1].pop(); // remove last point
    }
  }

  predictNextPointColor(isPlayerWin) {
    this.addPointToBigRoad(isPlayerWin);
    this.logicCore();

    const result = this.getLastPointColor();

    this.removeLastPointBigRoad();
    this.logicCore();
    return result;
  }
  // ----------------- end predict ----------------

  calculateVisibleTable(firstColumn = 0) {
    let maxColumn = firstColumn;
    this.visibleTable = [];
    for (let i = 0; i < this.MAX_COLUMN_LOGIC_VISIBLE_TABLE; i += 1) {
      this.visibleTable.push([NONE_COLOR, NONE_COLOR, NONE_COLOR,
        NONE_COLOR, NONE_COLOR, NONE_COLOR]);
    }

    if (!this.logicBigEyeTable) return 0;
    const maxLogicColumn = this.logicBigEyeTable.length;

    let lastCol;
    let lastRow = -1;
    for (let i = firstColumn; i < maxLogicColumn; i += 1) {
      lastCol = this.findStartOfColumn(i);
      lastRow = -1;
      let oldDirect = DIRECT.BOTTOM;
      for (let j = 0; j < this.logicBigEyeTable[i].length; j += 1) {
        const colorPoint = this.logicBigEyeTable[i][j];
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
        this.visibleTable[lastCol][lastRow] = colorPoint;
        if (lastCol > maxColumn) maxColumn = lastCol;
      }
    }

    this.shiftToLeftVisibleTable(firstColumn);
    return (maxColumn - firstColumn + 1);
  }

  shiftToLeftVisibleTable(distance) {
    const numberColumn = this.visibleTable.length;
    for (let i = 0; i < numberColumn; i += 1) {
      for (let j = 0; j < this.visibleTable[i].length; j += 1) {
        if ((i + distance) < numberColumn) {
          this.visibleTable[i][j] = this.visibleTable[i + distance][j];
        } else {
          this.visibleTable[i][j] = NONE_COLOR;
        }
      }
    }
  }

  findNextPosition(lastPointCol, lastPointRow, oldDirect) {
    if (this.visibleTable[lastPointCol + 1][lastPointRow] && oldDirect === DIRECT.RIGHT) {
      return DIRECT.RIGHT;
    }
    if (this.visibleTable[lastPointCol][lastPointRow + 1] === NONE_COLOR) return DIRECT.BOTTOM;
    if (this.visibleTable[lastPointCol + 1][lastPointRow] === NONE_COLOR) return DIRECT.RIGHT;
    return DIRECT.NONE;
  }

  findStartOfColumn(columnIndex) {
    for (let i = columnIndex; i < this.visibleTable.length; i += 1) {
      if (this.visibleTable[i][0] === NONE_COLOR) return i;
    }
    return -1;
  }

  drawCircle(ctx, x, y, color) {
    const context = ctx;
    context.beginPath();
    context.arc(x, y, this.radioCircle, 0, 2 * Math.PI);

    switch (color) {
      case RED:
        context.strokeStyle = '#d90504';
        break;
      case BLUE:
        context.strokeStyle = '#0000a9';
        break;
      default: break;
    }
    context.fillStyle = '#dddddd';
    context.fill();
    context.stroke();
  }

  renderCanvas() {
    try {
      const canvas = document.getElementById(this.canvasName);
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.lineWidth = this.lineWidth;
      const lineWidth = 1;

      for (let i = 0; i < this.COLUMN_NUMBER; i += 1) {
        for (let j = 0; j < ROW_NUMBER; j += 1) {
          if (this.visibleTable[i][j] !== NONE_COLOR) {
            const x = this.getPointDistance(i, lineWidth);
            const y = this.getPointDistance(j, lineWidth);
            this.drawCircle(context, x, y, this.visibleTable[i][j]);
          }
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  render() {
    const { width, height } = this.props;
    return (
      <canvas
        id={this.canvasName}
        width={width}
        height={height}
        style={{
          backgroundColor: 'transparent',
        }}
      />
    );
  }
}
BigEyeBoy.propTypes = {
  dataOrigin: PropTypes.arrayOf(PropTypes.any),
  tableName: PropTypes.string,
  columns: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  maxColumnVisible: PropTypes.number,
  tableId: PropTypes.number,
};

BigEyeBoy.defaultProps = {
  dataOrigin: [],
  tableName: '',
  columns: 64,
  width: 505,
  height: 47,
  maxColumnVisible: 63,
  tableId: -1,
};
