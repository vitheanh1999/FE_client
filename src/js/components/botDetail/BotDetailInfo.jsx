import React, { Component, Fragment } from 'react';
// import Countdown from 'react-countdown';
import PropTypes from 'prop-types';
import { ButtonViewMode, ButtonDisable, IconViewMode } from '../listBots/listBotsStyle';
import i18n from '../../i18n/i18n';
import { images } from '../../theme';
import ChangeBotCampaign from './ChangeBotCampaign';
import CustomSwitch from '../common/CustomSwitch';
import PopupHandleGC from '../common/PopupHandleGC';
import BotDeletePopup from './BotDeletePopup';
import { BOT_STATUSES, PER_PAGE } from '../../constants/Constants';
import InputTextField from '../common/InputTextField';
import { MAX_GC_CHARGE_ERROR } from '../../constants/Charge';
import {
  HeaderArea, NameArea, Name,
  Title, DepositInfo, CampaignInfo,
  WrapperBotInfo, Content, CampaignAndDepositArea,
  WrapperSpan, NameTable, WrapperStatus,
} from './BotDetailStyle';
import InfoRemainTime from '../listBots/InfoRemainTime';
import Countdown from '../common/Countdown';
import StyleNumber from '../StyleNumber';

export const FLAG = {
  CAN_PAYOUT: 0,
  CANNOT_PAYOUT: 1,
};

class BotDetailInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowModeCharge: false,
      isShowModePayout: false,
    };

    this.handleChangeBotName = this.handleChangeBotName.bind(this);
    this.handleChangeBotCampaign = this.handleChangeBotCampaign.bind(this);
    this.handlePayoutGc = this.handlePayoutGc.bind(this);
    this.handleChargeGc = this.handleChargeGc.bind(this);
    this.openViewModeCharge = this.openViewModeCharge.bind(this);
    this.closeViewModeCharge = this.closeViewModeCharge.bind(this);
    this.openViewModePayout = this.openViewModePayout.bind(this);
    this.closeViewModePayout = this.closeViewModePayout.bind(this);
    this.inputTextFieldRef = React.createRef();
  }

  handleChangeBotName(value) {
    const { bot, updateBotName } = this.props;
    updateBotName(bot.id, value);
  }

  handleChangeBotNameErrol() {
    this.inputTextFieldRef.current.changeEditMode(true);
  }

  handleChangeBotCampaign(value) {
    const { bot, updateBotCampaign } = this.props;
    updateBotCampaign(bot.id, value);
  }

  handlePayoutGc(isHandleAll, amount, onSuccess, onError) {
    const { bot, payout } = this.props;
    let params = { botId: bot.id };
    if (!isHandleAll) {
      params = { ...params, amount: Number(amount).toFixed(2) };
    }
    payout(params, onSuccess, onError);
  }

  handleChargeGc(isHandleAll, amount, onSuccess, onError) {
    const { bot, gift } = this.props;
    gift([bot.id], amount, onSuccess, onError);
  }

  openViewModePayout() {
    this.setState({ isShowModePayout: true });
  }

  closeViewModePayout() {
    this.setState({ isShowModePayout: false });
  }

  openViewModeCharge() {
    this.setState({ isShowModeCharge: true });
  }

  closeViewModeCharge() {
    this.setState({ isShowModeCharge: false });
  }

  renderPopupCharge() {
    const {
      lucUserGC, bot, fetchBotDetail, fetchListBots,
      sortBy, currentPage, fetchUser,
    } = this.props;

    return (
      <PopupHandleGC
        isOpen={this.state.isShowModeCharge}
        onClose={this.closeViewModeCharge}
        onSubmit={this.handleChargeGc}
        fetchBotData={() => {
          fetchBotDetail(bot.id, () => { }, () => { });
          fetchListBots(() => { }, () => { }, {
            sortBy, currentPage, perPage: PER_PAGE,
          });
          fetchUser();
        }}
        totalGC={lucUserGC}
        maxValue={MAX_GC_CHARGE_ERROR}
        messageConfirm={i18n.t('chargeGcBot')}
        label={i18n.t('charge')}
        title={i18n.t('charge1BotNotification')}
        totalLabel={i18n.t('chargeAvailable')}
        allGcTitle={i18n.t('chargeAllInput')}
        amountGcTitle={i18n.t('placeholderChargeGC')}
        submitTitle={i18n.t('charge')}
      />
    );
  }

  renderPopupPayout() {
    const {
      bot, fetchBotDetail, fetchListBots,
      sortBy, currentPage,
    } = this.props;
    return (
      <PopupHandleGC
        onClose={this.closeViewModePayout}
        onSubmit={this.handlePayoutGc}
        fetchBotData={() => {
          fetchBotDetail(bot.id, () => { }, () => { });
          fetchListBots(() => { }, () => { }, {
            sortBy, currentPage, perPage: PER_PAGE,
          });
        }}
        totalGC={bot.GC}
        maxValue={bot.GC}
        messageConfirm={i18n.t('askPayout')}
        label={i18n.t('warning')}
        title={i18n.t('payoutTitle')}
        totalLabel={i18n.t('totalNumberGC')}
        amountGcTitle={i18n.t('amountGc')}
        allGcTitle={i18n.t('allGc')}
        submitTitle={i18n.t('payout')}
        isChargePopup={false}
      />
    );
  }

  renderCountdownBot(dataCountdown) {
    const {
      bot, fontSize,
      updateBotStatus, isMobile,
    } = this.props;
    const { secondsCurrent } = dataCountdown;
    const isOn = !(bot.status === BOT_STATUSES.OFF);
    const isRemainTime = secondsCurrent > 0;
    const remainTime = secondsCurrent / 3;
    const ratioRemainTime = 100 - Math.ceil(remainTime / 25) * 25;
    const customStyle = {
      transform: `scale(${fontSize / 20})`,
      justifyContent: 'flex-start',
      transformOrigin: 'left',
      width: '4em',
      cursor: 'pointer',
      marginBottom: '0.5em',
    };
    return (
      <Fragment>
        <CustomSwitch
          customStyle={customStyle}
          checked={isOn}
          onChange={(e) => {
            e.stopPropagation();
            if (!isRemainTime) { updateBotStatus(bot.id, bot.status); }
          }}
          ratioColor={ratioRemainTime}
          labelOff={!isRemainTime ? i18n.t('offStatus') : i18n.t('messageOffRemainTime')}
          disabled
        />
        <InfoRemainTime
          bot={bot}
          data={dataCountdown}
          handleUpdateBotStatus={() => updateBotStatus(bot.id, bot.status)}
          isMobile={isMobile}
          disableButtonSuggest
        />
      </Fragment>
    );
  }

  renderHeader() {
    const {
      bot,
      handleDeleteBot,
    } = this.props;
    return (
      <HeaderArea>
        <NameArea>
          <Name marginBottom="1em">
            {
              bot.name ? (
                <InputTextField
                  handleChangeInput={this.handleChangeBotName}
                  valueDefault={bot.name}
                  size={20}
                  minSize={1}
                  ref={this.inputTextFieldRef}
                />
              ) : ''
            }
            <BotDeletePopup handleDeleteBot={handleDeleteBot} bot={bot} />
          </Name>
          <WrapperStatus tableStatus={bot.status}>
            <Countdown
              seconds={bot.remain_time}
              renderTime={data => this.renderCountdownBot(data)}
            />
            {
              bot.status !== 0 && (
                <NameTable
                  width="90%"
                  marginLeft="2em"
                  fontSize="1.2em"
                >
                  {i18n.t('tableText')} : {bot.table_name_display}
                </NameTable>
              )
            }
          </WrapperStatus>

        </NameArea>
        <ButtonViewMode
          marginTop={4}
          onClick={() => this.props.openViewMode()}
        >
          {bot.status !== BOT_STATUSES.OFF ? i18n.t('viewMode') : i18n.t('checkHistory')}
          <IconViewMode
            src={images.btnView}
            alt="view mode"
            id="view-mode-btn"
          />
        </ButtonViewMode>
      </HeaderArea>
    );
  }

  renderChargeButton() {
    const { bot, isMobile } = this.props;
    const isOff = bot.status === BOT_STATUSES.OFF && !bot.remain_time;
    const isPayout = bot.GC > 0 && !bot.status && bot.flag === FLAG.CAN_PAYOUT && !bot.remain_time;
    return (
      <DepositInfo isMobile={isMobile}>
        <diV>
          <Title justifyContent="center">
            <WrapperSpan>{i18n.t('gc')}: {<StyleNumber value={bot.GC} color={bot.GC < 0 ? '#ff5a5a' : '#fff'} afterDot={2} />}</WrapperSpan>
          </Title>
          <Title justifyContent="center">
            <ButtonDisable
              fontSize="0.5em"
              hoverBgColor="#20bcdf"
              color="#2d889c"
              padding="0 1em 0 1em"
              margin=" 0 0.5em 0.5em 0"
              width="9em"
              height="3em"
              onClick={() => this.openViewModePayout()}
              disabled={!isPayout}
            >
              {i18n.t('payout')}
            </ButtonDisable>
            <ButtonDisable
              fontSize="0.5em"
              hoverBgColor="#20bcdf"
              color="#2d889c"
              padding="0 1em 0 1em"
              margin=" 0 0 0.5em 0.5em"
              width="9em"
              height="3em"
              onClick={() => this.openViewModeCharge()}
              disabled={!isOff}
            >
              {i18n.t('deposit')}
            </ButtonDisable>
          </Title>
        </diV>
        {
          bot.remain_time !== null && bot.remain_time !== undefined && (bot.remain_time > 0) && (
            <Title fontSize={1} justifyContent="center">
              <span>{i18n.t('noteGCBotDetail')}</span>
            </Title>
          )
        }
      </DepositInfo>
    );
  }

  render() {
    const { bot, listCampaigns } = this.props;
    const isChangeBotCampaign = bot.status === BOT_STATUSES.OFF;
    const campaignBot = bot.campaign || {};

    return (
      <WrapperBotInfo>
        <Content>
          {this.renderHeader()}
          <CampaignAndDepositArea isMobile={this.props.isMobile}>
            <CampaignInfo isMobile={this.props.isMobile}>
              <Title>
                {i18n.t('campaign')}
              </Title>
              <ChangeBotCampaign
                isChangeBotCampaign={isChangeBotCampaign}
                updateBotCampaign={this.handleChangeBotCampaign}
                listCampaigns={listCampaigns}
                campaignBot={campaignBot}
                fontSize={1.2}
                handleChangeProps={() => { }}
              />
            </CampaignInfo>
            {this.renderChargeButton()}
          </CampaignAndDepositArea>
        </Content>
        {this.state.isShowModeCharge && this.renderPopupCharge()}
        {this.state.isShowModePayout && this.renderPopupPayout()}
      </WrapperBotInfo>
    );
  }
}

BotDetailInfo.propTypes = {
  lucUserGC: PropTypes.number.isRequired,
  bot: PropTypes.object.isRequired,
  handleDeleteBot: PropTypes.func.isRequired,
  openViewMode: PropTypes.func.isRequired,
  updateBotStatus: PropTypes.func.isRequired,
  updateBotName: PropTypes.func.isRequired,
  updateBotCampaign: PropTypes.func.isRequired,
  payout: PropTypes.func.isRequired,
  gift: PropTypes.func.isRequired,
  fontSize: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
  fetchListBots: PropTypes.func.isRequired,
  fetchBotDetail: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  currentPage: PropTypes.number.isRequired,
  listCampaigns: PropTypes.any.isRequired,
  fetchUser: PropTypes.func.isRequired,
};

export default BotDetailInfo;
