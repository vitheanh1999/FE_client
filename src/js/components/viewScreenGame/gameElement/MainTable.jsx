import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UserInfo from './UserInfo';
import HistoryBoard from './HistoryBoard';

export const TotalContent = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Icon = styled.img`
  width: 15px;
  height: 15px;
  margin-left: 3px;
`;

const WoodPlane = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: ${props => props.scale * 100}px;
  left: 0;
  right: 0;
  top: 0;
  margin-left: auto;
  margin-right: auto;
`;

export const TotalBetText = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  top: ${props => props.scale * 323}px;
  align-items: center;
  color: #fff;
  font-size: ${props => props.scale * 15}px;
  margin-right: ${props => props.scale * 10}px;
  user-select: none;
  flex-direction: column;

  & > span {
    font-weight: bold;
    color: #90cb77;
  }

  & > div > span {
    font-weight: bold;
    margin-left: ${props => props.scale * 5}px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

class MainTable extends Component {
  constructor(props) {
    super(props);
    const { botInfo } = this.props;
    this.state = {
      timeDown: 0,
      isRunTime: false,
      currentMoney: botInfo.GC,
    };
    this.interval = null;
    this.gameTableRef = React.createRef();
    this.isCounting = false;
    this.toastRef = React.createRef();
    this.historyRef = React.createRef();
    this.updateMoney = this.updateMoney.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.stop();
  }

  setStatus(_timeDown, _isRunTime) {
    this.setState({ timeDown: _timeDown, isRunTime: _isRunTime }, () => {
      if (_timeDown > 0) this.startTimer();
    });
  }

  getStatus() {
    const { timeDown } = this.state;
    return timeDown;
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { isRunTime } = this.state;
    if (!newProps.isDeal && isRunTime) {
      this.stop();
    } else if (!isRunTime && newProps.isDeal) {
      this.setState({ timeDown: newProps.timeTurn, isRunTime: true }, () => { this.startTimer(); });
    }
  }

  showWinLose(money) {
  }

  startTimer() {
    this.isCounting = true;
    const { timeDown } = this.state;
    const { timeOut } = this.props;
    let time = timeDown;
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      time -= 1;
      if (time > 0) {
        this.setState({ timeDown: time });
      } else if (time === 0) {
        this.setState({ timeDown: time });
        this.isCounting = false;
        timeOut();
      } else {
        this.stop();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({ timeDown: 0, isRunTime: false });
    this.isCounting = false;
  }

  updateMoney(value) {
    if (value !== null && value !== undefined) {
      this.setState({ currentMoney: value });
    }
  }

  render() {
    const {
      handleChangeSelectChip, userInfo, eventData, tableChipTypes,
      width, botInfo, changeTable, nameTable,
    } = this.props;
    const { currentMoney } = this.state;
    const scale = width / 1060;
    return (
      <WoodPlane id="MainTable" scale={scale}>
        {
          <HistoryBoard
            scale={scale}
            fetchBotHistoryNow={this.props.fetchBotHistoryNow}
            botInfo={botInfo}
            ref={this.historyRef}
            updateMoney={this.updateMoney}
            changeTable={changeTable}
            nameTable={nameTable}
            fetchBotGCNow={this.props.fetchBotGCNow}
            updateIsBetting={this.props.updateIsBetting}
          />
        }
        {
          <UserInfo
            data={userInfo}
            eventData={eventData}
            tableChipTypes={tableChipTypes}
            handleChangeSelectChip={handleChangeSelectChip}
            scale={scale}
            botInfo={botInfo}
            currentMoney={currentMoney}
          />
        }
      </WoodPlane>
    );
  }
}

MainTable.propTypes = {
  timeOut: PropTypes.func.isRequired,
  eventData: PropTypes.objectOf(PropTypes.any),
  tableChipTypes: PropTypes.arrayOf(PropTypes.any),
  handleChangeSelectChip: PropTypes.func,
  width: PropTypes.number.isRequired,
  botInfo: PropTypes.objectOf(PropTypes.any),
  fetchBotHistoryNow: PropTypes.func.isRequired,
  changeTable: PropTypes.func.isRequired,
  nameTable: PropTypes.string.isRequired,
  fetchBotGCNow: PropTypes.func.isRequired,
  updateIsBetting: PropTypes.func,
};

MainTable.defaultProps = {
  eventData: null,
  tableChipTypes: [],
  handleChangeSelectChip: () => {},
  botInfo: null,
  updateIsBetting: null,
};

export default MainTable;
