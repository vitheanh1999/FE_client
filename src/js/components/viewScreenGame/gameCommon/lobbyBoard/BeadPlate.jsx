import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { colors } from './lobbyBoardConst';

export function infoItem(item) {
  const colorBg = {};
  if (item.p_pair > 0) {
    colorBg.p_pair = true;
  }

  if (item.b_pair > 0) {
    colorBg.b_pair = true;
  }

  if (item.tie > 0) {
    colorBg.color = colors.hexTie;
    colorBg.text = 'T';
  } else if (item.banker > 0) {
    colorBg.color = colors.hexBanker;
    colorBg.text = 'B';
  } else {
    colorBg.color = colors.hexPlayer;
    colorBg.text = 'P';
  }
  return colorBg;
}

export function cutData(allData, maxColumnVisible, rows) {
  if (!allData) return allData;
  const { length } = allData;
  if (length <= (maxColumnVisible * rows)) return allData;
  const tail = length % rows;
  let numberColumn = (length - tail) / rows;
  if (tail > 0) numberColumn += 1;
  return allData.slice((numberColumn - maxColumnVisible) * rows);
}

export default class BeadPlate extends Component {
  componentDidMount() {
  }

  render() {
    const {
      columns, rows, width, height, maxColumnVisible,
    } = this.props;
    let { listData } = this.props;

    const distance = (width - (columns - 1)) / columns;
    const size = distance * 0.207;

    const Wrapper = {
      width,
      height,
      background: 'transparent',
      display: 'grid',
      alignItems: 'center',
      gridGap: 1,
      gridTemplateColumns: `repeat(${columns},${distance}px)`,
      gridTemplateRows: `repeat(${rows},${distance}px)`,
      gridAutoFlow: 'column',
      right: 0,
      left: 0,
    };

    const Point = {
      width: distance * 0.879,
      height: distance * 0.879,
      borderRadius: '50%',
      position: 'relative',
      color: 'white',
      fontSize: distance * 0.879 * 0.647,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
    };

    const SolidBorder = '1px solid white';
    const IconPairBanker = {
      width: size,
      height: size,
      background: 'red',
      borderRadius: '50%',
      position: 'absolute',
      top: 0,
      left: 0,
      borderLeft: SolidBorder,
      borderRight: SolidBorder,
      borderBottom: SolidBorder,
      borderTop: SolidBorder,
    };

    const IconPairPlayer = {
      width: size,
      height: size,
      background: '#0000a9',
      borderRadius: '50%',
      position: 'absolute',
      bottom: 0,
      right: 0,
      borderLeft: SolidBorder,
      borderRight: SolidBorder,
      borderBottom: SolidBorder,
      borderTop: SolidBorder,
    };

    listData = cutData(listData, maxColumnVisible, rows);
    let keyId = 0;
    const listTable = listData !== undefined && listData.length > 0
      ? listData.map((item) => {
        const info = infoItem(item);
        const dotP = info.p_pair ? <div style={IconPairPlayer} /> : null;
        const dotB = info.b_pair ? <div style={IconPairBanker} /> : null;
        keyId += 1;
        return (
          <div
            style={{
              ...Point,
              background: info.color,
            }}
            key={keyId}
          >
            {info.text}
            {dotB}
            {dotP}
          </div>
        );
      }) : null;
    return (
      <div
        style={Wrapper}
      >
        {listTable}
      </div>
    );
  }
}

BeadPlate.propTypes = {
  listData: PropTypes.arrayOf(PropTypes.arrayOf).isRequired,
  columns: PropTypes.number,
  rows: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  maxColumnVisible: PropTypes.number,
};

BeadPlate.defaultProps = {
  columns: 9,
  rows: 6,
  width: 285,
  height: 196,
  maxColumnVisible: 8,
};
