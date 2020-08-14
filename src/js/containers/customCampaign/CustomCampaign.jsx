/* eslint-disable react/sort-comp */
import React, { Component, createRef } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Pagination from 'rc-pagination';
import Alert from '../../components/common/Alert/Alert';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import * as customCampaignAction from '../../actions/customCampaign';
import {
  ContentContainer, ContentHeader, MedianStrip, ContentBody, ModalHeaderCustom,
  WrapperPaginationCustom,
} from '../../components/common/CommonStyle';
import i18n from '../../i18n/i18n';
import { ButtonAddCampaign, IconAdd, Blank } from '../../components/campaign/campaignStyle';
import images from '../../theme/images';
import helpImages from '../../../assets/images';
import TabMenu from '../../components/campaign/detail/TabMenu';
import ListLogicPattern from '../../components/customCampaign/ListLogicPattern';
import ListBetPattern from '../../components/customCampaign/ListBetPattern';
import PopUpDetail from '../../components/customCampaign/PopUpDetail';
import { TABS } from '../../components/customCampaign/CardNoTable';
import Spinner from '../../components/common/Spinner';
import { PER_PAGE } from '../../constants/Constants';
import Keyboard from '../../components/keyboard/Keyboard';
import PopUpHelp from '../../components/customCampaign/PopUpHelp';
import {
  ModalWrapper, Icon, Content,
  TitleWrapper, listTabs,
  getPopupDetailFontSize,
} from './customCampaignStyle';
import AutoSave, { AUTO_SAVE_KEY } from '../../helpers/AutoSave';

