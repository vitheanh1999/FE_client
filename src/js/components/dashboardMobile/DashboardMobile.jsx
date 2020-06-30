import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import {
  TAB, getMinDate, FORMAT_DATE, SORT_BOT_OPTIONS, BOT_STATUSES,
} from '../../constants/Constants';
import { images } from '../../theme';
import i18n from '../../i18n/i18n';
import Spinner from '../common/Spinner';
import MyTooltip from '../common/Tooltip';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import Alert from '../common/Alert/Alert';
import {
  ContentWrapper,
  GcText,
  LineChartOptions, ChartArea,
  Container, TitleStyled, WrapperKeyStyled,
  BotStatusBtnStyled, StatusImgStyled, DepositContentStyled,
  DepositStatusesBtn, WrapperBurstStatusBtn, InformationImgStyled,
  ImageStyled, DivFullHeight, SpanLastUpdate, TooltipCustom, ListBotWrapper,
  OnOffBotStatus, NumberBotOn, NumberBotOff, TitleWrapper, NumberBotWrapper, StatusBot,
} from './DashboardMobileStyled';

const BLOCK_IDS = {
  REVENUE: 3,
  KEY_LIST: 4,
  BURST_GUARD: 5,
  DEPOSIT: 6,
};

const renderBots = bots => bots.map(bot => (
  <WrapperKeyStyled key={bot.id}>
    <BotStatusBtnStyled
      src={bot.status !== BOT_STATUSES.OFF ? images.btnOnBot : images.btnOffBot}
      alt="on bot btn"
    />
    <div id="key-name">{bot.dbac_code}</div>
  </WrapperKeyStyled>
));

