import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { Tooltip } from 'reactstrap';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import Block from '../common/Block';
import {
  TAB, getMinDate, FORMAT_DATE, SORT_BOT_OPTIONS, BOT_STATUSES,
} from '../../constants/Constants';
import { images } from '../../theme';
import i18n from '../../i18n/i18n';
import Spinner from '../common/Spinner';
import MyTooltip from '../common/Tooltip';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import Alert from '../common/Alert/Alert';
// import { PRODUCT_MODE } from '../../constants/ProductType';

// const getFavicon = () => images.FEFavicon;

// const getAppleTouchIcon = () => images.appleTouchIcon;

export const Notifi = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5em;
  width: 100%;
  border: 2px solid #89bcc7;
  word-break: break-word;
  white-space: pre-wrap;
`;

const GcText = styled.span`
  color: ${props => (props.isRed ? 'red' : 'black')};
`;

export const NotiWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 0.5em;
`;

const color = 'rgba(200, 200, 200, 0.7)';
export const LineChartOptions = (title, fontSizeTitle) => {
  const isShowTitle = title;
  return {
    title: {
      display: isShowTitle,
      position: 'bottom',
      fontSize: fontSizeTitle || 17,
      fontColor: '#fff',
      text: title,
    },
    legend: {
      display: false,
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: color,
          // min: 0,
          // stepSize: 1,
          // fontSize: 14,
        },
        scaleLabel: {
          display: true,
          fontSize: 50,
        },
        gridLines: {
          color,
          lineWidth: 1,
          zeroLineColor: color,
          zeroLineWidth: 2,
        },
      }],
      xAxes: [{
        ticks: {
          fontColor: color,
          fontSize: 14,
        },
        gridLines: {
          color,
          lineWidth: 1,
        },
      }],
    },
  };
};

export const ChartArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.111em 2em;
`;

const WrapperTop = styled.div`
  display: flex;
  width: 100%;
  height: 65%;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 10px !important;
  min-height: 20rem;
`;

const WrapperBottom = styled.div`
  display: flex;
  width: 100%;
  height: 35%;
  min-height: 12rem;
`;

const TitleStyled = styled.div`
  width: 100%;
  height: 2.75em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1em;
  font-weight: bold;
  position: relative;

  #toggle-icon {
    width: 1em;
    cursor: pointer;
  }
`;

const BlockTopStyled = styled.div`
  height: 100%;
  width: 49.5%;
  min-height: 2.75em;
`;

const BlockBottomStyled = styled.div`
  height: 100%;
  width: 50%;
  min-height: 2.75em;

  :first-child {
    margin-right: 0.5em;
  }
`;

const WrapperKeyStyled = styled.div`
  display: flex;
  margin-bottom: 0.5em;
  align-items: center;
  overflow: auto;

  #key-name {
    font-weight: 500;
    font-size: 1em;
  }
`;

export const BotStatusBtnStyled = styled.img`
  width: 4.5em;
  margin-right: 0.5em;
`;

export const StatusImgStyled = styled.img`
  width: 0.85em;
  margin-left: 0.75em;
  margin-right: 2px;
`;

const DepositContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 1.1em;
  font-weight: bold;
  position: relative;
`;

const DepositStatusesBtn = styled.img`
  width: ${props => props.scale * 11}%;
`;

const WrapperBurstStatusBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InformationImgStyled = styled.img`
  width: 1.5em;
  cursor: pointer;
`;

const ImageStyled = styled.img`
`;

const DivFullHeight = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SpanLastUpdate = styled.span`
  margin-top: 0.5em;
  display: flex;
  color: red;
  justify-content: flex-end;
  font-size: 0.6em;
`;

const TooltipCustom = styled(Tooltip)`
  .tooltip-inner {
    max-width: 12em;
  }
`;

const BLOCK_IDS = {
  REVENUE: 3,
  KEY_LIST: 4,
  BURST_GUARD: 5,
  DEPOSIT: 6,
};

