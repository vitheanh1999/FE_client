import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Pagination from 'rc-pagination';
import Alert from '../../components/common/Alert/Alert';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import * as customCampaignAction from '../../actions/customCampaign';
import {
  ContentContainer, ContentHeader, MedianStrip, ContentBody, ModalWrapper, ModalHeaderCustom,
  WrapperPaginationCustom,
} from '../../components/common/CommonStyle';
import i18n from '../../i18n/i18n';
import { ButtonAddCampaign, IconAdd, Blank } from '../../components/campaign/campaignStyle';
import images from '../../theme/images';
import TabMenu from '../../components/campaign/detail/TabMenu';
import ListLogicPattern from '../../components/customCampaign/ListLogicPattern';
import ListBetPattern from '../../components/customCampaign/ListBetPattern';
import PopUpDetail from '../../components/customCampaign/PopUpDetail';
import { TABS } from '../../components/customCampaign/CardNoTable';
import Spinner from '../../components/common/Spinner';
import { PER_PAGE } from '../../constants/Constants';

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

const listTabs = Object.values(TABS);

class CustomCampaign extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTabId: TABS.LIST_LOGIC_BET.id,
      isShowModalDetail: false,
      selectTedId: null,
      isLoading: false,
      settingWorkerData: {},
      currentPage: 1,
    };

    [
      'changeTab', 'closeCampaignDetail', 'showPopupDetail', 'onSuccess', 'onError',
      'fetchListLogicSetting', 'fetchSettingWorkerSuccess', 'fetchListBetPatternCustom',
      'onChangePage',
    ].forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    this.fetchSettingWorker();
  }

  onSuccess(data) {
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      this.setState({ isLoading: false });
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
          this.fetchListLogicSetting(page);
        } else this.fetchListBetPatternCustom(page);
      },
    );
  }

  closeCampaignDetail() {
    this.setState({ isShowModalDetail: false, selectTedId: null });
  }

  changeTab(tabId) {
    this.setState({ currentTabId: tabId, currentPage: 1 }, () => {
      this.fetchSettingWorker();
    });
  }

  showPopupDetail(dataPopup) {
    this.setState({ isShowModalDetail: true, selectTedId: dataPopup.id });
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

  fetchListLogicSetting(currPage = 1) {
    this.setState({
      isLoading: true,
    });
    const { currentPage } = this.state;
    const { actions } = this.props;
    actions.customCampaignAction.fetchListLogicSetting(this.onSuccess, this.onError, {
      currentPage: currPage || currentPage, perPage: PER_PAGE,
    });
    this.setState({ currentPage: currPage });
  }

  fetchListBetPatternCustom(currPage = 1) {
    this.setState({
      isLoading: true,
    });
    const { currentPage } = this.state;
    const { actions } = this.props;
    actions.customCampaignAction.fetchListBetPatternCustom(this.onSuccess, this.onError, {
      currentPage: currPage || currentPage, perPage: PER_PAGE,
    });
    this.setState({ currentPage: currPage });
  }

  renderModalDetail() {
    const {
      isShowModalDetail, currentTabId, settingWorkerData, selectTedId, currentPage,
    } = this.state;
    const {
      isMobile, fontSize, actions,
    } = this.props;
    let title = '';
    if (currentTabId === TABS.LIST_LOGIC_BET.id) {
      title = selectTedId ? i18n.t('customCampaign.logicPatternDetail') : i18n.t('customCampaign.addALogicPattern');
    } else {
      title = selectTedId ? i18n.t('customCampaign.betPatternDetail') : i18n.t('customCampaign.addABetPattern');
    }
    return (
      <ModalWrapper
        id="DetailModal"
        isOpen={isShowModalDetail}
        centered
        isMobile={isMobile}
      >
        <ModalHeaderCustom toggle={this.closeCampaignDetail}>
          {title}
        </ModalHeaderCustom>
        <PopUpDetail
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
        />
      </ModalWrapper>
    );
  }

  render() {
    const {
      data, actions,
    } = this.props;
    const {
      currentTabId, isShowModalDetail, settingWorkerData, currentPage,
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
                      () => this.setState({ isShowModalDetail: true, selectTedId: null })
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
