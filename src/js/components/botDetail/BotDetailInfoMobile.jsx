import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  KeyStatusBtn, IconViewMode,
} from '../listBots/listBotsStyle';
import i18n from '../../i18n/i18n';
import { images, imagesMobile } from '../../theme';

import { TAB, BOT_STATUSES } from '../../constants/Constants';

import {
  WrapperBotInfo, Content, BurstAndDepositArea,
  DepositInfo, Name, NameArea, HeaderArea,
  StatusInfo, Title, DepositButton, StatusDepositBtnStyled,
  BurstInfo, StatusBurstBtnStyled, ImageButtonDetail, ButtonViewModeMobile, ButtonOnOff, ButtonX,
  // BotActionBtnStyled,
} from './BotDetailInfoMobileStyle';

class BotDetailInfoMobile extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  renderHeader() {
    const { bot } = this.props;
    return (
      <HeaderArea>
        <NameArea>
          {/* <BotActionBtnStyled
            src={bot.status ? images.offBotButton : images.onBotButton}
            onClick={() => this.props.updateBotStatus(bot.id, bot.status)}
          /> */}
          <ButtonOnOff
            onClick={() => this.props.updateBotStatus(bot.id, bot.status)}
          >{bot.status
            ? (
              <>
                <img
                  src={images.iconOff}
                  alt="view mode"
                  id="view-mode-btn"
                />
                {i18n.t('offBot')}
              </>
            ) : (
              <>
                <img
                  src={images.iconOn}
                  alt="view mode"
                  id="view-mode-btn"
                />
                {i18n.t('onBot')}
              </>
            )
            }
          </ButtonOnOff>
          <Name>{bot.dbac_code}</Name>
        </NameArea>
        <ButtonViewModeMobile
          onClick={() => this.props.openViewMode()}
        >
          {bot.status === BOT_STATUSES.ON ? i18n.t('viewMode') : i18n.t('checkHistory')}
          <IconViewMode
            src={images.mobileViewBtn}
            alt="view mode"
            id="view-mode-btn"
          />
        </ButtonViewModeMobile>
      </HeaderArea>
    );
  }

  renderBotStatus() {
    const { bot } = this.props;
    const isOff = bot.status === BOT_STATUSES.OFF;
    return (
      <BurstInfo flex={30} id="BurstInfo">
        <Title>
          {i18n.t('status')}
          <StatusInfo>
            <KeyStatusBtn botStatus={isOff}>
              <img src={isOff ? images.iconOff : images.iconStatusOn} alt="" />
              {isOff ? i18n.t('offStatus') : i18n.t('onStatus')}
            </KeyStatusBtn>
          </StatusInfo>
        </Title>
      </BurstInfo>
    );
  }

  renderBurstInfo() {
    const { bot, userInfor } = this.props;
    const burstCount = userInfor.detail ? userInfor.detail.burst_count : 0;
    return (
      <BurstInfo flex={40}>
        <Title>
          {i18n.t('burstTicket')}
          <ImageButtonDetail
            src={images.btnDetail}
            alt="expand"
            id="toggle-icon"
            onClick={() => this.props.handleChangeTab(TAB.BURST_GUARD)}
          />
        </Title>
        <StatusInfo>
          {bot.burst_status
            ? (
              <StatusBurstBtnStyled
                src={images.burstActive}
                alt="on bot btn"
              />
            ) : (
              <div>
                {i18n.t('totalBurst')}:
                {burstCount}
              </div>
            )}
        </StatusInfo>
      </BurstInfo>
    );
  }

  renderChargeButton() {
    const { bot } = this.props;
    return (
      <DepositInfo flex={30}>
        <Title>
          {i18n.t('deposit')}
          <ImageButtonDetail
            src={images.btnDetail}
            alt="expand"
            id="toggle-icon"
            onClick={() => this.props.handleChangeTab(TAB.DEPOSIT)}
          />
        </Title>
        <StatusInfo>
          {(bot.deposited_status || bot.status !== BOT_STATUSES.OFF) ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <StatusDepositBtnStyled
                src={images.onStatus}
                alt="on bot btn"
              />
              {i18n.t('deposited')}
            </div>
          ) : (
            <DepositButton
              onClick={() => this.props.gift(bot.id, bot.GC)}
            >
              {i18n.t('depositButton')}
            </DepositButton>
          )}
        </StatusInfo>
      </DepositInfo>
    );
  }

  render() {
    const { onCloseBotDetail } = this.props;
    return (
      <WrapperBotInfo>
        <ButtonX
          src={imagesMobile.iconXBlue}
          onClick={onCloseBotDetail}
        />
        <Content>
          {this.renderHeader()}
          <BurstAndDepositArea>
            {this.renderBotStatus()}
            {this.renderBurstInfo()}
            {this.renderChargeButton()}
          </BurstAndDepositArea>
        </Content>
      </WrapperBotInfo>
    );
  }
}

BotDetailInfoMobile.propTypes = {
  bot: PropTypes.object.isRequired,
  openViewMode: PropTypes.func.isRequired,
  updateBotStatus: PropTypes.func.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
  gift: PropTypes.func.isRequired,
  userInfor: PropTypes.object.isRequired,
  onCloseBotDetail: PropTypes.func.isRequired,
};

export default BotDetailInfoMobile;
