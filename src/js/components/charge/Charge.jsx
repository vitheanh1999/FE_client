import React, { Component } from 'react';
import PropsType from 'prop-types';
import { ContentContainer, ContentHeader, MedianStrip, WrapperSpan } from '../common/CommonStyle';
import {
  ContentBody, Button, ModalHeaderCustom, ModalCustom,
} from './ChargeStyle';
import i18n from '../../i18n/i18n';
import ChargeListBot from './ChargeListBot';
import ChargeHistoryModal from './ChargeHistoryModal';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import { SORT_BOT_OPTIONS, PER_PAGE } from '../../constants/Constants';
import Alert from '../common/Alert/Alert';
import Spinner from '../common/Spinner';
import StyleNumber from '../StyleNumber';

const browserZoomLevel = window.devicePixelRatio;
const scale = 1.5 * window.innerWidth * browserZoomLevel / 1920;

class Charge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isOpenHistoryModal: false,
      currentPage: 1,
      sortBy: SORT_BOT_OPTIONS[0].value,
    };
    this.fetchListBots = this.fetchListBots.bind(this);
    this.onSuccessFetchBots = this.onSuccessFetchBots.bind(this);
    this.onErrorFetchBots = this.onErrorFetchBots.bind(this);
    this.openHistoryModal = this.openHistoryModal.bind(this);
    this.closeHistoryModal = this.closeHistoryModal.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.sortBot = this.sortBot.bind(this);
  }


  componentDidMount() {
    this.fetchListBots();
  }

  onSuccessFetchBots(data) {
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => { },
    );
    this.setState({ isLoading: false });
  }

  onErrorFetchBots(error) {
    ApiErrorUtils.handleHttpError(error, Alert.instance);
    this.setState({ isLoading: false });
  }

  onChangePage(page) {
    this.setState({
      currentPage: page,
    }, () => { this.fetchListBots(); });
  }

  openHistoryModal() {
    this.setState({
      isOpenHistoryModal: true,
    });
  }


  sortBot(sortBy) {
    this.setState({
      sortBy,
    }, () => { this.fetchListBots(); });
  }

  closeHistoryModal() {
    this.setState({
      isOpenHistoryModal: false,
    });
  }

  fetchListBots() {
    this.setState({ isLoading: true });
    const { currentPage, sortBy } = this.state;
    const params = {
      sortBy,
      currentPage,
      perPage: PER_PAGE,
    };
    this.props.fetchListBots(this.onSuccessFetchBots, this.onErrorFetchBots, params);
  }

  renderHistoryModal() {
    const { isOpenHistoryModal } = this.state;
    const {
      fontSize, fetchPayoutHistory,
      getGiftHistory, isMobile,
    } = this.props;
    return (
      <ModalCustom
        id="modal-view-mode"
        centered
        isOpen={isOpenHistoryModal}
        scale={scale || 1}
        fontSize={fontSize / 1.25}
        isMobile={isMobile}
      >
        <ModalHeaderCustom toggle={this.closeHistoryModal}>
          {i18n.t('history')}
        </ModalHeaderCustom>
        <ChargeHistoryModal
          fetchPayoutHistory={fetchPayoutHistory}
          getGiftHistory={getGiftHistory}
        />
      </ModalCustom>
    );
  }

  render() {
    const {
      listBots, total, lucUserGC,
      isMobile, gift,
    } = this.props;
    const listBotOff = [];
    if (listBots.length !== 0) {
      listBots.map(((item) => {
        if (item.status === 0) listBotOff.push(item);
        return true;
      }));
    }
    const { currentPage, isLoading } = this.state;
    return (
      <ContentContainer>
        <ContentHeader>
          <WrapperSpan>{i18n.t('lucMainAccountGC')}: <StyleNumber afterDot={2} color="#fff" value={lucUserGC} /> GC</WrapperSpan>
          <Button onClick={this.openHistoryModal}>{i18n.t('history')}</Button>
        </ContentHeader>
        <MedianStrip />
        <ContentBody>
          <ChargeListBot
            lucUserGC={lucUserGC}
            listBot={listBots}
            listBotOff={listBotOff}
            sortBot={this.sortBot}
            fontSize={this.props.fontSize}
            scale={scale}
            fetchListBots={this.fetchListBots}
            currentPage={currentPage}
            total={total}
            onChangePage={this.onChangePage}
            isMobile={isMobile}
            gift={gift}
          />
        </ContentBody>
        {this.renderHistoryModal()}
        <Spinner isLoading={isLoading} />
      </ContentContainer>
    );
  }
}

Charge.defaultProps = {
  listBots: [],
  total: 0,
  lucUserGC: 0,
};

Charge.propTypes = {
  listBots: PropsType.array,
  fetchListBots: PropsType.func.isRequired,
  fontSize: PropsType.number.isRequired,
  fetchPayoutHistory: PropsType.func.isRequired,
  getGiftHistory: PropsType.func.isRequired,
  total: PropsType.number,
  lucUserGC: PropsType.number,
  isMobile: PropsType.bool.isRequired,
  gift: PropsType.func.isRequired,
};

export default Charge;
