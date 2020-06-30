import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Alert from '../../components/common/Alert/Alert';
import NotFound from '../notFound/NotFound';
import StorageUtils, { STORAGE_KEYS } from '../../helpers/StorageUtils';
import { calculatorFontSize } from '../login/SuperLogin';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import ApiErrorCode from '../../constants/apiErrorCode';
import { MEMBER_ROLES, PAGE_TYPE } from '../../constants/auth';
import { registerMaintainPush, cancelPusherMaintain } from '../mainContainerMobile/BaseContainer';
import { ORIENTATION, checkOrientation } from '../../helpers/system';
import { socketConnectionDashboard } from '../../components/viewScreenGame/Utils';
import LightningBody from '../../components/lightning/LightningBody';
import Describe from '../../components/lightning/Describe';
import {
  WrapperLightning, LightningTop,
  Shadow, LightningBot,
} from '../auth/authStyle';
import images from '../../../assets/images';
import ListNewsPublic from '../news/ListNewsPublic';
import Login from '../login/Login';
import { ENABLE_NEWS } from '../../config/localConfig';

const MAINTAIN_STATUS = {
  NoMaintain: 0,
  MaintainNow: 1,
};

class Lightning extends NotFound {
  constructor(props) {
    super(props);
    const { location } = this.props;
    const affiliateCode = location.location ? new URLSearchParams(location.location.search).get('ref') : new URLSearchParams(location.search).get('ref');
    const pageType = new URLSearchParams(location.search).get('pageType') || PAGE_TYPE.LIGHTNING;
    StorageUtils.setSectionStorageItem(STORAGE_KEYS.affiliateCode, affiliateCode);
    this.state = {
      pageType: Number(pageType),
    };

    this.refAlert = null;
    this.getAlertRef = this.getAlertRef.bind(this);
    this.goToScreen = this.goToScreen.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onCheckMaintainSuccess = this.onCheckMaintainSuccess.bind(this);
    this.onCheckMaintainError = this.onCheckMaintainError.bind(this);
    this.onChangePageType = this.onChangePageType.bind(this);
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
    this.props.history.replace('', null);
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

  onChangePageType(pageType) {
    this.setState({ pageType });
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

  renderLightning() {
    const checkNotFound = this.renderNotFound();
    if (checkNotFound) return checkNotFound;
    const fontSize = calculatorFontSize();
    const checkLandscape = (checkOrientation() === ORIENTATION.Landscape);
    return (
      <WrapperLightning
        id="root-content"
        fontSize={fontSize}
      >
        <Helmet>
          <title>Fifties Hacker</title>
          <link rel="icon" type="image/png" sizes="180x180" href={images.FEFavicon} />
          <meta name="title" content="Default Title" />
        </Helmet>
        <LightningTop src={images.topLightning} />
        <LightningBot src={images.bottomLightning} />
        <Shadow>
          <LightningBody onChangePageType={this.onChangePageType} />
          <Describe onChangePageType={this.onChangePageType} />
          {
            ENABLE_NEWS && <ListNewsPublic fontSize={fontSize} isMobile={!checkLandscape} />
          }
        </Shadow>
        <Alert ref={(ref) => { this.refAlert = ref; }} />
      </WrapperLightning>
    );
  }

  render() {
    const { history } = this.props;
    const { pageType } = this.state;
    if (pageType === PAGE_TYPE.LOGIN) {
      return (<Login onChangePageType={this.onChangePageType} history={history} />);
    }
    return this.renderLightning();
  }
}

Lightning.propTypes = {
  history: PropTypes.oneOfType([PropTypes.object, PropTypes.number]).isRequired,
};

export default Lightning;
