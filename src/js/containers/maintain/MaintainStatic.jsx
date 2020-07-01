import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';
import Alert from '../../components/common/Alert/Alert';
import { redirectToLogin } from '../../helpers/ApiErrorUtils';
import {
  Wrapper, Copyright, WrapperContent, Title,
  Content, DurationTime, WrapperLogo, Logo,
} from './maintenaceStyle';
import i18n from '../../i18n/i18n';
import images from '../../../assets/images';
import StorageUtils from '../../helpers/StorageUtils';
import { socketConnectionDashboard } from '../../components/viewScreenGame/Utils';
import ListNewsPublic from '../news/ListNewsPublic';
import { renderCopyright } from '../../components/menu/TabMenu';
import { LightningTop, LightningBot } from '../auth/authStyle';
import { calculatorFontSize } from '../login/SuperLogin';
import {
  // ENABLE_MAINTAIN_STATIC,
  MAINTAIN_STATIC_COTENT,
  MAINTAIN_STATIC_ENDTIME,
  ENABLE_NEWS,
} from '../../config/localConfig';

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
  const dangerDom = <div dangerouslySetInnerHTML={{ __html: text.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`) }} />;
  return <div>{dangerDom}</div>;
};

class MaintainStatic extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    // this.onSuccess = this.onSuccess.bind(this);
    // this.onError = this.onError.bind(this);
    this.socket = socketConnectionDashboard;
  }

  componentWillMount() {
  }

  componentDidMount() {
    Alert.instance.hideAlert();
    registerMaintainPush(this.socket);
    StorageUtils.clearInfoLogout();
  }

  componentWillUnmount() {
    cancelPusherMaintain(this.socket);
  }

  render() {
    const hasLogo = true;
    const fontSize = calculatorFontSize();
    return (
      <Wrapper src={images.backgroundCaro} fontSize={fontSize}>
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
          <Content>
            {linkify(MAINTAIN_STATIC_COTENT)}
          </Content>
          {
            MAINTAIN_STATIC_ENDTIME && (
              <DurationTime>
                {i18n.t('timeEnd')}
                {MAINTAIN_STATIC_ENDTIME}
              </DurationTime>
            )
          }
        </WrapperContent>
        <Copyright>
          {renderCopyright()}
        </Copyright>
        <Alert />
        <LightningTop src={images.topLightning} />
        <LightningBot src={images.bottomLightning} />
        {
          ENABLE_NEWS && <ListNewsPublic fontSize={fontSize} isMobile={isMobile} />
        }
      </Wrapper>
    );
  }
}

MaintainStatic.propTypes = {
  // fetchMaintainInfo: PropTypes.func.isRequired,
  // setMaintainInfo: PropTypes.func.isRequired,
  // maintainInfo: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default MaintainStatic;
