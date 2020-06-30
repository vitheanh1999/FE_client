import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Alert from '../../common/Alert/Alert';
import { Container } from '../gameTable/GameTable';
import {
  ContainerBoard, WrapperBoard, Blank, Board, BoardHeader, TableTitle,
  TableTitleEnd, TableContent, BoardRow, RowField, RowFieldRight, RowFieldRightEnd,
  LoadingContainer, CustomLoadingAnimation, LoadingNewTurn, SpinnerCustom,
  WrapperNotice, Span,
} from './HistoryStyles';
import { convertNumberGCShop } from '../../../helpers/utils';
import PaginationHistoryBot from '../../common/PaginationHistoryBot';
import { PER_PAGE, PER_PAGE_BOT_OFF } from '../../../constants/Constants';
import i18n from '../../../i18n/i18n';
import ApiErrorUtils from '../../../helpers/ApiErrorUtils';
import apiErrorCode from '../../../constants/apiErrorCode';
import StyleNumber from '../../StyleNumber';

export const convertResultToText = result => `P(${result.player}) B(${result.banker})`;

export const BET_CASE = {
  ZERO_BET: { value: 'zero_bet', id: 2 },
  LOOK_BET: { value: 'look_bet', id: 1 },
};

export const convertTime = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
  const date = new Date();
  const delta = date.getTimezoneOffset() * (-1);
  return time ? dayjs(time).add(delta, 'm').format(format) : '';
};

const convertSelectBetToText = (betData) => {
  if (betData.banker > 0 && betData.player > 0) return 'P,B';
  if (betData.banker > 0 && betData.player === 0) return 'B';
  if (betData.banker === 0 && betData.player > 0) return 'P';
  return 'B,P';
};

const getBetValue = (betData, payoff) => {
  if (payoff === null || payoff === undefined) return 'P(0) B(0)';
  const betBankerGCs = betData && betData.banker ? Number(betData.banker) : 0;
  const betPlayerGCs = betData && betData.player ? Number(betData.player) : 0;
  if (betPlayerGCs === 0 && betBankerGCs === 0) return 'P(0) B(0)';

  const bankerSelectText = betData.banker
    ? `B(${convertNumberGCShop(betBankerGCs).toLocaleString('ja')})`
    : '';
  const playerSelectText = betData.player
    ? `P(${convertNumberGCShop(betPlayerGCs).toLocaleString('ja')})`
    : '';
  return `${playerSelectText} ${bankerSelectText}`;
};

const convertPayoffToString = (payoff) => {
  if (!payoff) return <Span><StyleNumber value="0.0" color="#fff" afterDot={2} /></Span>;
  if (payoff < 0) return <Span><StyleNumber value={payoff} color="#fff" afterDot={2} /></Span>;
  return <Span>+<StyleNumber value={payoff} color="#fff" afterDot={2} /></Span>;
};

const checkCaseBet = (item) => {
  if (item.reason_zero_bet_banker === BET_CASE.LOOK_BET.value
    || item.reason_zero_bet_player === BET_CASE.LOOK_BET.value) return BET_CASE.LOOK_BET.id;
  if (item.reason_zero_bet_banker === BET_CASE.ZERO_BET.value
    || item.reason_zero_bet_player === BET_CASE.ZERO_BET.value) return BET_CASE.ZERO_BET.id;

  return 0;
};

