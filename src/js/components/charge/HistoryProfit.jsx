import React, { Component } from 'react';
import PropsType from 'prop-types';
import Pagination from 'rc-pagination';
import {
  WrapperTable, Row, Cell, RowHead, Table,
} from './ChargeStyle';
import { WrapperPaginationCustom } from '../common/CommonStyle';
import i18n from '../../i18n/i18n';

const PER_PAGE = 10;
class HistoryProfit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
    };

    this.fetchHistoryProfit = this.fetchHistoryProfit.bind(this);
  }

  componentDidMount() {
    this.fetchHistoryProfit();
  }

  fetchHistoryProfit() {
    const { currentPage } = this.state;
    this.props.fetchHistoryProfit(PER_PAGE, currentPage);
  }

  changePage(page) {
    this.setState({
      currentPage: page,
    }, () => { this.fetchHistoryProfit(); });
  }

  renderListHistory() {
    const { historyProfit } = this.props;

    return (
      Object.keys(historyProfit).length > 0
        && (
        <React.Fragment>
          {

          historyProfit.map((item, id) => (
            <Row backgroundColor={id % 2 === 0 ? '#555' : '#333'} key={item.bot_name}>
              <Cell textAlign="left">{item.date}</Cell>
              <Cell textAlign="left">{item.bot_name}</Cell>
              <Cell textAlign="left">{item.action}</Cell>
              <Cell textAlign="right">{item.gc.toLocaleString('ja')} GC</Cell>
              <Cell borderRight="none" textAlign="right">{item.gc_main_account.toLocaleString('ja')} GC</Cell>
            </Row>
          ))
        }
        </React.Fragment>
        )
    );
  }

  render() {
    const { currentPage } = this.state;
    const sum = 1;
    return (
      <React.Fragment>
        <WrapperTable>
          <Table width="50em">
            <tbody>
              <RowHead>
                <Cell>{i18n.t('date')}</Cell>
                <Cell>{i18n.t('botName')}</Cell>
                <Cell>{i18n.t('profit')}</Cell>
                <Cell>{i18n.t('gc')}</Cell>
                <Cell borderRight="none">{i18n.t('after')}</Cell>
              </RowHead>
              {this.renderListHistory()}
            </tbody>
          </Table>
        </WrapperTable>
        { sum > 1
        && (
          <WrapperPaginationCustom>
            <Pagination
              current={currentPage}
              pageSize={PER_PAGE}
              total={sum}
              onChange={(page) => { this.changePage(page); }}
            />
          </WrapperPaginationCustom>
        )}
      </React.Fragment>
    );
  }
}

HistoryProfit.defaultProps = {
  historyProfit: [],
};

HistoryProfit.propTypes = {
  historyProfit: PropsType.object,
  fetchHistoryProfit: PropsType.func.isRequired,
};

export default HistoryProfit;
