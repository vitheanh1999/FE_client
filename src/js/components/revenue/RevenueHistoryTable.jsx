import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Table, Column, Cell, CellHeader, ScrollPart,
} from './RevenueStyle';
import i18n from '../../i18n/i18n';
import StyleNumber from '../StyleNumber';

const CellOddColor = '#444';
const CellEvenColor = '#393939';
const TextRedColor = '#ff5a5a';
const TotalRowColor = '#1d1c1c';

const renderCellData = (data, idsSelected) => (
  <React.Fragment>
    {
      data.bot_data.map((item, index) => (
        <Fragment>
          {idsSelected === -1 && item.showTotal
            ? (
              <Cell
                backgroundColor={TotalRowColor}
                color={parseFloat(data.payoff) < 0 ? TextRedColor : 'unset'}
                justifyContent="flex-end"
              >
                <StyleNumber
                  value={item.payoff}
                  afterDot={2}
                  color={item.payoff < 0 ? '#ff5a5a' : '#fff'}
                />
              </Cell>
            ) : (
              <Cell
                key={item.bot_id}
                backgroundColor={index % 2 === 0 ? CellOddColor : CellEvenColor}
                color={parseFloat(item.payoff) < 0 ? TextRedColor : 'unset'}
                justifyContent="flex-end"
              >
                <StyleNumber
                  value={item.payoff}
                  afterDot={2}
                  color={item.payoff < 0 ? '#ff5a5a' : '#fff'}
                />
              </Cell>
            )
          }
        </Fragment>
      ))
    }
  </React.Fragment>
);

class RevenueHistoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderDataTable() {
    const { dataPayOff, idsSelected } = this.props;
    let showTotalIndex = 0;
    const dataPayOffAll = JSON.parse(JSON.stringify(dataPayOff));

    const listBots = dataPayOff[0] && dataPayOff[0].bot_data
      ? dataPayOff[0].bot_data.map((item, index) => {
        const botName = item.is_deleted ? item.bot_id + i18n.t('botNameDeleted') : item.name;
        if (!item.is_deleted) {
          showTotalIndex = index + 1;
        }
        if (item.showTotal) {
          return { showTotal: true };
        }
        return {
          botName,
          showTotalIndex,
        };
      }) : [];
    if (idsSelected === -1 && dataPayOffAll[0] && dataPayOffAll[0].bot_data) {
      listBots.splice(showTotalIndex, 0, { showTotal: true });
      dataPayOffAll.forEach((item) => {
        item.bot_data.splice(showTotalIndex, 0, { payoff: item.payoff, showTotal: true });
      });
    }
    const botNameColumnWidth = dataPayOff ? 100 / (dataPayOff.length + 1) : 1;
    return (
      <React.Fragment>
        <Column width={botNameColumnWidth}>
          <CellHeader>{i18n.t('botName')}</CellHeader>
          {
            listBots.map((item, index) => (
              <Fragment>
                {idsSelected === -1 && item.showTotal
                  ? (
                    <Cell justifyContent="end" backgroundColor={TotalRowColor}>{i18n.t('revenueTotalGC')}</Cell>)
                  : (
                    <Cell
                      backgroundColor={index % 2 === 0 ? CellOddColor : CellEvenColor}
                      key={item.botName}
                      justifyContent="end"
                    >
                      {item.botName}
                    </Cell>
                  )}
              </Fragment>
            ))
          }
        </Column>
        <ScrollPart width={100 - botNameColumnWidth}>
          {
            dataPayOffAll.map(item => (
              <Column key={item.date}>
                <CellHeader>{item.date}</CellHeader>
                {renderCellData(item, idsSelected)}
              </Column>
            ))
          }
        </ScrollPart>
      </React.Fragment>
    );
  }

  render() {
    const { dataPayOff } = this.props;
    return (
      Object.keys(dataPayOff).length !== 0
        ? (
          <Table id="table revenue">
            {this.renderDataTable()}
          </Table>
        ) : null

    );
  }
}

RevenueHistoryTable.defaultProps = {
};

RevenueHistoryTable.propTypes = {
  dataPayOff: PropTypes.any.isRequired,
  idsSelected: PropTypes.number.isRequired,
};

export default RevenueHistoryTable;
