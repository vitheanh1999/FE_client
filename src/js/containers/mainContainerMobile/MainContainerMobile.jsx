import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { TAB } from '../../constants/Constants';
import * as authActions from '../../actions/auth';
import * as burstActions from '../../actions/Burst';
import * as botsActions from '../../actions/ListBots';
import * as loginActions from '../../actions/login';
import Deposit from '../deposit/Deposit';
import StorageUtils from '../../helpers/StorageUtils';
import TabMenuMobile from '../../components/menu/TabMenuMobile';
import Alert from '../../components/common/Alert/Alert';
import Terms from '../../components/termsAndPolicy/Terms';
import Policy from '../../components/termsAndPolicy/Policy';
import HeaderMobile from '../../components/mainContainer/HeaderMobile';
import i18n from '../../i18n/i18n';
import DashboardMobile from '../../components/dashboardMobile/DashboardMobile';
import RevenueMobile from '../revenue/RevenueMobile';
import ListBotsMobile from '../listBots/ListBotsMobile';
import BaseContainer from './BaseContainer';
import { CompanyInfo } from '../../constants/login';
import BurstGuardMobile from '../burstGuard/BurstGuardMobile';
import * as maintainActions from '../../actions/maintain';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: ${props => props.fontSize}px;
`;

const WrapperContent = styled.div`
  flex: 1;
  width: 100%;
  background-color: #dee3e4;
  overflow: scroll;
  overflow-x: hidden;
`;

class MainContainerMobile extends BaseContainer {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: {
        name: '',
        key: '',
        subTitle: '',
        value: 0,
        isShow: true,
      },
      isShowedMessage: false,
      isShowMenu: false,
    };
    this.timeOutChangeTab = null;
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.logout = this.logout.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
  }

  componentDidMount() {
    this.checkMaintain();
    const state = this.restoreState();
    const { isShowedMessage } = this.state;
    let checkShowMessage = isShowedMessage;
    if (state) {
      this.setState(state);
      checkShowMessage = state.isShowedMessage;
    } else {
      this.setState({ activeTab: TAB.DASHBOARD });
    }
    if (checkShowMessage === false) {
      Alert.instance.showAlert(
        i18n.t('warning'),
        i18n.t('messageAfterLogin'),
        i18n.t('OK'),
        () => {
          this.setState({ isShowedMessage: true });
          Alert.instance.hideAlert();
        },
      );
    }

    const { fetchUser } = this.props;
    fetchUser(this.onSuccess, this.onError);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeTab !== this.state.activeTab) {
      this.props.fetchUser(this.onSuccess, this.onError);
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.setState({});
  }

  onSuccess() {
    this.setState({});
  }

  onError() {
    this.setState({});
  }

  logout() {
    this.props.logout();
    StorageUtils.clearInfoLogout();
    const companyInfo = StorageUtils.getCompanyInfo();
    if (companyInfo && companyInfo.url) {
      this.props.history.push(`/login/${companyInfo.url}`);
    } else {
      this.props.history.push(`/login/${CompanyInfo.url}`);
    }
  }

  handleLogout() {
    Alert.instance.showAlertTwoButtons(
      'WARNING',
      i18n.t('logoutMessage'),
      [i18n.t('cancel'), i18n.t('OK')],
      [
        () => Alert.instance.hideAlert(),
        () => this.logout(),
      ],
    );
  }

  handleChangeTab(newTab) {
    const { activeTab } = this.state;
    if (newTab.value !== activeTab.value) {
      this.setState({
        activeTab: newTab,
        isShowMenu: false,
      });
    } else {
      this.setState({ isShowMenu: false });
    }
  }

  closeMenu() {
    this.setState({
      isShowMenu: false,
    });
  }

  renderContent() {
    const {
      activeTab,
    } = this.state;
    const { data } = this.props;
    let tab = null;
    switch (activeTab.value) {
      case TAB.DASHBOARD.value:
        tab = (
          <DashboardMobile
            labels={data.listBots.chartData.labels}
            revenueHistory={data.listBots.chartData.gc}
            lastestUpdateAt={data.listBots.chartData.lastestUpdateAt}
            userInfo={data.user}
            fetchListBots={this.props.fetchListBots}
            listBots={data.listBots.bots}
            fetchBurstStatus={this.props.fetchBurstStatus}
            handleChangeTab={this.handleChangeTab}
            fetchChartData={this.props.fetchChartData}
          />
        );
        break;
      // case TAB.CONNECT_TO_LUC.value:
      //   tab = (
      //     <LucAccountConnection
      //       fetchUser={this.props.fetchUser}
      //       connectLucAccount={this.props.connectLucAccount}
      //       user={this.props.data.user}
      //       handleChangeTab={this.handleChangeTab}
      //     />
      //   );
      //   break;
      case TAB.REVENUE.value:
        tab = (
          <RevenueMobile />
        );
        break;
      case TAB.BOT.value:
        tab = (
          <ListBotsMobile handleChangeTab={this.handleChangeTab} />
        );
        break;
      case TAB.BURST_GUARD.value:
        tab = (
          <BurstGuardMobile />
        );
        break;
      case TAB.DEPOSIT.value:
        tab = (
          <Deposit />
        );
        break;
      case TAB.TERMS.value:
        tab = (
          <Terms />
        );
        break;
      case TAB.POLICY.value:
        tab = (
          <Policy />
        );
        break;
      default: break;
    }
    return (
      <WrapperContent>{tab}</WrapperContent>
    );
  }

  render() {
    const { activeTab, isShowMenu } = this.state;
    const companyInfo = StorageUtils.getCompanyInfo();
    const { data } = this.props;
    return (
      <Wrapper fontSize={18}>
        <HeaderMobile
          companyInfo={companyInfo}
          screenName={i18n.t(activeTab.key)}
          onClickMenu={() => this.setState({ isShowMenu: true })}
          handleChangeTab={this.handleChangeTab}
        />
        {this.renderContent()}
        {isShowMenu && (
          <TabMenuMobile
            handleChangeTab={this.handleChangeTab}
            closeMenu={this.closeMenu}
            userInfo={data.user.detail}
            logout={this.handleLogout}
          />
        )}
        <Alert />
      </Wrapper>
    );
  }
}

MainContainerMobile.defaultProps = {
};

MainContainerMobile.propTypes = {
  fetchUser: PropTypes.func.isRequired,
  connectLucAccount: PropTypes.func.isRequired,
  fetchListBots: PropTypes.func.isRequired,
  fetchBurstStatus: PropTypes.func.isRequired,
  fetchChartData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  maintainInfo: PropTypes.objectOf(PropTypes.any),
};

const mapStateToProps = state => ({
  data: {
    user: state.User,
    listBots: state.ListBots,
    burst: state.Burst,
  },
  maintainInfo: state.Maintain.maintainInfo,
});

const mapDispatchToProps = dispatch => ({
  fetchUser: bindActionCreators(authActions.fetchUser, dispatch),
  connectLucAccount: bindActionCreators(authActions.connectLucAccount, dispatch),
  fetchListBots: bindActionCreators(botsActions.fetchListBots, dispatch),
  fetchBurstStatus: bindActionCreators(burstActions.fetchBurstStatus, dispatch),
  fetchChartData: bindActionCreators(botsActions.fetchChartData, dispatch),
  logout: bindActionCreators(loginActions.logout, dispatch),
  setMaintainInfo: bindActionCreators(maintainActions.setMaintainInfo, dispatch),
  fetchMaintainInfo: bindActionCreators(maintainActions.fetchMaintainInfo, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainContainerMobile);