const renderContent = (data, scale, WIDTH) => data.map((item, index) => {
  const key = index;
  return (
    <BoardRow
      index={index}
      key={key}
      scale={scale}
    >
      <RowField paddingLeft={2} width={WIDTH.timeWidth} scale={scale} align="end">{convertTime(item.time)}</RowField>
      <RowField paddingLeft={5} width={WIDTH.resultWidth} scale={scale} align="end">{convertResultToText(item.result)}</RowField>
      {checkCaseBet(item) === BET_CASE.LOOK_BET.id && (
        <React.Fragment>
          <RowField paddingLeft={10} width={WIDTH.selectWidth} scale={scale} align="end">{i18n.t('lookBet').toUpperCase()}</RowField>
          <RowFieldRight width={WIDTH.betWidth} scale={scale} align="end">-</RowFieldRight>
        </React.Fragment>
      )}
      {checkCaseBet(item) === BET_CASE.ZERO_BET.id && (
        <React.Fragment>
          <RowField paddingLeft={10} width={WIDTH.selectWidth} scale={scale} align="end">{i18n.t('zeroBet').toUpperCase()}</RowField>
          <RowFieldRight width={WIDTH.betWidth} scale={scale} align="end">0</RowFieldRight>
        </React.Fragment>
      )}
      {checkCaseBet(item) === 0 && (
        <React.Fragment>
          <RowField paddingLeft={10} width={WIDTH.selectWidth} scale={scale} align="end">{convertSelectBetToText(item.select)}</RowField>
          <RowFieldRight width={WIDTH.betWidth} scale={scale} align="end">{getBetValue(item.select, item.payoff)}</RowFieldRight>
        </React.Fragment>
      )}
      <RowFieldRightEnd scale={scale} align="flex-end">{convertPayoffToString(item.payoff)}</RowFieldRightEnd>
    </BoardRow>
  );
});

const renderLoading = (scale, isOff) => (
  <LoadingContainer>
    <CustomLoadingAnimation id="LoadingAnimation" scale={scale} isOff={isOff}>Loading ...</CustomLoadingAnimation>
  </LoadingContainer>
);

const renderResultNewTurnLoading = scale => (
  <BoardRow scale={scale}>
    <LoadingNewTurn scale={scale}>
      <SpinnerCustom animation="border" variant="secondary" />
      <span>Loading new turn</span>
    </LoadingNewTurn>
  </BoardRow>
);

class HistoryBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoadingNewTurn: false,
      currentPage: 1,
      lastPage: 1,
      isLoading: false,
      sessionTimeOut: false,
    };
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.onSuccessFetchBotGCNow = this.onSuccessFetchBotGCNow.bind(this);
    this.onErrorFetchBotGCNow = this.onErrorFetchBotGCNow.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    this.fetchBotGCNow();
    const { currentPage } = this.state;
    const { fetchBotHistoryNow, botInfo } = this.props;
    const perPage = botInfo.status ? PER_PAGE : PER_PAGE_BOT_OFF;
    if (botInfo && botInfo.id !== undefined && botInfo.id !== null) {
      fetchBotHistoryNow(botInfo.id, currentPage, perPage, this.onSuccess, this.onError);
    }
  }

  onSuccess(data) {
    this.setState({ isLoadingNewTurn: false, isLoading: false });
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      if (data && data.data) {
        this.setState({
          data: data.data.histories,
          lastPage: data.data.last_page,
        });
        if (data.data.histories) {
          const money = data.data.total_money;
          const { updateMoney /* , changeTable, nameTable */ } = this.props;
          updateMoney(money);
        }
      }
    }, null);
  }

  onError(error) {
    ApiErrorUtils.handleHttpError(error, Alert.instance, null);
    let { sessionTimeOut } = this.state;
    const { response } = error;
    if (response && response.status === apiErrorCode.UNAUTHORIZED) {
      sessionTimeOut = true;
    }

    this.setState({ isLoadingNewTurn: false, isLoading: false, sessionTimeOut });
  }

  onSuccessFetchBotGCNow(data) {
    if (data && data.total_money) {
      this.props.updateMoney(data.total_money);
    }
    if (this.props.updateIsBetting !== null) {
      this.props.updateIsBetting(data.is_betting);
    }
  }

  onErrorFetchBotGCNow(error) {
    const { response } = error;
    if (response && response.status === apiErrorCode.UNAUTHORIZED) {
      this.setState({ sessionTimeOut: true });
    }
    ApiErrorUtils.handleHttpError(error, Alert.instance, null);
  }

  clickPage(page) {
    this.setState({
      currentPage: page,
      isLoading: true,
    });
    const { botInfo } = this.props;
    const perPage = botInfo.status ? PER_PAGE : PER_PAGE_BOT_OFF;
    this.props.fetchBotHistoryNow(
      botInfo.id,
      page,
      perPage,
      this.onSuccess,
      this.onError,
    );
  }

  updateHistory() {
    const { currentPage, sessionTimeOut } = this.state;
    if (sessionTimeOut) return;
    const { fetchBotHistoryNow, botInfo } = this.props;
    this.setState({ isLoadingNewTurn: true });
    if (botInfo && botInfo.id !== undefined && botInfo.id !== null) {
      const perPage = botInfo.status ? PER_PAGE : PER_PAGE_BOT_OFF;
      fetchBotHistoryNow(botInfo.id, currentPage, perPage, this.onSuccess, this.onError);
    }
  }

  fetchBotGCNow() {
    const { sessionTimeOut } = this.state;
    if (sessionTimeOut) return;
    const { botInfo } = this.props;
    this.props.fetchBotGCNow(
      botInfo.id,
      this.onSuccessFetchBotGCNow,
      this.onErrorFetchBotGCNow,
    );
  }

  render() {
    const {
      data, isLoadingNewTurn, lastPage, currentPage, isLoading,
    } = this.state;
    const { scale, botInfo } = this.props;
    const isOff = !botInfo.status;

    const WIDTH = {
      timeWidth: isOff ? 280 : 140,
      resultWidth: isOff ? 162 : 81,
      selectWidth: isOff ? 160 : 95,
      betWidth: isOff ? 280 : 125,
    };
    return (
      <WrapperBoard id="HistoryBoard" scale={scale} isOff={isOff}>
        {
          !!data && currentPage === lastPage && (
            <WrapperNotice scale={scale}>
              {i18n.t('checkHistoryLast30days')}
            </WrapperNotice>
          )
        }
        {botInfo.status ? <Container scale={scale} /> : ''}
        <ContainerBoard scale={scale}>
          <Blank scale={scale} />
          <Board scale={scale}>
            <BoardHeader scale={scale}>
              <TableTitle width={WIDTH.timeWidth} scale={scale} justifyContent="center">{i18n.t('time')}</TableTitle>
              <TableTitle width={WIDTH.resultWidth} scale={scale} justifyContent="center">{i18n.t('result')}</TableTitle>
              <TableTitle width={WIDTH.selectWidth} scale={scale} justifyContent="center">{i18n.t('select')}</TableTitle>
              <TableTitle width={WIDTH.betWidth} scale={scale} justifyContent="center">{i18n.t('bet')}</TableTitle>
              <TableTitleEnd scale={scale}>{i18n.t('payOffHistory')}</TableTitleEnd>
            </BoardHeader>
            <TableContent scale={scale} isOff={isOff}>
              {
                isLoadingNewTurn ? renderResultNewTurnLoading(scale) : null
              }
              {
                data && !isLoading ? renderContent(data, scale, WIDTH) : renderLoading(scale, isOff)
              }
            </TableContent>
          </Board>
          {
            lastPage > 1 ? (
              <PaginationHistoryBot
                scale={scale}
                currentPage={this.state.currentPage}
                sum={lastPage}
                onChange={(page) => { this.clickPage(page); }}
                customStyle={{ paddingBottom: 0, width: '100%', marginTop: 2 }}
              />
            ) : ''
          }
        </ContainerBoard>
      </WrapperBoard>
    );
  }
}

HistoryBoard.propTypes = {
  scale: PropTypes.number.isRequired,
  fetchBotHistoryNow: PropTypes.func.isRequired,
  botInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  updateMoney: PropTypes.func.isRequired,
  changeTable: PropTypes.func.isRequired,
  nameTable: PropTypes.string.isRequired,
  fetchBotGCNow: PropTypes.func.isRequired,
  updateIsBetting: PropTypes.func,
};

HistoryBoard.defaultProps = {
  updateIsBetting: null,
};

export default HistoryBoard;
