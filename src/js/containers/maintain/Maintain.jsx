import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import Helmet from 'react-helmet';
import Alert from '../../components/common/Alert/Alert';
import ApiErrorUtils, { redirectToLogin } from '../../helpers/ApiErrorUtils';
import ApiErrorCode from '../../constants/apiErrorCode';
import {
  Wrapper, Copyright, WrapperContent, Title,
  Content, DurationTime, WrapperLogo, Logo,
  WrapperTop, WrapperCenter,
} from './maintenaceStyle';
import i18n from '../../i18n/i18n';
import images from '../../../assets/images';
import * as maintainActions from '../../actions/maintain';
import StorageUtils from '../../helpers/StorageUtils';
import { socketConnectionDashboard } from '../../components/viewScreenGame/Utils';
import { FORMAT_DATE } from '../../constants/Constants';
// import { PRODUCT_MODE } from '../../constants/ProductType';
import { renderCopyright } from '../../components/menu/TabMenu';
import { LightningTop, LightningBot } from '../auth/authStyle';
import { ButtonCore } from '../../components/mainContainer/mainStyle';
import ListNewsPublic from '../news/ListNewsPublic';
import { ENABLE_NEWS } from '../../config/localConfig';
import { calculatorFontSize } from '../login/SuperLogin';

const cancelPusherMaintain = (socket) => {
  socket.unsubscribe('channel-system-maintain');
};

const registerMaintainPush = (socket) => {
  const nameChannelSystemStatus = 'channel-system-maintain';
  const startChannelSystemStatus = socket.subscribe(nameChannelSystemStatus);
  startChannelSystemStatus.bind('system-maintain', (event) => {
    if (!event.status) {
      redirectToLogin();
    }
  });
};

export const MAINTAIN_STATUS = {
  NoMaintain: 0,
  MaintainNow: 1,
};

// const getMaintainBackground = () => images.maintainDBACBackground;

const linkify = (text) => {
  if (!text) {
    return '';
  }
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
  const dangerDom = <Content dangerouslySetInnerHTML={{ __html: text.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`) }} />;
  return <Fragment>{dangerDom}</Fragment>;
};

class Maintain extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
    this.socket = socketConnectionDashboard;
  }

  componentWillMount() {
  }

  componentDidMount() {
    Alert.instance.hideAlert();
    registerMaintainPush(this.socket);
    StorageUtils.clearInfoLogout();
    const { maintainInfo, fetchMaintainInfo } = this.props;
    if (!Object.keys(maintainInfo.maintainInfo).length) {
      setTimeout(() => fetchMaintainInfo(this.onSuccess, this.onError), 100);
    }
  }

  componentWillUnmount() {
    cancelPusherMaintain(this.socket);
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.setState({});
  }

  onSuccess(data) {
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      const { status } = data;
      if (status !== MAINTAIN_STATUS.MaintainNow) {
        redirectToLogin();
      }
    });
    this.setState({});
  }

  onError(data) {
    ApiErrorUtils.handleHttpError(data, Alert.instance, () => {
      const { code } = data.data;
      if (code === ApiErrorCode.MAINTENANCE) {
        this.props.setMaintainInfo(data.data);
      }
    });
  }

  renderButtonBackToTop() {
    return (
      <ButtonCore
        hoverBgColor="#23B083"
        color="#105463"
        padding="0 1em 0 1em"
        height="2em"
        width="5em"
        borderRadiusor={0.1}
        fontSize="1.2em"
        onClick={() => this.props.history.push('/')}
      >
        {i18n.t('backToTop')}
      </ButtonCore>
    );
  }

  render() {
    const { maintainInfo } = this.props;
    const hasMaintainInfo = maintainInfo.maintainInfo
      && Object.keys(maintainInfo.maintainInfo).length;
    const description = hasMaintainInfo && maintainInfo.maintainInfo.description
      ? maintainInfo.maintainInfo.description : i18n.t('contentMaintain');
    // let startPlan = '';
    let endPlan = '';
    if (hasMaintainInfo) {
      // startPlan = moment(
      // maintainInfo.maintainInfo.start_plan
      // ).add(moment().utcOffset(), 'm').format(`${FORMAT_DATE} hh:mm A`);
      endPlan = moment(maintainInfo.maintainInfo.end_plan).add(moment().utcOffset(), 'm').format(`${FORMAT_DATE} hh:mm A`);
    }
    // const maintainBackground = getMaintainBackground();
    const hasLogo = true;
    const fontSize = calculatorFontSize();
    return (
      <Wrapper src={images.backgroundCaro} fontSize={fontSize}>
        <LightningTop src={images.topLightning} />
        <LightningBot src={images.bottomLightning} />
        <Helmet>
          <title>Fifties Hacker</title>
          <link rel="icon" type="image/png" sizes="180x180" href={images.FEFavicon} />
          <meta name="title" content="Default Title" />
        </Helmet>
        <WrapperCenter>
          <WrapperContent>
            {
              hasLogo && (
                <WrapperLogo>
                  <Logo src={images.logoFE} />
                </WrapperLogo>
              )
            }
            <Title>
              {i18n.t('titleMaintain')}
            </Title>
            {linkify(description)}
            {/* {i18n.t('contentMaintain')} */}
            <DurationTime>
              {i18n.t('timeEnd')}
              {/* <span></span> */}
              {endPlan}
            </DurationTime>
          </WrapperContent>
          <WrapperTop>{this.renderButtonBackToTop()}</WrapperTop>
        </WrapperCenter>
        <Copyright>
          {renderCopyright()}
        </Copyright>
        <Alert />
        {
          ENABLE_NEWS && <ListNewsPublic fontSize={fontSize} isMobile={isMobile} />
        }

      </Wrapper>
    );
  }
}

Maintain.propTypes = {
  fetchMaintainInfo: PropTypes.func.isRequired,
  setMaintainInfo: PropTypes.func.isRequired,
  maintainInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.oneOfType([PropTypes.object, PropTypes.number]).isRequired,
};

const mapStateToProps = state => ({
  maintainInfo: state.Maintain,
});

const mapDispatchToProps = dispatch => ({
  fetchMaintainInfo: bindActionCreators(maintainActions.fetchMaintainInfo, dispatch),
  setMaintainInfo: bindActionCreators(maintainActions.setMaintainInfo, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Maintain);