export const renderHelmet = () => (
  <Helmet>
    <title>aaaaaaaaaa</title>
    {/* <link rel="shortcut icon" href={images.FEFavicon} /> */}
    <link rel="icon" type="image/png" sizes="180x180" href={images.FEFavicon} />
    <meta name="title" content="Default Title" />
  </Helmet>
);

const renderBots = bots => bots.map(bot => (
  <WrapperKeyStyled key={bot.id}>
    <BotStatusBtnStyled
      src={bot.status !== BOT_STATUSES.OFF ? images.btnOnBot : images.btnOffBot}
      alt="on bot btn"
    />
    <div id="key-name">{bot.dbac_code}</div>
  </WrapperKeyStyled>
));

class Main extends Component {
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
      <TitleStyled>
        <div
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {i18n.t('autoBotName')}:
          <StatusImgStyled src={images.onStatus} alt="on" /> {numberBotsOn}
          <StatusImgStyled src={images.offStatus} alt="off" /> {numberBotsOff}
        </div>
        <ImageStyled
          src={images.btnDetail}
          alt="expand"
          id="toggle-icon"
          onClick={() => this.handleToggle(BLOCK_IDS.KEY_LIST)}
        />
      </TitleStyled>
    );
  }

  renderTitleRevenue() {
    const gc = this.props.revenueHistory
      && this.props.revenueHistory[this.props.revenueHistory.length - 1];
    return (
      <TitleStyled>
        <div>
          {i18n.t('revenue')}: {<GcText isRed={gc < 0}>{gc && gc.toLocaleString('ja')} GC</GcText>}
        </div>
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
      <div style={{ maxHeight: '47%' }}>
        <div style={{ marginTop: '0.5em' }}>{renderBots(listBots)}</div>
      </div>
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
    const { userInfo } = this.props;

    return (
      <DepositContentStyled>
        <WrapperBurstStatusBtn>
          {i18n.t('burstNumber')}: {userInfo && userInfo.detail && userInfo.detail.burst_count}
          {/* {i18n.t('burstNumber')}: - */}
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
      <DepositContentStyled>
        <div>
          <div
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <DepositStatusesBtn src={images.onStatus} alt="" scale={this.scale} /> チャージ済 : {numberBotsDeposited}
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', marginTop: '1em' }}
            scale={this.scale}
          >
            <DepositStatusesBtn src={images.offStatus} alt="" scale={this.scale} /> 未チャージ : {totalBots - numberBotsDeposited}
          </div>
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
    );
  }


  render() {
    return (
      <Container>
        {renderHelmet()}
        <Spinner isLoading={this.state.isLoading} />
        <WrapperTop>
          <BlockTopStyled id="Revenue">
            <Block
              title={this.renderTitleRevenue()}
              content={this.renderRevenue()}
            />
          </BlockTopStyled>
          <BlockTopStyled>
            <Block
              title={this.renderKeyListTitle()}
              content={this.renderListBots()}
            />
          </BlockTopStyled>
        </WrapperTop>
        <WrapperBottom>
          <BlockBottomStyled>
            <Block
              title={this.renderTitle(i18n.t('burstTicket'), BLOCK_IDS.BURST_GUARD)}
              content={this.renderBurstGuard()}
            />
          </BlockBottomStyled>
          <BlockBottomStyled>
            <Block
              title={this.renderTitle(i18n.t('charge'), BLOCK_IDS.DEPOSIT)}
              content={this.renderDeposit()}
            />
          </BlockBottomStyled>
        </WrapperBottom>
      </Container>
    );
  }
}

Main.defaultProps = {
  labels: [],
  revenueHistory: [],
  handleChangeTab: () => { },
  listBots: [],
  lastestUpdateAt: '',
};

Main.propTypes = {
  fetchListBots: PropTypes.func.isRequired,
  listBots: PropTypes.array,
  revenueHistory: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.array,
  handleChangeTab: PropTypes.func,
  userInfo: PropTypes.object.isRequired,
  fetchChartData: PropTypes.func.isRequired,
  lastestUpdateAt: PropTypes.string,
};

export default Main;
