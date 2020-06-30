import React, { Component } from 'react';
import PropsType from 'prop-types';
import Pagination from 'rc-pagination';
import {
  WrapperTable, Row, Cell,
  RowHead, Table,
} from './ChargeStyle';
import { WrapperPaginationCustom, fontSize, SpanCharge } from '../common/CommonStyle';
import i18n from '../../i18n/i18n';
import StyleNumber from '../StyleNumber';

const PER_PAGE = 10;

const renderHeader = () => (
  <RowHead>
    <Cell>{i18n.t('date')}</Cell>
    <Cell>{i18n.t('botName')}</Cell>
    <Cell>{i18n.t('type')}</Cell>
    <Cell>{i18n.t('totalGC')}</Cell>
    <Cell>{i18n.t('after')}</Cell>
  </RowHead>
);

class HistoryPayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
    };

    this.fetchHistoryPayout = this.fetchHistoryPayout.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  componentDidMount() {
    this.fetchHistoryPayout();
  }

  fetchHistoryPayout() {
    const { currentPage } = this.state;
    this.props.fetchHistoryPayout(PER_PAGE, currentPage);
  }

  changePage(page) {
    this.setState({
      currentPage: page,
    }, () => { this.fetchHistoryPayout(); });
  }

  renderContent() {
    const { historyPayout } = this.props;
    return (
      Object.keys(historyPayout).length > 0
      && (
        <React.Fragment>
          {
            historyPayout.data.map((item, id) => {
              const itemName = item.is_deleted ? item.bot_id + i18n.t('botNameDeleted') : item.name;
              return (
                <Row backgroundColor={id % 2 === 0 ? '#555' : '#333'} key={item.id}>
                  <Cell textAlign="left">{item.date}</Cell>
                  <Cell textAlign="left">{itemName}</Cell>
                  <Cell textAlign="left">{i18n.t('payoutManually')}</Cell>
                  <Cell textAlign="right"><SpanCharge>{<StyleNumber value={item.payout} color="#fff" afterDot={2} />} GC</SpanCharge></Cell>
                  <Cell textAlign="right"><SpanCharge>{<StyleNumber value={item.gc_main_account} color="#fff" afterDot={2} />} GC</SpanCharge></Cell>
                </Row>
              );
            })
          }
        </React.Fragment>
      )
    );
  }

  render() {
    const { currentPage } = this.state;
    const { historyPayout } = this.props;
    const total = historyPayout.total ? Math.ceil(historyPayout.total / PER_PAGE) : 1;
    return (
      <React.Fragment>
        <WrapperTable>
          <Table width="50em">
            <tbody>
              {renderHeader()}
              {this.renderContent()}
            </tbody>
          </Table>
        </WrapperTable>
        {total > 1
          && (
            <WrapperPaginationCustom width={40} scale={fontSize / 18}>
              <Pagination
                current={currentPage}
                pageSize={PER_PAGE}
                total={historyPayout.total}
                onChange={(page) => { this.changePage(page); }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '1em',
                }}
              />
            </WrapperPaginationCustom>
          )}
      </React.Fragment>
    );
  }
}

HistoryPayout.defaultProps = {
  historyPayout: {},
};

HistoryPayout.propTypes = {
  historyPayout: PropsType.object,
  fetchHistoryPayout: PropsType.func.isRequired,
};

export default HistoryPayout;
