import React, { Fragment } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import Alert from '../../components/common/Alert/Alert';
import NotFound from '../notFound/NotFound';
import i18n from '../../i18n/i18n';
import StorageUtils, { STORAGE_KEYS } from '../../helpers/StorageUtils';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import ApiErrorCode from '../../constants/apiErrorCode';
import { MEMBER_ROLES, PAGE_TYPE } from '../../constants/auth';
import { ORIENTATION, checkOrientation } from '../../helpers/system';
import { registerMaintainPush, cancelPusherMaintain } from '../mainContainerMobile/BaseContainer';
import { ButtonCore } from '../../components/mainContainer/mainStyle';
import ListNewsPublic from '../news/ListNewsPublic';
import { socketConnectionDashboard } from '../../components/viewScreenGame/Utils';
import securityActions from '../../constants/securityActions';
import SignIn from '../../components/login/SignIn';
import {
  Wrapper, LightningTop,
  Shadow, LightningBot,
} from '../auth/authStyle';
import { SCREEN_SIZE } from '../../constants/screenSize';
import images from '../../../assets/images';
import { ENABLE_NEWS } from '../../config/localConfig';

const LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

const MAINTAIN_STATUS = {
  NoMaintain: 0,
  MaintainNow: 1,
};

const TITLE_PAGE = {
  WELCOME: 'welcomePage',
  SIGN_IN: 'signInPage',
  REGISTER: 'registerPage',
};

const calculatorFontSizeWidth = () => {
  let screenWidth = window.innerWidth;
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

const calculatorFontSizeHeight = () => {
  const screenHeight = window.innerHeight;
  const scale = 0.7;
  if (screenHeight > (SCREEN_SIZE.width4k * scale)) return 40;
  if (screenHeight > (SCREEN_SIZE.width2k * scale)) return 21;
  if (screenHeight > (SCREEN_SIZE.width1k8 * scale)) return 20;
  if (screenHeight > (SCREEN_SIZE.width1k6 * scale)) return 19;
  if (screenHeight > (SCREEN_SIZE.xl * scale)) return 18; // >=1200
  if (screenHeight > (SCREEN_SIZE.lg * scale)) return 18; // >=992
  if (screenHeight > (SCREEN_SIZE.md * scale)) return 16; // >=768
  if (screenHeight > (SCREEN_SIZE.sm * scale)) return 12; // >=576
  return 10;
};

export const calculatorFontSize = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const ratio = screenWidth / screenHeight;
  if (ratio > 1.7) {
    return calculatorFontSizeHeight();
  }
  return calculatorFontSizeWidth();
};

class SuperLogin extends NotFound {
  constructor(props) {
    super(props);
    this.state = {
      titlePage: TITLE_PAGE.SIGN_IN,
    };

    this.refAlert = null;
    this.getAlertRef = this.getAlertRef.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.goToScreen = this.goToScreen.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onCheckMaintainSuccess = this.onCheckMaintainSuccess.bind(this);
    this.onCheckMaintainError = this.onCheckMaintainError.bind(this);
    window.addEventListener('resize', this.onResize);
    this.socket = socketConnectionDashboard;
  }

  componentWillMount() {
    StorageUtils.clearInfoLogout();
  }

  componentDidMount() {
    // const { fetchMaintainInfo } = this.props;
    // fetchMaintainInfo(this.onCheckMaintainSuccess, this.onCheckMaintainError);
    registerMaintainPush(this.socket);
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    cancelPusherMaintain(this.socket);
    window.removeEventListener('resize', this.onResize);
  }

  onCheckMaintainSuccess(data) {
    const role = StorageUtils.getSectionStorageItem(STORAGE_KEYS.userRole);
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      const { status } = data;
      if (
        status === MAINTAIN_STATUS.MaintainNow
        && parseInt(role, 10) !== MEMBER_ROLES.SUPER_USER.value
      ) {
        this.goMaintainScreen();
      }
    });
  }

  onCheckMaintainError(data) {
    const role = StorageUtils.getSectionStorageItem(STORAGE_KEYS.userRole);
    ApiErrorUtils.handleHttpError(data, Alert.instance, () => {
      const { code } = data.data;
      if (
        code === ApiErrorCode.MAINTENANCE
        && parseInt(role, 10) !== MEMBER_ROLES.SUPER_USER.value
      ) {
        this.goMaintainScreen();
      }
    });
  }

  onResize() {
    this.setState({});
  }

  goMaintainScreen() {
    this.goToScreen('/maintain');
  }

  goToScreen(path) {
    const { history } = this.props;
    history.push(path);
  }

  getAlertRef() {
    return this.refAlert;
  }

  handleChangeForm(titleNewPage) {
    const { titlePage } = this.state;
    if (titleNewPage !== titlePage) {
      this.setState({ titlePage: titleNewPage });
    }
  }

  renderButtonBackToTop() {
    return (
      <ButtonCore
        hoverBgColor="#23B083"
        color="#105463"
        padding="0 1em 0 1em"
        margin="1em"
        height="2em"
        width="5em"
        borderRadiusor={0.1}
        fontSize="1.2em"
        onClick={() => this.props.onChangePageType(PAGE_TYPE.LIGHTNING)}
      >
        {i18n.t('backToTop')}
      </ButtonCore>
    );
  }

  renderForm() {
    const {
      login,
      submitCode,
      sendCode,
    } = this.props;

    const checkLandscape = (checkOrientation() === ORIENTATION.Landscape);
    return (
      <LoginForm>
        <SignIn
          onLogin={login}
          getAlertRef={this.getAlertRef}
          handleChangeForm={this.handleChangeForm}
          titlePage={TITLE_PAGE}
          goToScreen={this.goToScreen}
          submitCode={submitCode}
          sendCode={sendCode}
          actionCode={securityActions.login.actionCode}
        />
        {this.renderButtonBackToTop()}
        {
          ENABLE_NEWS
          && <ListNewsPublic fontSize={calculatorFontSize()} isMobile={!checkLandscape} />
        }
      </LoginForm>
    );
  }

  render() {
    const checkNotFound = this.renderNotFound();
    if (checkNotFound) return checkNotFound;

    const fontSize = calculatorFontSize();
    return (
      <Fragment>
        <Wrapper id="root-content" fontSize={fontSize}>
          <Helmet>
            <title>Fifties Hacker</title>
            <link rel="icon" type="image/png" sizes="180x180" href={images.FEFavicon} />
            <meta name="title" content="Default Title" />
          </Helmet>
          <Shadow />
          <LightningTop src={images.topLightning} />
          <LightningBot src={images.bottomLightning} />
          {this.renderForm()}
          <Alert ref={(ref) => { this.refAlert = ref; }} />
        </Wrapper>
      </Fragment>
    );
  }
}

SuperLogin.propTypes = {
  login: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  fetchMaintainInfo: PropTypes.func.isRequired,
  history: PropTypes.oneOfType([PropTypes.object, PropTypes.number]).isRequired,
  submitCode: PropTypes.func.isRequired,
  sendCode: PropTypes.func.isRequired,
  onChangePageType: PropTypes.func.isRequired,
};

export default SuperLogin;
