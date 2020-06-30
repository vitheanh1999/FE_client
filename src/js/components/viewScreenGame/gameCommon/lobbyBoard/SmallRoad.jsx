import React from 'react';
import PropTypes from 'prop-types';
import BigEyeBoy, {
  RED, BLUE, NONE_COLOR, DIRECT,
} from './BigEyeBoy';

export default class SmallRoad extends BigEyeBoy {
  constructor(props) {
    super(props);
    this.lineWidth = 1;
    this.dataOrigin = [];
    // ------ auto config param ------------
    this.updateParam();
  }

  updateParam() {
    const {
      columns, width, tableName, tableId,
    } = this.props;
    this.COLUMN_NUMBER = columns;
    this.distance = width / columns;
    this.radioCircle = this.distance * 0.404;
    this.canvasName = `smallRoadCanvas${tableName}${tableId}`;
  }

  UNSAFE_componentWillMount() {
    const { dataOrigin } = this.props;
    this.updateData(dataOrigin);
  }

  logicCore() {
    this.calculateLogicSmallRoad(); // overwrite in parent class
  }

  getColorNewColumn(currentColumn) {
    return this.logicBigRoadTable[currentColumn - 1].length
    === this.logicBigRoadTable[currentColumn - 3].length ? RED : BLUE;
  }

  getColorSameColumn(currentColumn, currentRow) {
    return this.logicBigRoadTable[currentColumn - 2][currentRow]
    === this.logicBigRoadTable[currentColumn - 2][currentRow - 1] ? RED : BLUE;
  }

  addPointToLogicSmallRoadTable(colorPoint, lastColorPoint) {
    if (colorPoint !== lastColorPoint) { // creat new column
      this.logicSmallRoadTable.push([colorPoint]);
    } else {
      this.logicSmallRoadTable[this.logicSmallRoadTable.length - 1].push(colorPoint);
    }
  }

  calculateLogicSmallRoad() {
    if (!this.logicBigRoadTable) return;
    const columnNum = this.logicBigRoadTable.length;
    if (columnNum < 3) {
      this.logicSmallRoadTable = [];
      return;
    }
    if (columnNum === 3 && this.logicBigRoadTable[2].length < 2) {
      this.logicSmallRoadTable = [];
      return;
    }
    this.logicSmallRoadTable = [];

    let currentColumn = 1;
    let currentRow = 1;
    let lastColumn = 2;
    let startColumn = -1;
    let startRow = -1;
    if (this.logicBigRoadTable[2].length >= 2) {
      startColumn = 2; // start at column 2 (from 0)
      startRow = 1;
    } else {
      startColumn = 3; // start at column 3 (from 0)
      startRow = 0;
    }

    let lastColorPoint = -1;
    let colorPoint;
    for (let i = startColumn; i < columnNum; i += 1) {
      const firstRow = i === startColumn ? startRow : 0;
      for (let j = firstRow; j < this.logicBigRoadTable[i].length; j += 1) {
        currentColumn = i;
        currentRow = j;

        // calculate colorPoint
        if (currentColumn !== lastColumn) { // new column
          colorPoint = this.getColorNewColumn(currentColumn);
        } else { // same column
          colorPoint = this.getColorSameColumn(currentColumn, currentRow);
        }

        this.addPointToLogicSmallRoadTable(colorPoint, lastColorPoint);

        lastColorPoint = colorPoint;
        lastColumn = currentColumn;
      }
    }
  }

  calculateVisibleTable(firstColumn = 0) {
    let maxColumn = firstColumn;
    this.visibleTable = [];
    for (let i = 0; i < this.MAX_COLUMN_LOGIC_VISIBLE_TABLE; i += 1) {
      this.visibleTable.push([NONE_COLOR, NONE_COLOR, NONE_COLOR,
        NONE_COLOR, NONE_COLOR, NONE_COLOR]);
    }

    if (!this.logicSmallRoadTable) return 0;
    const maxLogicColumn = this.logicSmallRoadTable.length;

    let lastCol;
    let lastRow = -1;
    for (let i = firstColumn; i < maxLogicColumn; i += 1) {
      lastCol = this.findStartOfColumn(i);
      lastRow = -1;
      let oldDirect = DIRECT.BOTTOM;
      for (let j = 0; j < this.logicSmallRoadTable[i].length; j += 1) {
        const colorPoint = this.logicSmallRoadTable[i][j];
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

  drawCircle(ctx, x, y, color) {
    const context = ctx;
    context.beginPath();
    context.arc(x, y, this.radioCircle, 0, 2 * Math.PI);

    switch (color) {
      case RED:
        context.fillStyle = '#d90504';
        break;
      case BLUE:
        context.fillStyle = '#0000a9';
        break;
      default: break;
    }
    context.fill();
  }

  getLastPointColor() {
    let result = 'none';
    // get last point in logicCore
    if (this.logicSmallRoadTable) {
      const { length } = this.logicSmallRoadTable;
      if (length > 0) {
        const lastIndex = this.logicSmallRoadTable[length - 1].length - 1;
        result = this.logicSmallRoadTable[length - 1][lastIndex] === 0 ? 'red' : 'blue';
      }
    }
    return result;
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

SmallRoad.propTypes = {
  dataOrigin: PropTypes.arrayOf(PropTypes.any),
  tableName: PropTypes.string,
  columns: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  maxColumnVisible: PropTypes.number,
  tableId: PropTypes.number,
};

SmallRoad.defaultProps = {
  dataOrigin: [],
  tableName: '',
  columns: 32,
  width: 252,
  height: 48,
  maxColumnVisible: 31,
  tableId: -1,
};
