import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Block from './Block';
import i18n from '../../i18n/i18n';
import StyleNumber from '../StyleNumber';

export const ValueContent = styled.div`
  color: ${props => (props.isRed ? 'red' : '#ffffff')};
`;

export const TitleContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 110%;
  font-weight: 700;
  padding: 0 2.75em;

  p {
    margin: 0 !important;
  }
`;

const Content = styled.div`
  height: 100%;
  padding: 0.75em 1.5em;
`;

export const DataRow = styled.div`
  width: 100%;
  border-bottom: solid 1px grey;
  display: flex;
  justify-content: space-between;
  padding: 0.2em 2.75em;
  font-size: 0.9em;
  font-weight: 550;
`;

export const RowCell = styled.div`
  flex: ${props => props.flex};
  display: flex;
  height: 100%;
  justify-content: ${props => props.align};
  align-items: center;
`;

export const SubDataRow = styled.div`
  width: 100%;
  border-bottom: solid 1px #7aa5ea;
  display: flex;
  margin-top: 0.25em;
  justify-content: space-between;
`;

export const ToggleBtn = styled.img`
  width: ${props => (props.isToggle ? 1.11 : 0.94)}em;
  height: ${props => (props.isToggle ? 0.94 : 1.11)}em;
  margin-right: 0.5em;
  cursor: pointer;
  transform: ${props => (props.isToggle ? 'rotate(180deg)' : '')};
`;

export const DoubleBorder = styled.div`
  margin-bottom: 0.5em;

  div {
    width: 100%;
    border: solid 1px grey;
  }

  & > div:not(:last-child) {
    margin-bottom: 3px;
  }
`;

const renderDataRow = (rowData) => {
  const { payoff } = rowData;
  return (
    <div>
      <DataRow>
        <RowCell flex={4} align="flex-start">
          {rowData.date}
        </RowCell>
        <RowCell flex={4} align="flex-end">
          <ValueContent isRed={parseFloat(payoff) < 0}>
            <StyleNumber value={rowData.payoff} color={rowData.payoff < 0 ? '#ff5a5a' : '#fff'} afterDot={2} />
          </ValueContent>
        </RowCell>
      </DataRow>
    </div>
  );
};

class History extends Component {
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
        <TitleContent>
          <p>{this.props.labelText}</p>
          <p>{this.props.valueText}</p>
        </TitleContent>
        <DoubleBorder>
          <div />
          <div />
        </DoubleBorder>
      </div>
    );
  }

  renderDataContent() {
    const { data } = this.props;
    if (data && data.length > 0) {
      const rows = data.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          {renderDataRow(item)}
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
      <Block
        title={i18n.t('history')}
        content={
          (
            <Content>
              {this.renderTitleRow()}
              {this.renderDataContent()}
            </Content>
          )
        }
      />
    );
  }
}


History.defaultProps = {
  valueText: i18n.t('payoff'),
  labelText: i18n.t('dateUTC'),
  data: [],
};

History.propTypes = {
  data: PropTypes.array,
  valueText: PropTypes.string,
  labelText: PropTypes.string,
};

export default History;
