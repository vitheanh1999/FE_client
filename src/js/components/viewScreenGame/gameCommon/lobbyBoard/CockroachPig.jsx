import React from 'react';
import PropTypes from 'prop-types';
import BigEyeBoy, {
  RED, BLUE, NONE_COLOR, DIRECT,
} from './BigEyeBoy';

export default class CockroachPig extends BigEyeBoy {
  constructor(props) {
    super(props);
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
    this.offset = this.radioCircle;
    this.lineWidth = this.radioCircle / 2;
    this.canvasName = `cockRoadCanvas${tableName}${tableId}`;
  }

  UNSAFE_componentWillMount() {
    const { dataOrigin } = this.props;
    this.updateData(dataOrigin);
  }

  logicCore() {
    this.calculateLogicCockRoad(); // overwrite in parent class
  }

  getColorNewColumn(currentColumn) {
    return this.logicBigRoadTable[currentColumn - 1].length
    === this.logicBigRoadTable[currentColumn - 4].length ? RED : BLUE;
  }

  getColorSameColumn(currentColumn, currentRow) {
    return this.logicBigRoadTable[currentColumn - 3][currentRow]
    === this.logicBigRoadTable[currentColumn - 3][currentRow - 1] ? RED : BLUE;
  }

  addPointToLogicCockRoadTable(colorPoint, lastColorPoint) {
    if (colorPoint !== lastColorPoint) { // creat new column
      this.logicCockRoadTable.push([colorPoint]);
    } else {
      this.logicCockRoadTable[this.logicCockRoadTable.length - 1].push(colorPoint);
    }
  }

  calculateLogicCockRoad() {
    if (!this.logicBigRoadTable) return;
    const columnNum = this.logicBigRoadTable.length;
    if (columnNum < 4) {
      this.logicCockRoadTable = [];
      return;
    }
    if (columnNum === 4 && this.logicBigRoadTable[3].length < 2) {
      this.logicCockRoadTable = [];
      return;
    }
    this.logicCockRoadTable = [];

    let currentColumn = 1;
    let currentRow = 1;
    let lastColumn = 3;
    let startColumn = -1;
    let startRow = -1;
    if (this.logicBigRoadTable[3].length >= 2) {
      startColumn = 3; // start at column 2 (from 0)
      startRow = 1;
    } else {
      startRow = 0;
      startColumn = 4; // start at column 3 (from 0)
    }

    let lastColorPoint = -1;
    let colorPoint;
    for (let x = startColumn; x < columnNum; x += 1) {
      const firstRow = x === startColumn ? startRow : 0;
      for (let j = firstRow; j < this.logicBigRoadTable[x].length; j += 1) {
        currentColumn = x;
        currentRow = j;

        // calculate colorPoint
        if (currentColumn !== lastColumn) { // new column
          colorPoint = this.getColorNewColumn(currentColumn);
        } else { // same column
          colorPoint = this.getColorSameColumn(currentColumn, currentRow);
        }

        this.addPointToLogicCockRoadTable(colorPoint, lastColorPoint);
        lastColumn = currentColumn;
        lastColorPoint = colorPoint;
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

    if (!this.logicCockRoadTable) return 0;
    const maxLogicColumn = this.logicCockRoadTable.length;

    let lastCol;
    let lastRow = -1;
    for (let i = firstColumn; i < maxLogicColumn; i += 1) {
      lastCol = this.findStartOfColumn(i);
      lastRow = -1;
      let oldDirect = DIRECT.BOTTOM;
      for (let j = 0; j < this.logicCockRoadTable[i].length; j += 1) {
        const colorPoint = this.logicCockRoadTable[i][j];
        const direct = this.findNextPosition(lastCol, lastRow, oldDirect);
        switch (direct) {
          case DIRECT.RIGHT:
            oldDirect = DIRECT.RIGHT;
            lastCol += 1;
            break;
          case DIRECT.BOTTOM:
            lastRow += 1;
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
    context.moveTo(x - this.offset, y + this.offset);
    context.lineTo(x + this.offset, y - this.offset);

    switch (color) {
      case RED:
        context.strokeStyle = '#d90504';
        break;
      case BLUE:
        context.strokeStyle = '#0000a9';
        break;
      default: break;
    }

    context.stroke();
  }

  getLastPointColor() {
    let result = 'none';
    // get last point in logicCore
    if (this.logicCockRoadTable) {
      const { length } = this.logicCockRoadTable;
      if (length > 0) {
        const lastIndex = this.logicCockRoadTable[length - 1].length - 1;
        result = this.logicCockRoadTable[length - 1][lastIndex] === 0 ? 'red' : 'blue';
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

CockroachPig.propTypes = {
  dataOrigin: PropTypes.arrayOf(PropTypes.any),
  tableName: PropTypes.string,
  columns: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  maxColumnVisible: PropTypes.number,
  tableId: PropTypes.number,
};

CockroachPig.defaultProps = {
  dataOrigin: [],
  tableName: '',
  columns: 32,
  width: 252,
  height: 48,
  maxColumnVisible: 31,
  tableId: -1,
};
