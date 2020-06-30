import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from '../../i18n/i18n';
import images from '../../theme/images';
import {
  KeyStatusBtn, TextStyled,
} from './BotInfoMobile';
import DropDown from '../common/Dropdown/Dropdown';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import Alert from '../common/Alert/Alert';
import Spinner from '../common/Spinner';
import {
  TAB, SORT_BOT_OPTIONS, BOT_STATUSES, BURST_STATUSES,
} from '../../constants/Constants';
import GameScene from '../viewScreenGame/GameScene';
import {
  WrapperBotName, BotHeader, WrapperBot, BotInformation, KeyNameText,
  Button, TotalGCText, ViewModeBtn, ViewBotDetailIcon, DropdownArea,
  WrapperSelect, KeyActiveBurst, ModalWrapperMobile, ModalGameSceneHeader,
} from './listBotsMobileStyle';

const renderBurstStatus = (burstStatus) => {
  switch (burstStatus) {
    case BURST_STATUSES.INACTIVE:
      return null;

    case BURST_STATUSES.ACTIVE:
      return <KeyActiveBurst src={images.burstActive} />;

    case BURST_STATUSES.PENDING:
      return <div>pending...</div>;
    default: return null;
  }
};

class ListBotsMobile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: SORT_BOT_OPTIONS[0].value,
      isLoading: false,
      showGameScene: false,
      selectedBotInfo: null,
    };
    this.onSuccessFetchBots = this.onSuccessFetchBots.bind(this);
    this.onSuccessUpdateBotStatus = this.onSuccessUpdateBotStatus.bind(this);
    this.onError = this.onError.bind(this);
    this.handleSortBots = this.handleSortBots.bind(this);
    this.closeViewMode = this.closeViewMode.bind(this);
  }

  componentDidMount() {
    const { sortBy } = this.state;
    this.setState({ isLoading: true });
    this.props.botActions.fetchListBots(sortBy, this.onSuccessFetchBots, this.onError);
  }

  onSuccessFetchBots() {
    this.setState({
      isLoading: false,
    });
  }

  onSuccessUpdateBotStatus(data) {
    ApiErrorUtils.handleServerError(data, Alert.instance);
    this.props.fetchUser(
      userData => ApiErrorUtils.handleServerError(userData, Alert.instance, () => { }, (err) => {
        console.log(err);
      }),
      err => ApiErrorUtils.handleHttpError(err, Alert.instance, () => { }),
    );
    this.fetchListBots();
  }

  onError(error) {
    ApiErrorUtils.handleHttpError(error, Alert.instance);
    this.setState({ isLoading: false });
  }

  fetchListBots() {
    this.props.botActions.fetchListBots(this.state.sortBy, this.onSuccessFetchBots, this.onError);
  }

  handleSortBots(optionId, option) {
    this.setState({
      sortBy: option.value,
      isLoading: true,
    });
    this.props.botActions.fetchListBots(option.value, this.onSuccessFetchBots, this.onError);
  }

  closeViewMode() {
    this.setState({
      showGameScene: false,
    });
    const { registerChangeTable } = this.props;
    if (registerChangeTable) registerChangeTable();
  }

  openGameScene(e, enableView, bot) {
    e.stopPropagation();
    this.setState({ selectedBotInfo: bot }, () => {
      if (enableView) {
        this.setState({ showGameScene: true });
      }
    });
  }

  updateBotStatus(botId, isBotOn) {
    Alert.instance.hideAlert();
    const status = isBotOn ? 0 : 1;
    this.props.botActions.updateBotStatus(botId, status,
      this.onSuccessUpdateBotStatus, this.onError);
  }

  handleUpdateBotStatus(botId, isBotOn, event) {
    event.stopPropagation();
    Alert.instance.showAlertTwoButtons(
      i18n.t('warning'),
      isBotOn ? i18n.t('offBotMessage') : i18n.t('onBotMessage'),
      [i18n.t('cancel'), i18n.t('OK')],
      [() => Alert.instance.hideAlert(), () => this.updateBotStatus(botId, isBotOn)],
      Alert.instance.hideAlert(),
    );
  }

  renderBot(bot) {
    const isOff = bot.status === BOT_STATUSES.OFF;
    const scale = window.innerWidth / 320;
    const { showBotDetail } = this.props;
    return (
      <WrapperBot
        key={bot.id}
        onClick={() => showBotDetail(bot.id)}
      >
        <BotInformation>
          <BotHeader scale={scale}>
            <WrapperBotName>
              <KeyStatusBtn scale={scale * 0.6} isBotOn={!isOff}>
                <img src={isOff ? images.iconOff : images.iconStatusOn} alt="" />
                <TextStyled fontSize={scale * 0.6}>{i18n.t('onStatus')}</TextStyled>
              </KeyStatusBtn>
              {
                (bot.status === 0) && (
                  <Button
                    scale={scale * 0.6}
                    onClick={event => this.handleUpdateBotStatus(bot.id, bot.status, event)}
                  >
                    <img
                      src={images.triangularOnBot}
                      alt="view mode"
                      id="view-mode-btn"
                    />
                    <TextStyled fontSize={scale * 0.7}>{i18n.t('onBot')}</TextStyled>
                  </Button>
                )
              }
              {renderBurstStatus(bot.burst_status)}
            </WrapperBotName>
            <ViewBotDetailIcon
              src={images.btnDetail}
              scale={scale * 0.8}
              onClick={() => showBotDetail(bot.id)}
            />
          </BotHeader>
          <KeyNameText fontSize={scale * 0.8}>{bot.dbac_code}</KeyNameText>
          <TotalGCText isRed={bot.GC < 0} id="auto-gc" scale={scale}>
            GC : <span>{bot.GC.toLocaleString('ja')}</span>
          </TotalGCText>
          <ViewModeBtn scale={scale} onClick={e => this.openGameScene(e, true, bot)}>
            <TextStyled fontSize={scale * 0.8}>
              {bot.status !== BOT_STATUSES.OFF ? i18n.t('viewMode') : i18n.t('checkHistory')}
            </TextStyled>
            <ViewBotDetailIcon
              src={images.mobileViewBtn}
              alt="view mode"
              scale={scale}
            />
          </ViewModeBtn>
        </BotInformation>
      </WrapperBot>
    );
  }

  renderListBot() {
    const { bots } = this.props.listBots;
    if (bots.length === 0) {
      return null;
    }

    return bots.map(bot => this.renderBot(bot));
  }

  renderSelect() {
    const scale = window.innerWidth / 320;

    return (
      <WrapperSelect scale={scale}>
        <DropdownArea>
          <DropDown
            data={SORT_BOT_OPTIONS}
            onChangeSelected={this.handleSortBots}
            width={8 * scale}
            height={1.5 * scale}
          />
        </DropdownArea>
      </WrapperSelect>
    );
  }

  renderGameScene() {
    const { selectedBotInfo } = this.state;
    const { fetchBotHistoryNow } = this.props.botActions;

    const ratio = window.innerWidth / window.innerHeight;
    let widthModal = window.innerWidth;
    if (ratio > 1.6349) {
      widthModal = window.innerHeight * 1.6319;
    }

    return (
      <ModalWrapperMobile
        id="modal-view-mode"
        isOpen={this.state.showGameScene}
        toggle={() => { }}
        centered
        width={widthModal}
      >
        <ModalGameSceneHeader toggle={this.closeViewMode}>
          {
            selectedBotInfo && selectedBotInfo.status === BOT_STATUSES.OFF ? i18n.t('checkHistory') : i18n.t('viewMode')
          }
        </ModalGameSceneHeader>
        <GameScene
          closeViewMode={this.closeViewMode}
          goDashBoard={() => this.props.handleChangeTab(TAB.DASHBOARD)}
          botInfo={selectedBotInfo}
          fetchBotHistoryNow={fetchBotHistoryNow}
          listBotAction={this.props.botActions}
          fetchBotGCNow={this.props.botActions.fetchBotGCNow}
          fetchTableStatusNow={this.props.botActions.fetchTableStatusNow}
          ref={this.gameSceneRef}
          width={widthModal}
        />
      </ModalWrapperMobile>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Spinner isLoading={this.state.isLoading} />
        {this.renderSelect()}
        {this.renderListBot()}
        {this.renderGameScene()}
        {
          // <ViewModeMobile />
        }
      </React.Fragment>
    );
  }
}

ListBotsMobile.propTypes = {
  listBots: PropTypes.object.isRequired,
  fetchUser: PropTypes.func.isRequired,
  registerChangeTable: PropTypes.func.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
  botActions: PropTypes.objectOf(PropTypes.any).isRequired,
  showBotDetail: PropTypes.func.isRequired,
};

export default ListBotsMobile;
