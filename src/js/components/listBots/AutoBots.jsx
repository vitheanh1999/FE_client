import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from '../common/Alert/Alert';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import GameScene from '../viewScreenGame/GameScene';
import { TAB, BOT_STATUSES } from '../../constants/Constants';
import i18n from '../../i18n/i18n';
import { removeTimeout } from '../viewScreenGame/logicCore/utils';
import Spinner from '../common/Spinner';
import StorageUtils, { STORAGE_KEYS } from '../../helpers/StorageUtils';
import AddBot from './AddBot';
import BotItem from './BotItem';
import {
  ContentContainer, ContentHeader,
  MedianStrip, ContentBody,
} from '../common/CommonStyle';
import { ModalHeaderCustom, ModalWrapper } from './listBotsStyle';

class AutoBots extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showGameScene: false,
      selectedBotInfo: null,
      isLoading: false,
      maxBot: 10000,
    };

    this.onError = this.onError.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onSuccessFetchBots = this.onSuccessFetchBots.bind(this);
    this.onSuccessUpdateBotStatus = this.onSuccessUpdateBotStatus.bind(this);
    this.onSuccessMaxBot = this.onSuccessMaxBot.bind(this);
    this.handleUpdateBotStatus = this.handleUpdateBotStatus.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.closeViewMode = this.closeViewMode.bind(this);
    this.fetchListBots = this.fetchListBots.bind(this);
    this.onResize = this.onResize.bind(this);
    this.handleSortBots = this.handleSortBots.bind(this);
    this.gameSceneRef = React.createRef();
    window.addEventListener('resize', this.onResize);
    this.openGameScene = this.openGameScene.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    this.fetchListBots();
    this.props.fetchListTable(this.onSuccess, this.onError);
    this.props.fetchMinProfitValue(this.onSuccessMaxBot, this.onError);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    if (this.resizeTimeOut) removeTimeout(this.resizeTimeOut);
  }

  onResize() {
    this.setState({});
    if (this.resizeTimeOut) removeTimeout(this.resizeTimeOut);
    this.resizeTimeOut = setTimeout(() => {
      if (this.gameSceneRef.current) {
        this.gameSceneRef.current.woodPlaneRef.current.lobbyBoardRef.current.reRenderCanvas();
      }
      this.resizeTimeOut = null;
    }, 500);
  }

  onSuccess(data) {
    this.setState({ isLoading: false });

    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => this.onSuccessFetchBots(),
      () => {
        this.onSuccessFetchBots();
      },
    );
  }

  onError(error) {
    try {
      ApiErrorUtils.handleHttpError(error, Alert.instance);
    } catch (err) {
      // do something
    } finally {
      this.setState({ isLoading: false });
    }
  }

  onSuccessFetchBots() {
    StorageUtils.setItemObject(STORAGE_KEYS.listGroupBotChangeTable, {});
    this.setState({
      isLoading: false,
    });
  }

  onSuccessUpdateBotStatus(data) {
    this.setState({ isLoading: false });
    ApiErrorUtils.handleServerError(data, Alert.instance);
    this.fetchListBots();
  }

  onSuccessMaxBot(data) {
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      if (data.data.max_bot) this.setState({ maxBot: data.data.max_bot });
    });
  }

  onChangePage(page) {
    const { currentPage } = this.props.pageInfo;
    if (currentPage !== page) {
      this.setState(
        { isLoading: true },
        () => {
          this.props.onChangePage(page, this.onSuccess, this.onError);
        },
      );
    }
  }

  handleUpdateBotStatus(botId, isBotOn, isResetLogic) {
    Alert.instance.hideAlert();
    this.setState({ isLoading: true });
    const status = isBotOn ? 0 : 1;
    this.props.updateBotStatus(
      botId, status, isResetLogic,
      this.onSuccessUpdateBotStatus, this.onError,
    );
  }

  handleSortBots(optionId, option) {
    this.setState(
      { isLoading: true },
      () => {
        this.props.handleSortBots(option.value, this.onSuccess, this.onError);
      },
    );
  }

  closeViewMode() {
    const { selectedBotInfo } = this.state;
    this.setState({
      showGameScene: false,
    });
    const { registerChangeTable } = this.props;
    if (selectedBotInfo && selectedBotInfo.status !== BOT_STATUSES.OFF) {
      this.fetchListBots();
    }
    if (registerChangeTable) registerChangeTable();
  }

  fetchListBots() {
    this.props.fetchListBots(this.onSuccess, this.onError);
  }

  openGameScene(e, enableView, bot) {
    StorageUtils.setUserItem(STORAGE_KEYS.junketId, 3);
    e.stopPropagation();
    this.setState({ selectedBotInfo: bot }, () => {
      if (enableView) {
        this.setState({ showGameScene: true });
      }
    });
  }

  renderGameScene() {
    const { selectedBotInfo } = this.state;
    const { fetchBotHistoryNow, listBotAction, updateNameTable } = this.props;
    const isOffBot = selectedBotInfo && selectedBotInfo.status === BOT_STATUSES.OFF;
    console.log(this.props.fetchTableStatusNow);
    return (
      <ModalWrapper
        id="modal-view-mode"
        isOpen={this.state.showGameScene}
        toggle={() => { }}
        centered
        width={window.innerWidth * 0.8}
        isOffBot={isOffBot}
      >
        <ModalHeaderCustom isOffBot={isOffBot} toggle={this.closeViewMode}>
          {
            isOffBot ? i18n.t('checkHistory') : i18n.t('viewMode')
          }
        </ModalHeaderCustom>
        <GameScene
          closeViewMode={this.closeViewMode}
          goDashBoard={() => this.props.handleChangeTab(TAB.DASHBOARD)}
          botInfo={selectedBotInfo}
          fetchBotHistoryNow={fetchBotHistoryNow}
          listBotAction={listBotAction}
          fetchBotGCNow={this.props.fetchBotGCNow}
          fetchTableStatusNow={this.props.fetchTableStatusNow}
          ref={this.gameSceneRef}
          width={window.innerWidth * 0.8}
          updateNameTable={updateNameTable}
        />
      </ModalWrapper>
    );
  }

  render() {
    const {
      data, showBotDetail, fetchUser,
      fontSize, createBots, fetchListCampaigns,
      isMobile, updateCampaign, fetchBotDetail,
      fetchListTable, updateBotStatus, pageInfo,
    } = this.props;
    const { maxBot } = this.state;
    const { listBots, listCampaigns, listTable } = data;
    const {
      bots, total, lucUserGC, timeUpdateListBot,
    } = listBots;
    return (
      <ContentContainer>
        <ContentHeader>
          {i18n.t('total').concat(': ', total)}
          <AddBot
            fontSize={fontSize}
            createBots={createBots}
            fetchListBots={this.fetchListBots}
            fetchListCampaigns={fetchListCampaigns}
            listCampaigns={listCampaigns}
            isAddBot={maxBot > total}
            maxBot={maxBot}
          />
        </ContentHeader>
        <MedianStrip />
        <ContentBody>
          <BotItem
            listTable={listTable}
            listBots={bots}
            timeUpdateListBot={timeUpdateListBot}
            showBotDetail={showBotDetail}
            handleSortBots={this.handleSortBots}
            openGameScene={this.openGameScene}
            perPage={pageInfo.perPage}
            currentPage={pageInfo.currentPage}
            changePage={page => this.onChangePage(page)}
            fontSize={fontSize}
            total={total}
            updateBotStatus={updateBotStatus}
            listCampaigns={listCampaigns}
            updateBotCampaign={updateCampaign}
            fetchListBots={this.fetchListBots}
            fetchBotDetail={fetchBotDetail}
            lucUserGC={lucUserGC}
            fetchUser={fetchUser}
            isMobile={isMobile}
            fetchListTable={fetchListTable}
            handleUpdateBotStatus={this.handleUpdateBotStatus}
          />
          {this.renderGameScene()}
        </ContentBody>
        <Spinner isLoading={this.state.isLoading} />
      </ContentContainer>
    );
  }
}

AutoBots.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  pageInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  fetchListTable: PropTypes.func.isRequired,
  fetchBotGCNow: PropTypes.func.isRequired,
  fetchListBots: PropTypes.func.isRequired,
  createBots: PropTypes.func.isRequired,
  showBotDetail: PropTypes.func.isRequired,
  updateBotStatus: PropTypes.func.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  fetchBotHistoryNow: PropTypes.func.isRequired,
  listBotAction: PropTypes.objectOf(PropTypes.any).isRequired,
  handleSortBots: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  registerChangeTable: PropTypes.func.isRequired,
  fetchTableStatusNow: PropTypes.func.isRequired,
  fetchMinProfitValue: PropTypes.func.isRequired,
  updateNameTable: PropTypes.func.isRequired,
  fetchListCampaigns: PropTypes.func.isRequired,
  fontSize: PropTypes.number.isRequired,
  updateCampaign: PropTypes.func.isRequired,
  fetchBotDetail: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default AutoBots;
