import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { isMobile } from 'react-device-detect';
import images from '../../../../assets/lucImage';
import {
  WEB_SOCKET_URL,
} from '../../../config';
import VideoQuality from './VideoQuality';
import Switch from '../../common/Switch/Switch';
import i18n from '../../../i18n/i18n';
import {
  Wrapper, VideoArea, LoadingLogo, DarkBackground, DisconnectText,
  VideoContainer, BackGroundTurnOffVideo, ButtonPlayVideo, IconLive,
  MaxBandwidth, NetworkStatus, PauseVideoBackground,
} from './layoutVideoStyle';
import Alert from '../../common/Alert/Alert';
import { VIDEO_QUALYTIES, ZoomState } from '../../../constants/Constants';

let hidden;
let visibilityChange;
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

const isMobile = false;
const websocketHost = WEB_SOCKET_URL;
const name = 'main0';

let canvasObj = null;
let clientPlayer = null;

export const LoadingAnimation = styled.div`
  border-radius: 50%;
  height: 2.5em;
  width: 2.5em;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: load7 1.8s infinite ease-in-out;
  animation: load7 1.8s infinite ease-in-out;

  &: before,
  &: after {
    border-radius: 50%;
    height: 2.5em;
    width: 2.5em;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation: load7 1.8s infinite ease-in-out;
    animation: load7 1.8s infinite ease-in-out;
  }

  color: #fff;
  font-size: 10px;
  margin: ${props => props.scale * 80}px auto;
  position: absolute;
  top: ${props => props.scale * 35}px;
  left: ${props => props.scale * 240}px;
  text-indent: -9999em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;

  &: before,
  &: after {
    position: absolute;
    top: 0;
    content: '';
  }

  &: before {
    left: -3.5em;
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  &: after {
    left: 3.5em;
  }
  @-webkit-keyframes load7 {
    0%, 80%,
    100% {
      box-shadow: 0 2.5em 0 -1.3em;
    }
    40% {
      box-shadow: 0 2.5em 0 0;
    }
  }
  @keyframes load7 {
    0%, 80%,
    100% {
      box-shadow: 0 2.5em 0 -1.3em;
    }
    40% {
      box-shadow: 0 2.5em 0 0;
    }
  }
`;

export const SwitchOnOffVideo = styled.div`
  position: absolute;
  display: ${props => (props.showLoading ? 'none' : 'flex')};
  justify-content: center;
  align-items: center;
  top: ${props => props.scale * 28}px;
  left: ${props => (props.isTurnOnVideo ? (props.scale * 372) : (props.scale * 414))}px;
  z-index: 10;
`;

export const SwitchText = styled.div`
  display: flex;
  justify-content: ${props => (props.on ? 'center' : 'flex-start')};
  align-items: center;
  height: 100%;
  font-size: ${props => props.scale * 12}px;
  color: ${props => (props.on ? '#186f00' : '#fff')};
  font-weight: bold;
  text-transform: uppercase;
`;

const isOnQualityVideo = true;

