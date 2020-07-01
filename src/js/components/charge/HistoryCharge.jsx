import React, { Component } from 'react';
import PropsType from 'prop-types';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import { isMobile } from 'react-device-detect';
import {
  WrapperTable, Row, Cell, RowHead, Table, Button, ModalCustom, ModalHeaderCustom, ModalBodyCustom,
} from './ChargeStyle';
import { fontSize, scale, WrapperPaginationCustom, SpanCharge } from '../common/CommonStyle';
import i18n from '../../i18n/i18n';
import StyleNumber from '../StyleNumber';

const PER_PAGE = 10;

class HistoryCharge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      isOpenModalDetail: false,
      detail: [],
    };

    this.fetchHistoryCharge = this.fetchHistoryCharge.bind(this);
    this.openModalDetail = this.openModalDetail.bind(this);
    this.closeModalDetail = this.closeModalDetail.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  componentDidMount() {
    this.fetchHistoryCharge();
  }

  fetchHistoryCharge() {
    const { currentPage } = this.state;
    this.props.fetchHistoryCharge(PER_PAGE, currentPage);
  }

  changePage(page) {
    this.setState({
      currentPage: page,
    }, () => { this.fetchHistoryCharge(); });
  }

  openModalDetail(detail) {
    this.setState({
      isOpenModalDetail: true,
      detail,
    });
  }

  closeModalDetail() {
    this.setState({ isOpenModalDetail: false });
  }

  renderDetailModal() {
    const { isOpenModalDetail, detail } = this.state;
    const itemDetail = detail.map((item, index) => {
      const itemName = item.is_deleted ? item.bot_id + i18n.t('botNameDeleted') : item.name;
      return (
        <Row backgroundColor={index % 2 === 0 && '#555'} key={item.name} id="zzzzz">
          <Cell textAlign="left">{itemName}</Cell>
          <Cell
            borderRight="none"
            textAlign="right"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <StyleNumber value={item.GC} color="#fff" afterDot={2} />
          </Cell>
        </Row>
      );
    });

    return (
      <ModalCustom
        id="modal"
        centered
        isOpen={isOpenModalDetail}
        scale={scale || 1}
        fontSize={fontSize / 1.25}
      >
        <ModalHeaderCustom
          toggle={this.closeModalDetail}
        >{i18n.t('chargeHistory')}
        </ModalHeaderCustom>
        <ModalBodyCustom>
          <WrapperTable>
            <Table width="40em">
              <tbody>
                <RowHead>
                  <Cell width="50%">{i18n.t('botName')}</Cell>
                  <Cell width="50%" borderRight="none">{i18n.t('gc')}</Cell>
                </RowHead>
                {itemDetail}
              </tbody>
            </Table>
          </WrapperTable>
        </ModalBodyCustom>
      </ModalCustom>
    );
  }

  renderListHistory() {
    const { historyCharge } = this.props;
    return (
      Object.keys(historyCharge).length > 0
      && (
        <React.Fragment>
          {
            historyCharge.data.map((item, id) => (
              <Row backgroundColor={id % 2 === 0 ? '#555' : '#333'} key={item.id}>
                <Cell textAlign="left">{item.date}</Cell>
                <Cell textAlign="right">{item.total_bot}</Cell>
                <Cell textAlign="end"><SpanCharge>{<StyleNumber value={item.total_GC} color="#fff" afterDot={2} />} GC</SpanCharge></Cell>
                <Cell textAlign="end"><SpanCharge>{<StyleNumber value={item.after_GC} color="#fff" afterDot={2} />} GC</SpanCharge></Cell>
                <Cell borderRight="none"><Button minWidth={1} onClick={() => this.openModalDetail(item.detail)}>{i18n.t('detail')}</Button></Cell>
              </Row>
            ))
          }
        </React.Fragment>
      )
    );
  }

  render() {
    const { currentPage } = this.state;
    const { historyCharge } = this.props;
    const total = historyCharge.total ? Math.ceil(historyCharge.total / PER_PAGE) : 1;
    return (
      <React.Fragment>
        <WrapperTable>
          <Table isMobile={isMobile}>
            <tbody>
              <RowHead>
                <Cell>{i18n.t('date')}</Cell>
                <Cell>{i18n.t('totalBot')}</Cell>
                <Cell>{i18n.t('totalGC')}</Cell>
                <Cell>{i18n.t('after')}</Cell>
                <Cell borderRight="none">{i18n.t('')}</Cell>
              </RowHead>
              {this.renderListHistory()}
            </tbody>
          </Table>
        </WrapperTable>
        <WrapperPaginationCustom height={3} width={40} scale={fontSize / 18}>
          {total > 1
            && (
              <Pagination
                current={currentPage}
                pageSize={PER_PAGE}
                total={historyCharge.total}
                onChange={page => this.changePage(page)}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              />
            )}
        </WrapperPaginationCustom>
        {this.renderDetailModal()}
      </React.Fragment>
    );
  }
}

HistoryCharge.defaultProps = {
  historyCharge: {},
};

HistoryCharge.propTypes = {
  historyCharge: PropsType.object,
  fetchHistoryCharge: PropsType.func.isRequired,
};

export default HistoryCharge;