class CustomCampaign extends Component {
  constructor(props) {
    super(props);

    if (!AutoSave.instance) {
      this.autoSave = new AutoSave();
    } else {
      this.autoSave = AutoSave.instance;
    }
    const currentTabId = TABS.LIST_LOGIC_BET.id;
    const isShowModalDetail = false;
    const selectTedId = null;

    this.state = {
      currentTabId,
      isShowModalDetail,
      selectTedId,
      isLoading: false,
      settingWorkerData: {},
      currentPage: 1,
      isShowHelp: false,
      totalBotOffInData: 0,
      totalBotOnInData: 0,
      marginBottomPopupDetail: 0,
    };

    [
      'changeTab', 'closeCampaignDetail', 'showPopupDetail', 'onSuccess', 'onError',
      'fetchListLogicSetting', 'fetchSettingWorkerSuccess', 'fetchListBetPatternCustom',
      'onChangePage', 'onChangePageSuccess',
    ].forEach((method) => {
      this[method] = this[method].bind(this);
    });
    this.onResize = this.onResize.bind(this);
    this.onOrientationChange = this.onOrientationChange.bind(this);
    this.popUpDetailRef = createRef();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onOrientationChange);
  }

  checkDraftData() {
    let isShowModalDetail = false;
    let selectTedId = null;
    if (this.autoSave.checkDraft(AUTO_SAVE_KEY.popupDetail)) {
      isShowModalDetail = true;
      const contentDraft = this.autoSave.getDraftContent(AUTO_SAVE_KEY.popupDetail);
      selectTedId = contentDraft.dataInfoPopup ? contentDraft.dataInfoPopup.id : null;
      if (contentDraft.dataInfoPopup.logic_pattern_name !== undefined) {
        this.changeTab(TABS.LIST_LOGIC_BET.id);
      }
      if (contentDraft.dataInfoPopup.bet_pattern_name !== undefined) {
        this.changeTab(TABS.LIST_BET_PATTERN.id);
      }
    }
    this.setState({
      isShowModalDetail,
      selectTedId,
    });
  }

  componentDidMount() {
    this.fetchSettingWorker();
    if (this.autoSave.checkDraft(AUTO_SAVE_KEY.popupDetail)) {
      Alert.instance.showAlertTwoButtons(
        i18n.t('warning'),
        i18n.t('settingLogic.draft.ask'),
        [i18n.t('cancel'), i18n.t('yes')],
        [
          () => {
            Alert.instance.hideAlert();
            this.autoSave.deleteDraft();
          },
          () => {
            Alert.instance.hideAlert();
            this.checkDraftData();
          },
        ],
        () => {
          Alert.instance.hideAlert();
          this.autoSave.deleteDraft();
        },
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    this.autoSave = null;
  }

  onOrientationChange() {
    this.setState({});
  }

  onResize() {
    this.setState({});
  }

  onSuccess(data) {
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      this.setState({ isLoading: false });
    });
  }

  onChangePageSuccess(data) {
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      this.setState({ isLoading: false });
      const element = document.getElementById('WrapperContent');
      if (element) element.scrollTop = 0;
    });
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

  onChangePage(page) {
    const { currentTabId } = this.state;
    this.setState(
      { currentPage: page, isLoading: true },
      () => {
        if (currentTabId === TABS.LIST_LOGIC_BET.id) {
          this.fetchListLogicSetting(page, true);
        } else this.fetchListBetPatternCustom(page, true);
      },
    );
  }

  closeCampaignDetail(isNotSave = true) {
    Keyboard.instance.hideKeyboard();
    if (isNotSave && this.state.totalBotOnInData === 0) {
      Alert.instance.showAlertTwoButtons(
        i18n.t('warning'),
        i18n.t('customCampaign.closePopup'),
        [i18n.t('cancel'), i18n.t('yes')],
        [
          () => {
            Alert.instance.hideAlert();
          },
          () => {
            this.setState({ isShowModalDetail: false, selectTedId: null });
            Alert.instance.hideAlert();
            AutoSave.instance.deleteDraft();
          },
        ],
      );
    } else {
      this.setState({ isShowModalDetail: false, selectTedId: null });
      Alert.instance.hideAlert();
      AutoSave.instance.deleteDraft();
    }
  }

  changeTab(tabId) {
    this.setState({ currentTabId: tabId, currentPage: 1 }, () => {
      this.fetchSettingWorker();
    });
  }

  showPopupDetail(e, dataPopup, totalBotOffInData, totalBotOnInData) {
    this.setState({
      isShowModalDetail: true,
      selectTedId: dataPopup.id,
      totalBotOffInData,
      totalBotOnInData,
    });
    e.stopPropagation();
  }

  fetchSettingWorker() {
    const { actions } = this.props;
    const { currentTabId } = this.state;
    actions.customCampaignAction.getSettingWorker(
      currentTabId, this.fetchSettingWorkerSuccess, this.onError,
    );
  }

  fetchSettingWorkerSuccess(data) {
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      this.setState({ settingWorkerData: data.data });
    });
  }

  fetchListLogicSetting(currPage = 1, willScrollTop = false) {
    this.setState({
      isLoading: true,
    });
    const { currentPage } = this.state;
    const { actions } = this.props;
    actions.customCampaignAction.fetchListLogicSetting(
      willScrollTop ? this.onChangePageSuccess : this.onSuccess,
      this.onError,
      {
        currentPage: currPage || currentPage, perPage: PER_PAGE,
      },
    );
    this.setState({ currentPage: currPage });
  }

  fetchListBetPatternCustom(currPage = 1, willScrollTop = false) {
    this.setState({
      isLoading: true,
    });
    const { currentPage } = this.state;
    const { actions } = this.props;
    actions.customCampaignAction.fetchListBetPatternCustom(
      willScrollTop ? this.onChangePageSuccess : this.onSuccess,
      this.onError,
      {
        currentPage: currPage || currentPage, perPage: PER_PAGE,
      },
    );
    this.setState({ currentPage: currPage });
  }

  setMarginBottomPopupDetail(value) {
    this.setState({ marginBottomPopupDetail: value });
  }

  renderModalDetail() {
    const {
      isShowModalDetail, currentTabId,
      settingWorkerData, selectTedId,
      currentPage, totalBotOffInData, totalBotOnInData,
      isShowHelp, marginBottomPopupDetail,
    } = this.state;
    const {
      isMobile, actions, // fontSize
    } = this.props;
    const fontSize = getPopupDetailFontSize();
    let title = '';
    if (currentTabId === TABS.LIST_LOGIC_BET.id) {
      title = selectTedId ? i18n.t('customCampaign.logicPatternDetail') : i18n.t('customCampaign.createLogic');
    } else {
      title = selectTedId ? i18n.t('customCampaign.betPatternDetail') : i18n.t('customCampaign.createBet');
    }
    return (
      <ModalWrapper
        id="DetailModal"
        isOpen={isShowModalDetail}
        centered
        fontSize={fontSize}
        marginBot={marginBottomPopupDetail}
      >
        <ModalHeaderCustom toggle={() => this.closeCampaignDetail(this.popUpDetailRef.current.checkChangeData())}>
          <TitleWrapper>
            {title}
            <Icon
              src={isShowHelp ? helpImages.iconHelpSelected : helpImages.iconHelpNormal}
              onClick={() => {
                Keyboard.instance.hideKeyboard();
                this.setState({ isShowHelp: true });
              }}
            />
          </TitleWrapper>
        </ModalHeaderCustom>
        <PopUpDetail
          ref={this.popUpDetailRef}
          isMobile={isMobile}
          fontSize={fontSize}
          selectTedId={selectTedId}
          type={currentTabId}
          onClose={this.closeCampaignDetail}
          createOrUpdateData={
            currentTabId === TABS.LIST_LOGIC_BET.id
              ? actions.customCampaignAction.createOrUpdateLoginPattern
              : actions.customCampaignAction.createOrUpdateBetPattern
          }
          callbackFetchData={
            currentTabId === TABS.LIST_LOGIC_BET.id
              ? this.fetchListLogicSetting
              : this.fetchListBetPatternCustom
          }
          settingWorkerData={settingWorkerData}
          getDataPopUp={
            currentTabId === TABS.LIST_LOGIC_BET.id
              ? actions.customCampaignAction.getDetailLogicPattern
              : actions.customCampaignAction.getDetailBetPattern
          }
          currentPage={currentPage}
          totalBotOffInData={totalBotOffInData}
          totalBotOnInData={totalBotOnInData}
          changeMarginBottom={value => this.setMarginBottomPopupDetail(value)}
        />
      </ModalWrapper>
    );
  }

  render() {
    const {
      data, actions,
    } = this.props;
    const {
      currentTabId, isShowModalDetail, settingWorkerData, currentPage, isShowHelp,
    } = this.state;
    const totalRecord = currentTabId === TABS.LIST_LOGIC_BET.id
      ? data.totalLogicSetting : data.totalBetPattern;
    return (
      <Content>
        <ContentContainer
          style={{
            height: 'unset',
            paddingBottom: 0,
          }}
        >
          <ContentHeader>
            {`
            ${i18n.t('total')}: 
            ${currentTabId === TABS.LIST_LOGIC_BET.id
              ? data.totalLogicSetting
              : data.totalBetPattern}
            `}
            {
              (
                currentTabId === TABS.LIST_LOGIC_BET.id
                && data.totalLogicSetting < settingWorkerData.max_logic_pattern
              )
                || (
                  currentTabId === TABS.LIST_BET_PATTERN.id
                  && data.totalBetPattern < settingWorkerData.max_bet_pattern
                )
                ? (
                  <ButtonAddCampaign
                    onClick={
                      () => this.setState({
                        isShowModalDetail: true,
                        selectTedId: null,
                        totalBotOffInData: 0,
                        totalBotOnInData: 0,
                      })
                    }
                  >
                    <IconAdd src={images.add} alt="" />
                    {
                      currentTabId === TABS.LIST_LOGIC_BET.id
                        ? i18n.t('customCampaign.createLogic')
                        : i18n.t('customCampaign.createBet')
                    }
                  </ButtonAddCampaign>

                ) : null
            }
          </ContentHeader>
          <MedianStrip />
          <ContentBody>
            <TabMenu
              tabs={listTabs}
              selectTedId={currentTabId}
              onChangeTab={this.changeTab}
            />
            {
              currentTabId === TABS.LIST_LOGIC_BET.id
                ? (
                  <ListLogicPattern
                    listLogicSetting={data.listLogicSetting}
                    fetchListLogicSetting={this.fetchListLogicSetting}
                    showPopupDetail={this.showPopupDetail}
                    deleteLogicSetting={actions.customCampaignAction.deleteLogicSetting}
                    currentPage={currentPage}
                  />
                )
                : (
                  <ListBetPattern
                    listBetPattern={data.listBetPattern}
                    fetchListBetPatternCustom={this.fetchListBetPatternCustom}
                    showPopupDetail={this.showPopupDetail}
                    deleteBetPattern={actions.customCampaignAction.deleteBetPattern}
                    currentPage={currentPage}
                  />
                )
            }
          </ContentBody>
        </ContentContainer>
        {
          isShowModalDetail && this.renderModalDetail()
        }
        <Blank height={0.5} />
        {totalRecord > PER_PAGE ? (
          <WrapperPaginationCustom>
            <Pagination
              type="autoBot"
              current={currentPage}
              total={totalRecord}
              onChange={this.onChangePage}
              pageSize={PER_PAGE}
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1em',
              }}
            />
          </WrapperPaginationCustom>
        ) : (
          ''
        )}
        <Blank height={0.5} />
        <Keyboard />
        <PopUpHelp
          currentTabId={currentTabId}
          isOpen={isShowHelp}
          onClose={() => { this.setState({ isShowHelp: false }); }}
        />
        <Spinner isLoading={this.state.isLoading} />
      </Content>
    );
  }
}

CustomCampaign.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  fontSize: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    data: {
      listLogicSetting: state.customCampaign.listLogicSetting,
      totalLogicSetting: state.customCampaign.totalLogicSetting,
      listBetPattern: state.customCampaign.listBetPattern,
      totalBetPattern: state.customCampaign.totalBetPattern,
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      customCampaignAction: bindActionCreators(customCampaignAction, dispatch),
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomCampaign);