export default class LayoutVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: true,
      nameTable: '',
      isNewTable: true,
      showDisconnectText: false,
      currentVideoScale: 1,
      zoomState: ZoomState.zoomIn,
      isTurnOnVideo: true,
      qualityAutoMode: '',
      bandwidth: MaxBandwidth,
      pauseVideo: false,
      isPausedtableToUpdateLobby: false,
    };

    this.timeOut = null;
    this.timeOutTable = '';
    this.zoomVideo = this.zoomVideo.bind(this);
    this.handleSwitchOnOffVideo = this.handleSwitchOnOffVideo.bind(this);
    this.handleSelectAutoMode = this.handleSelectAutoMode.bind(this);

    this.bettingHistoryRef = React.createRef();
    this.zoomInterval = null;
    this.intervalFetchQualityAutoMode = null;
    this.setVideoInterval = null;
    LayoutVideo.instance = this;
  }

  componentWillUnmount() {
    if (clientPlayer) clientPlayer.closeRoom();
    if (this.timeOut) clearTimeout(this.timeOut);
    if (this.zoomInterval) clearTimeout(this.zoomInterval);
    if (this.intervalFetchQualityAutoMode) clearTimeout(this.intervalFetchQualityAutoMode);
    if (this.setVideoInterval) clearInterval(this.setVideoInterval);
    LayoutVideo.instance = null;
  }

  onConnectedVideo() {
    const { showLoading } = this.state;
    if (showLoading === true) this.setState({ showLoading: false, showDisconnectText: false });
  }

  onDisconnectVideo() {
    const { showLoading, isNewTable, nameTable } = this.state;
    if (showLoading === false || isNewTable === true) {
      this.setState({ showLoading: true, isNewTable: false, showDisconnectText: true });
      if (this.timeOut) clearTimeout(this.timeOut);
      this.timeOutTable = nameTable;
      this.timeOut = setTimeout(() => {
        this.checkLoadingTimeOut();
      }, 5000);
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { nameTable } = this.state;
    if (newProps.nameTable !== '' && newProps.nameTable !== nameTable) {
      this.changeTable(newProps.nameTable);
    }
  }

  callbackChangeTable(nameTable, playerConfig) {
    const { width } = this.props;
    const scale = width / 1060;
    if (this.timeOut) clearTimeout(this.timeOut);
    if (clientPlayer) clientPlayer.closeRoom();

    const url = `${websocketHost + nameTable}/${name}`;
    const wsConfig = { url, reconnectTime: 2000 };

    clientPlayer = new window.playerClient(null, wsConfig, playerConfig);
    canvasObj = clientPlayer.getCanvasObject();
    clientPlayer.connect()
      .then(() => {
        this.handleSelectAutoMode();
        this.setVideoQuality(0); // set video quality is 480
      });
    if (isMobile) {
      canvasObj.style.width = '100%';
      if (window.orientation === 90 || window.orientation === -90) {
        canvasObj.style.width = `${489.5 * scale}px`;
        canvasObj.style.height = `${scale * 367.5}px`;
      }
    } else {
      canvasObj.style.width = `${489.5 * scale}px`;
      canvasObj.style.height = `${scale * 367.5}px`;
    }
    canvasObj.id = 'myCanvas';
    const { currentVideoScale } = this.state;
    canvasObj.style.transform = `scale(${currentVideoScale})`;

    const list = document.getElementById('video_container');
    if (list.childNodes[0] != null) {
      list.removeChild(list.childNodes[0]);
    }
    list.appendChild(canvasObj);

    clientPlayer.onMessage = () => {
      this.onConnectedVideo();
    };

    clientPlayer.noMessage = () => {
      this.onDisconnectVideo();
    };
    if (this.state.pauseVideo === true) {
      clientPlayer.pause();
    }
  }

  changeTable(nameTable) {
    const playerConfig = {
      reuseMemory: true,
      useWorker: true,
      webgl: 'auto',
      size: { width: 489.5, height: 410 },
    };

    this.setState({
      showLoading: true,
      nameTable,
      isNewTable: true,
    }, () => {
      this.callbackChangeTable(nameTable, playerConfig);
    });
  }

  setVideoQuality(level) {
    const result = clientPlayer.switchQualityLevel(level);
    if (result) return;
    this.setVideoInterval = setInterval(() => {
      const response = clientPlayer.switchQualityLevel(level);
      if (response) {
        clearInterval(this.setVideoInterval);
        this.setVideoInterval = null;
      }
    }, 1000);
  }

  handleSelectAutoMode() {
    this.intervalFetchQualityAutoMode = setInterval(() => {
      const { showLoading, bandwidth: bandwidthOrigin } = this.state;
      const { auto_switcher: autoSwitcher } = clientPlayer;
      let { bandwidth } = clientPlayer;
      if (showLoading) {
        this.setState({ bandwidth: 0 });
      } else {
        if (bandwidth - bandwidthOrigin > (MaxBandwidth * 0.4)) {
          bandwidth = bandwidthOrigin + MaxBandwidth * 0.4;
        }
        this.setState({ bandwidth });
      }
      if (autoSwitcher) {
        const currentLayerAutoMode = autoSwitcher.profiles[autoSwitcher.current_layer];
        const qualityAutoMode = Object.values(VIDEO_QUALYTIES)
          .filter(e => e.profile === currentLayerAutoMode)[0].label;
        this.setState({ qualityAutoMode });
      }
    }, 1000);
  }

  checkLoadingTimeOut() {
    const { showLoading, nameTable } = this.state;
    if (showLoading === true && nameTable === this.timeOutTable) {
      this.setState({ showDisconnectText: true });
    }
    this.timeOut = null;
  }

  zoomVideo(type) {
    const zoomState = type;
    this.setState({ zoomState });
    if (this.zoomInterval) clearInterval(this.zoomInterval);
    this.zoomInterval = setInterval(() => this.callbackZoom(type), 10);
  }

  callbackZoom(type) {
    if (!canvasObj) return;
    let { currentVideoScale } = this.state;
    if (type === ZoomState.zoomIn) {
      currentVideoScale += 0.01;
      if (currentVideoScale >= 2) currentVideoScale = 2;
    } else {
      currentVideoScale -= 0.01;
      if (currentVideoScale <= 1) currentVideoScale = 1;
    }

    canvasObj.style.transform = `scale(${currentVideoScale})`;
    this.setState({ currentVideoScale });
    if (currentVideoScale === 2 || currentVideoScale === 1) {
      if (type === ZoomState.zoomIn) this.setState({ zoomState: ZoomState.zoomOut });
      else this.setState({ zoomState: ZoomState.zoomIn });
      clearInterval(this.zoomInterval);
      this.zoomInterval = null;
    }
  }

  handleSwitchOnOffVideo(checked) {
    this.setState({ isTurnOnVideo: checked });
    if (checked === false && clientPlayer.isPlaying()) {
      this.setState({ showLoading: false });
      clientPlayer.closeRoom();
    } else {
      const { nameTable } = this.state;
      this.changeTable(nameTable);
    }
  }

  pauseVideo() {
    const { pauseVideo } = this.state;
    if (pauseVideo) return;
    if (clientPlayer.isPlaying()) {
      clientPlayer.pause();
    }
    this.setState({ pauseVideo: true });
  }

  resumeVideo() {
    const { pauseVideo } = this.state;
    if (pauseVideo === false) return;
    if (!clientPlayer.isPlaying()) {
      clientPlayer.play();
    }
    this.setState({ pauseVideo: false });
  }

  pauseTableToUpdateLobby() {
    Alert.instance.showAlert(
      '',
      i18n.t('pauseTableToUpdateLobbyText'),
      i18n.t('OK'),
      () => {
        Alert.instance.hideAlert();
        this.props.closeViewMode();
      },
      () => {
        Alert.instance.hideAlert();
        this.props.closeViewMode();
      },
    );
    this.setState({ isPausedtableToUpdateLobby: true });
  }

  resumeTable() {
    Alert.instance.hideAlert();
    this.setState({ isPausedtableToUpdateLobby: false });
  }

  renderBackgroundPausedVideo() {
    const { isPausedtableToUpdateLobby } = this.state;
    const scale = this.props.width / 1060;

    if (!isPausedtableToUpdateLobby) {
      return null;
    }

    return (
      <PauseVideoBackground
        id="green_background"
        scale={scale}
      />
    );
  }

  render() {
    const {
      showLoading, showDisconnectText, currentVideoScale, zoomState, qualityAutoMode, isTurnOnVideo,
      bandwidth,
    } = this.state;
    const {
      width,
      height,
    } = this.props;
    const isShowHistory = false;
    const scale = width / 1060;
    if (canvasObj) {
      canvasObj.style.width = `${489.5 * scale}px`;
      canvasObj.style.height = `${scale * 367.5}px`;
    }
    const loadingAnim = showLoading ? <LoadingAnimation id="LoadingAnimation" scale={scale}>Loading ...</LoadingAnimation> : null;
    const loadingLogo = showLoading ? <LoadingLogo id="LoadingLogo" scale={scale} /> : null;

    return (
      <div>
        <Wrapper
          id="GameVideo2"
          isShowHistory={isShowHistory}
          isTurnOnVideo={isTurnOnVideo}
          width={width}
          height={height}
        >
          {isOnQualityVideo && (
            <SwitchOnOffVideo
              showLoading={showLoading}
              isTurnOnVideo={isTurnOnVideo}
              scale={scale}
            >
              <Switch
                isOn={isTurnOnVideo}
                handleToggle={e => this.handleSwitchOnOffVideo(e.target.checked)}
                scale={scale}
              />
            </SwitchOnOffVideo>
          )}
          <NetworkStatus
            bandwidth={bandwidth}
            showLoading={showLoading}
            isTurnOnVideo={isTurnOnVideo}
            scale={scale}
          >
            <div id="first-column" className="network-column" />
            <div id="second-column" className="network-column" />
            <div id="third-column" className="network-column" />
            <div id="fourth-column" className="network-column" />
            <div id="fifth-column" className="network-column" />
          </NetworkStatus>
          {isTurnOnVideo && <IconLive scale={scale} />}
          <VideoArea
            isShowHistory={isShowHistory}
            isTurnOnVideo={isTurnOnVideo}
            scale={scale}
          >
            <VideoContainer
              id="video_container"
              isShowHistory={isShowHistory}
              scale={scale}
            />
            {
              (showLoading)
                ? <DarkBackground id="DarkBackground" isShowHistory={isShowHistory} scale={scale} />
                : null
            }
            {loadingAnim}
            {loadingLogo}
            {
              showDisconnectText ? <DisconnectText scale={scale}>{i18n.t('disconnectText')}</DisconnectText> : ''
            }
            {
              this.renderBackgroundPausedVideo()
            }
          </VideoArea>
          {(isOnQualityVideo) && (
            <BackGroundTurnOffVideo
              isShowHistory={isShowHistory}
              id="green_background"
              isTurnOnVideo={isTurnOnVideo}
              scale={scale}
            >
              <img src={images.VideoLoadingLogo} alt="logo" />
              <ButtonPlayVideo onClick={() => this.handleSwitchOnOffVideo(true)} scale={scale}>
                {i18n.t('playVideo')}
              </ButtonPlayVideo>
            </BackGroundTurnOffVideo>
          )}
          {isOnQualityVideo && isTurnOnVideo && (
            <VideoQuality
              fullSizeMode={isShowHistory}
              zoomVideo={this.zoomVideo}
              currentVideoScale={currentVideoScale}
              zoomState={zoomState}
              clientPlayer={clientPlayer}
              qualityAutoMode={qualityAutoMode}
              show={!showLoading}
              handleSelectAutoMode={this.handleSelectAutoMode}
              scale={scale}
            />
          )}
        </Wrapper>
      </div>
    );
  }
}
const onFocusPage = () => {
  if (LayoutVideo.instance) LayoutVideo.instance.resumeVideo();
};

const onUnFocusPage = () => {
  if (LayoutVideo.instance) LayoutVideo.instance.pauseVideo();
};

const handleVisibilityChange = () => {
  if (!hidden) return;
  if (document[hidden]) {
    onUnFocusPage();
  } else {
    onFocusPage();
  }
};

if (typeof document.addEventListener === 'undefined' || hidden === undefined) {
  console.log('page requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.');
} else {
  // Handle page visibility change
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}

LayoutVideo.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  closeViewMode: PropTypes.func.isRequired,
};
