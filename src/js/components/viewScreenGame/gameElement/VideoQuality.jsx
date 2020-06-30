import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import images from '../../../../assets/lucImage';
import { VIDEO_QUALYTIES, ZoomState } from '../../../constants/Constants';

export const MODE = {
  ZOOMOUT: 'out',
  ZOOMIN: 'in',
};

const ContainerLayout = styled.div`
  background: transparent;
  position: absolute;
  top: ${props => props.scale * 6}px;
  left: ${props => props.scale * 6}px;
  height: ${props => (props.fullSizeMode ? props.scale * 377 : props.scale * 402)}px;
  width: ${props => props.scale * 490}px;
  z-index: 9;
`;

const SettingBar = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  ${props => (props.fullSizeMode
    ? `top: ${props.scale * 358}px; width: ${props.scale * 490}px`
    : `top: ${props.scale * 383}px; width: ${props.scale * 490}px`)};
  height: ${props => props.scale * 18}px;
  display: flex;
  justify-content: flex-end;
  padding-top: ${props => props.scale * 2}px;
`;

const SelectQualityBox = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  ${props => (props.fullSizeMode
    ? `top: ${props.scale * 268}px; right: 0`
    : `top: ${props.scale * 304}px; right: ${props.scale * 0}px`)};
  width: ${props => props.scale * 86}px;
  height: ${props => props.scale * 80}px;
  color: white;
  font-size: ${props => props.scale * 12}px;
  text-align: left;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  padding: ${props => props.scale * 5}px 0;
`;

const LI = styled.div`
  display: flex;
  flex-direction: row;
  line-height: ${props => props.scale * 20}px;
  cursor: pointer;
  padding-left: ${props => props.scale * 5}px;

  &:hover {
    background-color: rgba(189, 195, 199, 0.5);
  }
`;

const Image = styled.img``;

const ButtonSetting = styled.button`
  background: transparent;
  border: none;
  margin-right: ${props => props.scale * 5}px;
  cursor: pointer;
  height: ${props => props.scale * 18}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SmallDot = styled.div`
  width: ${props => props.scale * 6}px;
  height: ${props => props.scale * 6}px;
  border-radius: 50%;
  background: #87d37c;
`;

class VideoQuality extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowSetting: false,
      selectedQuality: VIDEO_QUALYTIES['480p'].label,
      isShowListQuality: false,
    };

    this.handleMouseLeaveLayout = this.handleMouseLeaveLayout.bind(this);
    this.handleMouseMoveLayout = this.handleMouseMoveLayout.bind(this);
    this.handleSelectedQuality = this.handleSelectedQuality.bind(this);
    this.handleClickSetting = this.handleClickSetting.bind(this);
    this.handleClickZoomVideo = this.handleClickZoomVideo.bind(this);

    this.timeOutShowQualityBox = null;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutShowQualityBox);
    this.timeOutShowQualityBox = null;
  }

  handleClickSetting() {
    const { isShowListQuality } = this.state;
    this.setState({ isShowListQuality: !isShowListQuality });
  }

  handleMouseLeaveLayout() {
    const { isShowListQuality } = this.state;
    if (isShowListQuality === false) {
      this.setState({ isShowSetting: false });
    }
  }

  handleMouseMoveLayout() {
    this.setState({ isShowSetting: true });
  }

  handleSelectedQuality(e) {
    const { clientPlayer } = this.props;
    const selectedQuality = e.label;
    this.setState({ selectedQuality });
    if (clientPlayer) clientPlayer.switchQualityLevel(e.value);
    this.timeOutShowQualityBox = setTimeout(() => {
    }, 500);
  }

  handleClickZoomVideo() {
    const { zoomVideo, currentVideoScale } = this.props;
    if (currentVideoScale === 2) {
      zoomVideo(ZoomState.zoomOut);
    }
    if (currentVideoScale === 1) {
      zoomVideo(ZoomState.zoomIn);
    }
  }

  renderListQuality(scale) {
    const { selectedQuality } = this.state;
    const { qualityAutoMode } = this.props;
    return (
      Object.values(VIDEO_QUALYTIES).map(item => (
        <LI key={item.value} onClick={() => this.handleSelectedQuality(item)}>
          <div style={{ width: 12, display: 'flex', alignItems: 'center' }}>
            {
              selectedQuality === item.label && <SmallDot scale={scale} />
            }
          </div>
          {[selectedQuality, item.label].every(e => e === VIDEO_QUALYTIES.Auto.label)
            ? `${VIDEO_QUALYTIES.Auto.label} (${qualityAutoMode})`
            : item.label}
        </LI>
      ))
    );
  }

  render() {
    const { isShowListQuality, isShowSetting } = this.state;
    const {
      fullSizeMode, currentVideoScale, zoomState, show, scale,
    } = this.props;
    return (
      <ContainerLayout
        onMouseLeave={this.handleMouseLeaveLayout}
        onMouseMove={this.handleMouseMoveLayout}
        fullSizeMode={fullSizeMode}
        show={show}
        onClick={() => {}}
        scale={scale}
      >
        <OutsideClickHandler
          onOutsideClick={() => this.setState({ isShowListQuality: false, isShowSetting: false })}
        >
          {
            isShowSetting && (
              <div id="setting">
                <SettingBar fullSizeMode={fullSizeMode} scale={scale}>
                  <ButtonSetting onClick={this.handleClickSetting} scale={scale}>
                    <Image src={images.iconSetting} scale={scale} />
                  </ButtonSetting>
                  <ButtonSetting
                    onClick={this.handleClickZoomVideo}
                    disabled={currentVideoScale > 1 && currentVideoScale < 2}
                    scale={scale}
                  >
                    {
                      zoomState === ZoomState.zoomIn
                        ? <Image src={images.iconZoomIn} />
                        : <Image src={images.iconZoomOut} width={14} height={14} style={{ opacity: 0.5 }} />
                    }
                  </ButtonSetting>
                </SettingBar>
                <SelectQualityBox show={isShowListQuality && show} fullSizeMode={fullSizeMode} scale={scale}>
                  {this.renderListQuality(scale)}
                </SelectQualityBox>
              </div>
            )}
        </OutsideClickHandler>
      </ContainerLayout>
    );
  }
}

VideoQuality.propTypes = {
  fullSizeMode: PropTypes.bool.isRequired,
  zoomVideo: PropTypes.func.isRequired,
  currentVideoScale: PropTypes.number.isRequired,
  zoomState: PropTypes.string.isRequired,
  qualityAutoMode: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  clientPlayer: PropTypes.objectOf(PropTypes.any),
  scale: PropTypes.number,
};

VideoQuality.defaultProps = {
  clientPlayer: null,
  scale: 1,
};

export default VideoQuality;
