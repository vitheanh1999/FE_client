import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isMobile, isTablet, isMobileOnly } from 'react-device-detect';
import { convertNumberBetRange } from '../Utils';

const StyledContent = styled.div`
  z-index: 10;
  height: 27px;
`;

const ButtonLimit = styled.div`
  ${props => (!props.top && 'position: absolute; top: 0; left: 0; margin-left: 5px; margin-top: 5px;')};
  background-color: ${props => (props.top ? 'transparent' : '#0000006e')};
  color: white;
  padding: 5px 7px;
  border: solid;
  border-width: 1px;
  border-color: transparent;
  border-radius: 3px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    ${props => (props.top ? '' : 'background-color: #6b686885; border-color: #cfcfcf;')}
  }
`;

const Triangle = styled.div`
  width: 0;
  height: 0;
  margin-top: 3px;
  margin-left: 11px;
  margin-right: 1px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 6px solid #ccc;
  transform: rotate(180deg);
`;

const TableLimit = styled.div`
  background: rgb(0, 0, 0, 0.7);
  width: ${(props) => {
    let width = '400px';
    if (window.orientation === 90 || window.orientation === -90) width = '400px';
    else if (isMobileOnly && !props.top) width = 'calc(100% - 8px)';
    else if (isTablet && !props.top) width = '50%';
    return width;
  }};
  position: absolute;
  ${(props) => {
    if (isMobile) {
      if ((window.orientation === 90 || window.orientation === -90) && !props.top) return 'top: 32px; left: 7px;';
      return props.top ? 'margin-top: 3px; top: 23px; right: 0;' : 'margin-top: 1px;';
    }
    return (props.top ? 'top: 26px; right: 0;' : 'top: 37px; left: 7px;');
  }};
  z-index: 10;
  padding: 5px;
`;

const TableContent = styled.div`
  background: #666666;
  padding: 4px;
  overflow: hidden;
  font-size: 13px;
  text-align: center;

  .line {
    position: absolute;
    top: 30px;
    height: 1px;
    width: 96%;
    background: #666666;
  }

  table {
    border-collapse: collapse;
    color: white;
    width: 100%;
  }
  tr {
    height: 24px;
  }
  td {
    border: 1px solid #666666;
    width: 25%;
  }

  td:first-child {
    width: 16%;
    border-left: none;
  }

  table > tr:last-child {
    td {
      border-bottom: none;
    }
  }

  thead > tr:nth-child(odd) {
    background-color: #333333;
  }

  tbody > tr:nth-child(odd) {
    background-color: #4a4a4a;
  }

  tbody > tr:nth-child(even) {
    background-color: #333333;
  }
`;

const convertLimitRange = (limitData, minValue, maxValue) => {
  if (limitData && limitData[minValue] && limitData[maxValue]) {
    return `${convertNumberBetRange(limitData[minValue])} - ${convertNumberBetRange(limitData[maxValue])}`;
  }
  return '';
};

export default class LimitBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetail: false,
    };
  }

  componentWillUnmount() {
  }

  render() {
    const { limitData, top, tableType } = this.props;
    const { isShowDetail } = this.state;

    const limitBP = convertLimitRange(limitData, 'baseMin', 'baseMax');

    const limitPair = convertLimitRange(limitData, 'pairMin', 'pairMax');

    const limitTie = convertLimitRange(limitData, 'tieMin', 'tieMax');

    const tableLimitText = `Bet range ${limitBP}`;

    return (
      <StyledContent>
        <ButtonLimit
          top={top}
          id="ButtonLimit"
          onMouseEnter={() => {
            this.setState({ isShowDetail: true });
          }}
          onMouseLeave={() => {
            this.setState({ isShowDetail: false });
          }}
          onClick={() => {
            this.setState({ isShowDetail: !isShowDetail });
          }}
        >
          {tableLimitText}
          <Triangle />
        </ButtonLimit>
        {
          isShowDetail && (
            <TableLimit top={top}>
              <TableContent>
                <div className="line" />
                <table>
                  <thead>
                    <tr>
                      <td>{tableType}</td>
                      <td>B/P</td>
                      <td>Pair</td>
                      <td>Tie</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Bet range</td>
                      <td>{limitBP}</td>
                      <td>{limitPair}</td>
                      <td>{limitTie}</td>
                    </tr>
                  </tbody>
                </table>
              </TableContent>
            </TableLimit>
          )
        }
      </StyledContent>
    );
  }
}
LimitBoard.defaultProps = {
  top: false,
};

LimitBoard.propTypes = {
  limitData: PropTypes.objectOf(PropTypes.any).isRequired,
  top: PropTypes.bool,
  tableType: PropTypes.string.isRequired,
};
