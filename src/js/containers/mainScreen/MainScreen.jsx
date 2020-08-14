import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import Helmet from 'react-helmet';
import { TAB } from '../../constants/Constants';
import * as authActions from '../../actions/auth';
import * as burstActions from '../../actions/Burst';
import * as botsActions from '../../actions/ListBots';
import * as loginActions from '../../actions/login';
import TabMenu from '../../components/menu/TabMenu';
import images from '../../theme/images';
// import LucAccountConnection from '../../components/dashboard/LucAccountConnection';
import Charge from '../charge/charge';
import Header from '../../components/common/Header/Header';
import Alert from '../../components/common/Alert/Alert';
import ToastControl from '../../components/common/Toast/ToastControl';
import Campaign from '../campaign/Campaign';
import DashBoard from '../dashboard/DashBoard';
import ListBots from '../listBots/ListBots';
import Revenue from '../revenue/Revenue';
import { PAGE_TYPE } from '../../constants/auth';
import { SCREEN_SIZE } from '../../constants/screenSize';
import {
  TabContent, WrapperMenu, Background, Content, WrapperContent,
} from './mainScreenStyle';
import BaseContainer from '../mainContainerMobile/BaseContainer';
import * as maintainActions from '../../actions/maintain';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import StorageUtils from '../../helpers/StorageUtils';
import { getCompanyInfo } from '../../components/login/SignIn';
import { ORIENTATION, checkOrientation } from '../../helpers/system';
import MobileMenu from '../../components/menu/MobileMenu';
import ListNewsAll from '../news/ListNewAll';
// import { CompanyInfo } from '../../constants/login';
import i18n from '../../i18n/i18n';
import CustomCampaign from '../customCampaign/CustomCampaign';

export const calculatorFontSize = () => {
  let screenWidth = window.innerWidth;
  // const browserZoomLevel = window.devicePixelRatio;
  const browserZoomLevel = 1;
  screenWidth *= browserZoomLevel;
  if (screenWidth > SCREEN_SIZE.width4k) return 40 / browserZoomLevel;
  if (screenWidth > SCREEN_SIZE.width2k) return 21 / browserZoomLevel;
  if (screenWidth > SCREEN_SIZE.width1k8) return 20 / browserZoomLevel;
  if (screenWidth > SCREEN_SIZE.width1k6) return 19 / browserZoomLevel;
  if (screenWidth > SCREEN_SIZE.xl) return 18 / browserZoomLevel; // >=1200
  if (screenWidth > SCREEN_SIZE.lg) return 18 / browserZoomLevel; // >=992
  if (screenWidth > SCREEN_SIZE.md) return 16 / browserZoomLevel; // >=768
  if (screenWidth > SCREEN_SIZE.sm) return 12 / browserZoomLevel; // >=576
  return 10 / browserZoomLevel;
};