class DashboardMobile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openBurstTicketTooltip: false,
      openDepositTooltip: false,
      endDate: moment().format(FORMAT_DATE),
      startDate: (getMinDate() < moment().add(-4, 'd').format(FORMAT_DATE))
        ? moment().add(-4, 'd').format(FORMAT_DATE)
        : getMinDate(),
      isLoading: false,
      countSuccess: 0,
    };

    this.scale = 1;
    this.handleToggle = this.handleToggle.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentWillMount() {
    this.scale = window.innerWidth / 992;
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    const { startDate, endDate } = this.state;
    this.props.fetchChartData(
      -1, startDate, endDate,
      () => { this.onSuccess(); },
      this.onError,
    );
    this.props.fetchListBots(SORT_BOT_OPTIONS[1].value, () => { this.onSuccess(); }, this.onError);
  }

  onSuccess() {
    const { countSuccess } = this.state;
    let count = countSuccess;
    count += 1;
    if (count >= 2) {
      this.setState({
        isLoading: false,
      });
    }
    this.setState({
      countSuccess: count,
    });
  }

  onError(error) {
    try {
      ApiErrorUtils.handleHttpError(error, Alert.instance, () => { });
    } catch (err) {
      // do something
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }

  handleToggle(id) {
    const { handleChangeTab } = this.props;
    switch (id) {
      case BLOCK_IDS.REVENUE: {
        handleChangeTab(TAB.REVENUE);
        break;
      }

      case BLOCK_IDS.KEY_LIST: {
        handleChangeTab(TAB.BOT);
        break;
      }

      case BLOCK_IDS.BURST_GUARD: {
        handleChangeTab(TAB.BURST_GUARD);
        break;
      }

      case BLOCK_IDS.DEPOSIT: {
        handleChangeTab(TAB.DEPOSIT);
        break;
      }
      default:
        break;
    }
  }

  toggle(fieldName) {
    const currentState = this.state;
    const item = currentState[fieldName];
    currentState[fieldName] = !item;
    this.setState(currentState);
  }

  renderRevenue() {
    const { labels, revenueHistory, lastestUpdateAt } = this.props;
    const tz = new Date().getTimezoneOffset();

    return (
      <ContentWrapper>
        {this.renderTitleRevenue()}
        <DivFullHeight id="Chart">
          <SpanLastUpdate>
            *{i18n.t('lastTimeUpdated')}: {moment(lastestUpdateAt).add(-tz, 'm').format('YYYY-MM-DD HH:mm:ss')}
          </SpanLastUpdate>
          <ChartArea>
            <Line
              height={100}
              data={{
                labels,
                datasets: [
                  {
                    borderColor: revenueHistory && revenueHistory[revenueHistory.length - 1] >= 0 ? '#2fa2e9' : 'red',
                    label: 'GC',
                    data: revenueHistory,
                    backgroundColor: 'transparent',
                    pointBackgroundColor: revenueHistory && revenueHistory[revenueHistory.length - 1] >= 0 ? '#2fa2e9' : 'red',
                  },
                ],
              }}
              options={LineChartOptions}
            />
          </ChartArea>
        </DivFullHeight>
      </ContentWrapper>
    );
  }

  renderTitle(title, blockId) {
    return (
      <TitleStyled>
        {title}
        <ImageStyled
          src={images.btnDetail}
          alt="expand"
          id="toggle-icon"
          onClick={() => this.handleToggle(blockId)}
        />
      </TitleStyled>
    );
  }

  renderKeyListTitle() {
    const { listBots } = this.props;
    const numberBotsOn = listBots.length > 0
      ? listBots.filter(bot => bot.status !== BOT_STATUSES.OFF).length
      : 0;
    const numberBotsOff = listBots.length > 0
      ? listBots.filter(bot => bot.status === BOT_STATUSES.OFF).length
      : 0;

    return (
      <TitleWrapper>
        <TitleStyled>
          <OnOffBotStatus>
            {i18n.t('autoBot')}:
            <ImageStyled
              src={images.btnDetail}
              alt="expand"
              id="toggle-icon"
              onClick={() => this.handleToggle(BLOCK_IDS.KEY_LIST)}
            />
          </OnOffBotStatus>
        </TitleStyled>
        <NumberBotWrapper>
          <StatusBot>
            <StatusImgStyled src={images.onStatus} alt="on" style={{ marginRight: 5 }} /> {numberBotsOn}
          </StatusBot>
          <StatusBot>
            <StatusImgStyled src={images.offStatus} alt="off" style={{ marginRight: 5 }} /> {numberBotsOff}
          </StatusBot>
        </NumberBotWrapper>
      </TitleWrapper>
    );
  }

  renderTitleRevenue() {
    const gc = this.props.revenueHistory
      && this.props.revenueHistory[this.props.revenueHistory.length - 1];
    return (
      <TitleStyled>
        {i18n.t('revenue')}: {<GcText isRed={gc < 0}>{gc && gc.toLocaleString('ja')}</GcText>}
        <ImageStyled
          src={images.btnDetail}
          alt="expand"
          id="toggle-icon"
          onClick={() => this.handleToggle(BLOCK_IDS.REVENUE)}
        />
      </TitleStyled>
    );
  }

  renderListBots() {
    const { listBots } = this.props;

    if (listBots.length === 0) {
      return <div />;
    }

    return (
      <ContentWrapper>
        {this.renderKeyListTitle()}
        <ListBotWrapper>
          {renderBots(listBots)}
        </ListBotWrapper>
      </ContentWrapper>
    );
  }

  renderTooltip(text, fieldName) {
    const currentState = this.state;
    return (
      <TooltipCustom
        placement="left-start"
        target={`Tooltip-${fieldName}`}
        toggle={() => this.toggle(fieldName)}
        isOpen={currentState[fieldName]}
        autohide={false}
      >
        {text}
      </TooltipCustom>
    );
  }

  renderBurstGuard() {
    return (
      <ContentWrapper>
        <TitleStyled>
          {i18n.t('burstTicket')}
          <ImageStyled
            src={images.btnDetail}
            alt="expand"
            id="toggle-icon"
            onClick={() => this.handleToggle(BLOCK_IDS.BURST_GUARD)}
          />
        </TitleStyled>
        <DepositContentStyled>
          <WrapperBurstStatusBtn>
            {/* Burst Ticket 残枚数: {userInfo && userInfo.detail && userInfo.detail.burst_count} */}
            {i18n.t('burstNumber')}: -
          </WrapperBurstStatusBtn>
          <MyTooltip
            icon={(
              <InformationImgStyled
                src={images.btnInfo}
                id="Tooltip-openBurstTicketTooltip"
              />
            )}
            text={i18n.t('burstInfo')}
          />
        </DepositContentStyled>
      </ContentWrapper>
    );
  }

  renderDeposit() {
    const { listBots } = this.props;
    const totalBots = (listBots && listBots.length) || 0;
    const numberBotsDeposited = (listBots && listBots.length > 0)
      ? listBots.filter(bot => (
        bot.status !== BOT_STATUSES.OFF || bot.deposited_status
      )).length
      : 0;
    return (
      <ContentWrapper>
        <TitleStyled>
          {i18n.t('deposit')}
          <ImageStyled
            src={images.btnDetail}
            alt="expand"
            id="toggle-icon"
            onClick={() => this.handleToggle(BLOCK_IDS.DEPOSIT)}
          />
        </TitleStyled>
        <DepositContentStyled>
          <div>
            <NumberBotOn>
              <DepositStatusesBtn src={images.onStatus} alt="" scale={this.scale} /> {i18n.t('deposited')} : {numberBotsDeposited}
            </NumberBotOn>
            <NumberBotOff>
              <DepositStatusesBtn src={images.offStatus} alt="" scale={this.scale} /> 未チャージ : {totalBots - numberBotsDeposited}
            </NumberBotOff>
          </div>
          <MyTooltip
            icon={(
              <InformationImgStyled
                src={images.btnInfo}
                id="Tooltip-openBurstTicketTooltip"
              />
            )}
            text={i18n.t('depositInfo')}
          />
        </DepositContentStyled>
      </ContentWrapper>
    );
  }

  render() {
    return (
      <Container>
        <Spinner isLoading={this.state.isLoading} />
        {/* {
          <NotiWrapper>
            <Notifi>
              <span style={{ fontSize: '0.75em', fontWeight: '800' }}>
                β版 終了日時：2019/10/11 15:00
              </span>
            </Notifi>
          </NotiWrapper>
        } */}
        {this.renderRevenue()}
        {this.renderListBots()}
        {this.renderBurstGuard()}
        {this.renderDeposit()}
      </Container>
    );
  }
}

DashboardMobile.defaultProps = {
  labels: [],
  revenueHistory: [],
  handleChangeTab: () => { },
  listBots: [],
  lastestUpdateAt: '',
};

DashboardMobile.propTypes = {
  fetchListBots: PropTypes.func.isRequired,
  listBots: PropTypes.array,
  revenueHistory: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.array,
  handleChangeTab: PropTypes.func,
  userInfo: PropTypes.object.isRequired,
  fetchChartData: PropTypes.func.isRequired,
  lastestUpdateAt: PropTypes.string,
};

export default DashboardMobile;
