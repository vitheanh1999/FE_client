import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { isMobile } from 'react-device-detect';
// import StorageUtils, { STORAGE_KEYS } from '../../helper/StorageUtils';
// import ApiErrorUtils from '../../helper/ApiErrorUtils';
// import PopupManager from '../common/PopupManager';
// import TimeZone from '../help/TimeZone';
import { convertNumber } from '../Utils';

const Img = styled.img`
  width: 15px;
  height: 15px;
  margin-left: 5px;
`;

export const StyledListBetting = styled.div`
  font-weight: 700;
  display: flex;
  flex: 1;
  flex-direction: row-reverse;

  & > div {
    flex: 2;
  }
`;

const ActionWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  margin-top: 390px;
  left: -578px;
  margin-left: auto;
  margin-right: auto;
  width: 1060px;
`;

export const StyledButton = styled.button`
  margin-left: 3px;
  z-index: 2;
  cursor: pointer;
  margin-right: 3px;
  background-color: #237001;
  color: #fff;
  border-radius: 15px;
  font-size: 10px;
  border: none;
  padding: 3px;
  flex: 0 55px;
`;

const WrapperView = styled.div`
  color: #666;
  display: flex;
  width: 480px;
  height: 23px;
  position: absolute;
  align-content: center;
  align-items: center;
  background: #eee;
  padding: 1px;
`;

export const StyledItemsBetting = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  font-size: 11px;
  border-left: 2px solid #c6c6c6;
  background: ${props => (props.winOrLose > 0 ? '#ffe537' : '')};
  color: ${props => (props.winOrLose > 0 ? '#222' : '#666')};
  height: 1vh;

  &#P,
  &#P_P {
    > span {
      color: #01019f;
    }
  }

  &#B,
  &#B_P {
    > span {
      color: #cf0101;
    }
  }

  &#T {
    > span {
      color: #64a700;
    }
  }

  &.limit {
    flex: 0 20px;
  }
`;

export const handleInput = (select, value, chipCategoryId) => ({
  payoff: value,
  select: {
    [select]: Math.abs(value) + 1,
  },
  chip_category_id: chipCategoryId,
});

export const itemView = (item, index, chipCategory) => {
  const selectBet = item.select;
  let resultSelect = '';

  if (selectBet.p_pair !== undefined && selectBet.p_pair > 0) {
    resultSelect += ',P.P';
  }
  if (selectBet.banker !== undefined && selectBet.banker > 0) {
    resultSelect += ',B';
  }
  if (selectBet.b_pair !== undefined && selectBet.b_pair > 0) {
    resultSelect += ',B.P';
  }
  if (selectBet.tie !== undefined && selectBet.tie > 0) {
    resultSelect += ',T';
  }
  if (selectBet.player !== undefined && selectBet.player > 0) {
    resultSelect += ',P';
  }
  resultSelect = resultSelect.slice(1, resultSelect.length);
  const itemPayOff = item.payoff >= 0 ? `+${convertNumber(item.payoff)}` : convertNumber(item.payoff);
  const url = chipCategory && chipCategory.find(i => i.id === item.chip_category_id)
    && chipCategory.find(i => i.id === item.chip_category_id).icon;
  return (
    <StyledItemsBetting key={index} winOrLose={item.payoff} id={resultSelect.replace('.', '_')}>
      <span>{resultSelect}</span>
      {itemPayOff}
      {url && <Img src={url} alt="icon" />}
    </StyledItemsBetting>
  );
};

class BettingHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listHistory: [],
      offset: 5,
      currentPage: 1,
    };

    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  onSuccess(data) {
    const { getAlertRef } = this.props;
    const alert = getAlertRef();
    // ApiErrorUtils.handleServerError(data, alert, () => {
    //   this.setState({ listHistory: data.data });
    // });
  }

  onError(error) {
    const { getAlertRef } = this.props;
    const alert = getAlertRef();
    // ApiErrorUtils.handleHttpError(error, alert);
  }

  fetchData() {
    // const { offset, currentPage } = this.state;
    // const { nameTable, fetchData, tableId } = this.props;
    // if (!nameTable) {
    //   fetchData(
    //     this.onSuccess,
    //     this.onError,
    //     offset, currentPage,
    //     StorageUtils.getUserItem(STORAGE_KEYS.lastTableName), TimeZone.getTimeZone(),
    //     StorageUtils.getUserItem(STORAGE_KEYS.lastTableDataObject).id,
    //   );
    // } else {
    //   fetchData(
    //     this.onSuccess,
    //     this.onError,
    //     offset, currentPage,
    //     nameTable, TimeZone.getTimeZone(), tableId,
    //   );
    // }
  }

  updateListHistory(data) {
    const { listHistory } = this.state;
    const listItems = data.transactions;
    if (!listItems.length) return;
    listItems.map(key => listHistory.unshift(
      handleInput(key.select, key.value, key.chip_category_id),
    ));

    if (listHistory.length > 5) {
      listHistory.splice(5);
    }
    this.setState({
      listHistory,
    });
  }

  render() {
    const { listHistory } = this.state;
    const { nameTable, tableId, chipCategory } = this.props;
    const listItems = listHistory.length > 0
      ? listHistory.map((item, index) => itemView(item, index, chipCategory)) : [];
    while (listItems.length < 5 && listItems.length > 0) {
      listItems.push(<StyledItemsBetting key={listItems.length} />);
    }
    return (
      <ActionWrapper id="betting-history">
        <WrapperView>
          <StyledButton
            onClick={() => {
              // if (isMobile === false) PopupManager.instance.showGameHistory(nameTable, tableId);
            }}
            onTouchStart={() => {
              // if (isMobile === true) PopupManager.instance.showGameHistory(nameTable, tableId);
            }}
          >
            {'history'}
          </StyledButton>
          <StyledListBetting>
            {listItems}
          </StyledListBetting>
          <StyledItemsBetting className="limit">==</StyledItemsBetting>
        </WrapperView>
      </ActionWrapper>
    );
  }
}

BettingHistory.propTypes = {
  nameTable: PropTypes.string.isRequired,
  // fetchData: PropTypes.func.isRequired,
  getAlertRef: PropTypes.func.isRequired,
  tableId: PropTypes.number.isRequired,
  chipCategory: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default BettingHistory;
