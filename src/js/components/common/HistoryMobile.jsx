import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import showDetailBtn from '../../../assets/imgs/btn_show_detail.png';
import closeDropdownBtn from '../../../assets/imgs/close_dropdown.png';
import i18n from '../../i18n/i18n';
import {
  ValueContent, TitleContent, DataRow,
  RowCell, SubDataRow, ToggleBtn, DoubleBorder,
} from './History';

const TitleContentMb = styled(TitleContent)`
  padding: 0 0.75em;
`;

const Content = styled.div`
  background-color: #fff;
  padding: 5%;
  margin-top: 1em;
`;

const DataRowMb = styled(DataRow)`
  padding: 0 0.75em;
`;

const WrapperSubDataRow = styled.div`
  width: calc(100% - 2.75em);
  margin-left: 2em;
`;

const HeaderTitle = styled.div`
  font-size: 1.5em;
  font-weight: 700;
  text-align: center;
`;

const renderSubDataContent = (data) => {
  if (data || data.length > 0) {
    const subDataRows = data.map(rowData => (
      <SubDataRow key={rowData.bot_id}>
        <div>{rowData.dbac_code}</div>
        <ValueContent isRed={parseFloat(rowData.payoff) < 0}>{rowData.payoff}</ValueContent>
      </SubDataRow>
    ));

    return (
      <WrapperSubDataRow>{subDataRows}</WrapperSubDataRow>
    );
  }

  return null;
};

class HistoryMobile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rowDataIdsShowed: [],
    };

    this.handleToggleData = this.handleToggleData.bind(this);
  }

  componentDidMount() { }

  handleToggleData(index) {
    let { rowDataIdsShowed } = this.state;
    if (rowDataIdsShowed.includes(index)) {
      rowDataIdsShowed = rowDataIdsShowed.filter(item => index !== item);
    } else {
      rowDataIdsShowed = [...rowDataIdsShowed, index];
    }

    this.setState({ rowDataIdsShowed });
  }

  renderTitleRow() {
    return (
      <div>
        <TitleContentMb>
          <p>{this.props.labelText}</p>
          <p>{this.props.valueText}</p>
        </TitleContentMb>
        <DoubleBorder>
          <div />
          <div />
        </DoubleBorder>
      </div>
    );
  }

  renderDataRow(rowData, rowDataIdsShowed, index) {
    return (
      <div>
        <DataRowMb>
          <RowCell flex={4} align="flex-start">
            {
              (rowData.bot_data
                && (
                  <ToggleBtn
                    src={rowDataIdsShowed.includes(index) ? closeDropdownBtn : showDetailBtn}
                    alt="show-detail"
                    onClick={() => this.handleToggleData(index)}
                    isToggle={rowDataIdsShowed.includes(index)}
                  />
                )
              )
            }
            {rowData.date}
          </RowCell>
          <RowCell flex={4} align="flex-end">
            <ValueContent isRed={parseFloat(rowData.payoff) < 0}>{rowData.payoff}</ValueContent>
          </RowCell>
        </DataRowMb>
        {rowData.bot_data && rowDataIdsShowed.includes(index)
          && renderSubDataContent(rowData.bot_data)}
      </div>
    );
  }

  renderDataContent() {
    const { data } = this.props;

    const { rowDataIdsShowed } = this.state;
    if (data && data.length > 0) {
      const rows = data.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          {this.renderDataRow(item, rowDataIdsShowed, index)}
        </div>
      ));
      return (
        <div>{rows}</div>
      );
    }
    return null;
  }

  render() {
    return (
      <Content>
        <HeaderTitle>{i18n.t('history')}</HeaderTitle>
        {this.renderTitleRow()}
        {this.renderDataContent()}
      </Content>
    );
  }
}

HistoryMobile.defaultProps = {
  valueText: i18n.t('payoff'),
  labelText: i18n.t('date'),
  data: [],
};

HistoryMobile.propTypes = {
  data: PropTypes.array,
  valueText: PropTypes.string,
  labelText: PropTypes.string,
};

export default HistoryMobile;