class MainScreen extends BaseContainer {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: TAB.DASHBOARD,
      orient: checkOrientation(),
      showMobileMenu: false,
      // isShowedMessage: false,
    };

    this.timeOutChangeTab = null;
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
    this.onOrientationChange = this.onOrientationChange.bind(this);
    window.addEventListener('orientationchange', this.onOrientationChange);
  }

  componentDidMount() {
    super.componentDidMount();
    this.checkMaintain();
    const state = this.restoreState();
    if (state) {
      this.setState(state);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeTab !== this.state.activeTab) {
      this.props.fetchUser(this.onSuccess, this.onError);
    }
    if (prevProps.lang !== this.props.lang) {
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    window.removeEventListener('resize', this.onResize);
  }

  onOrientationChange() {
    const orient = checkOrientation();
    this.setState({
      orient,
      showMobileMenu: false,
    });
  }

  onResize() {
    this.setState({});
  }

  onSuccess(data) {
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      if (data && data.data && data.data.provider_code) {
        StorageUtils.setCompanyInfo(getCompanyInfo(data.data.provider_code));
      }
    }, null);
    this.setState({});
  }

  onError(error) {
    ApiErrorUtils.handleHttpError(error, Alert.instance, null, null);
    this.setState({});
  }

  handleChangeTab(newTab) {
    const { activeTab } = this.state;
    if (newTab.value === TAB.GUIDE.value) {
      window.open(TAB.GUIDE.key);
    } else if (newTab.value !== activeTab.value) {
      this.setState({ activeTab: newTab });
    }
    this.setState({ showMobileMenu: false });
  }

  logout() {
    this.props.logout();
    StorageUtils.clearInfoLogout();
    this.props.history.push({ pathname: '/', search: `?pageType=${PAGE_TYPE.LOGIN}` });
  }

  handleLogout() {
    Alert.instance.showAlertTwoButtons(
      i18n.t('warning'),
      i18n.t('logoutMessage'),
      [i18n.t('cancel'), i18n.t('OK')],
      [
        () => Alert.instance.hideAlert(),
        () => this.logout(),
      ],
    );
  }

  renderTabContent() {
    const { activeTab, orient } = this.state;
    const fontSize = calculatorFontSize();
    const checkLandscape = (orient === ORIENTATION.Landscape);
    let tab;
    switch (activeTab.value) {
      case TAB.DASHBOARD.value:
        tab = (
          <DashBoard
            handleChangeTab={this.handleChangeTab}
            portrait={!checkLandscape}
          />
        );
        break;
      case TAB.REVENUE.value:
        tab = (
          <Revenue />
        );
        break;
      case TAB.BOT.value:
        tab = (
          <ListBots
            handleChangeTab={this.handleChangeTab}
            fontSize={fontSize}
            isMobile={!checkLandscape}
          />
        );
        break;
      case TAB.NEWS.value:
        tab = (
          <ListNewsAll
            fontSize={fontSize}
            isMobile={!checkLandscape}
          />
        );
        break;
      case TAB.CAMPAIGN.value:
        tab = (
          <Campaign
            isMobile={!checkLandscape}
            fontSize={fontSize}
          />
        );
        break;
      case TAB.CUSTOM_CAMPAIGN.value:
        tab = (
          <CustomCampaign
            isMobile={!checkLandscape}
            fontSize={fontSize}
          />
        );
        break;
      case TAB.CHARGE.value:
        tab = (
          <Charge fontSize={calculatorFontSize()} isMobile={!checkLandscape} />
        );
        break;
      default: break;
    }
    return (
      <WrapperContent id="WrapperContent">
        {tab}
      </WrapperContent>
    );
  }

  renderMenu() {
    const { activeTab } = this.state;
    const { maintainInfo, data } = this.props;
    const { totalNew } = data;
    return (
      <WrapperMenu id="menu">
        <TabMenu
          index={activeTab.value}
          onChange={this.handleChangeTab}
          maintainInfo={maintainInfo}
          notify={{ news: totalNew }}
        />
      </WrapperMenu>
    );
  }

  render() {
    const { fetchUser, data } = this.props;
    const { activeTab, orient, showMobileMenu } = this.state;
    const fontSize = calculatorFontSize() * 0.95;
    const { totalNew } = data;
    return (
      <Background fontSize={fontSize}>
        {(orient === ORIENTATION.Landscape) && this.renderMenu()}
        <Helmet>
          <title>Fifties Hacker</title>
          {/* <link rel="shortcut icon" href={images.FEFavicon} /> */}
          <link rel="icon" type="image/png" sizes="180x180" href={images.FEFavicon} />
          <meta name="title" content="Default Title" />
        </Helmet>
        <Content>
          <Header
            tabInfo={activeTab}
            fetchUser={fetchUser}
            userInfo={data.user}
            handleChangeTab={this.handleChangeTab}
            logout={this.handleLogout}
            orient={orient}
            openMenu={() => this.setState({ showMobileMenu: true })}
          />
          <TabContent fontSize={fontSize}>
            {
              this.renderTabContent()
            }
          </TabContent>
          {
            showMobileMenu && (
              <MobileMenu
                handleChangeTab={this.handleChangeTab}
                activeTab={activeTab}
                closeMenuTab={() => this.setState({ showMobileMenu: false })}
                fontSize={fontSize}
                logout={this.handleLogout}
                notify={{ news: totalNew }}
              />
            )
          }
        </Content>
        <Alert />
        <ToastControl />
      </Background>
    );
  }
}

MainScreen.defaultProps = {
};

MainScreen.propTypes = {
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
    totalNew: state.news.totalNew,
  },
  maintainInfo: state.Maintain.maintainInfo,
  lang: state.Language.lang,
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

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
