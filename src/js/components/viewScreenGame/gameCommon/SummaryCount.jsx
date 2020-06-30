import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Switch from 'react-switch';
import images from '../../../../assets/lucImage';
import { SwitchOnOffVideo, SwitchText } from '../gameElement/LayoutVideo';
import i18n from '../../../i18n/i18n';
import './ThreeBallAnimation.css';

const NotiWaitingBet = styled.div`
  background-image: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  width: ${props => props.scale * 190}px;
  height: ${props => props.scale * 28}px;
  color: #ffe537;
  font-weight: 700;
  display: flex;
  align-items: center;
  padding-right: ${props => props.scale * 10}px;
  padding-left: ${props => props.scale * 40}px;

  > span {
    font-size: ${props => props.scale * 14}px;
  }
`;

const StyledImage = styled.img`
  width: 15%;
  max-width: 19px;
  margin-right: ${props => props.right}px;
`;

const ButtonGoToDashboard = styled.div`
  padding: 5px;
  margin-left: ${props => props.left}px;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  font-size: ${props => props.fontSize}px;
  cursor: pointer;
  pointer-events: auto;
  background-color: #1f7700;
  color: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;

  &: hover {
    filter: grayscale(80%);
  }
`;

const SummaryView = styled.div`
  z-index: 5;
  width: ${props => props.scale * 1060}px;
  height: ${props => props.scale * 43}px;
  position: absolute;
  top: ${props => props.scale * 91}px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 49%;
`;

const Triangle = styled.img`
  width: ${props => props.scale * 6}px;
  height: ${props => props.scale * 7}px;
  margin-left: ${props => props.scale * 15}px;
  user-select: none;
`;

const BlueText = styled.div`
  color: #01c0ff;
  margin-left: ${props => props.scale * props.left}px;
  text-align: left;
  font-size: ${props => props.scale * 16}px;
  font-weight: 600;
  user-select: none;
  width: ${props => (props.width * props.scale) || (35 * props.scale)}px;
`;

const Icon = styled.img`
  width: ${props => props.width * props.scale}px;
  height: ${props => props.height * props.scale}px;
  margin-left: ${props => props.left * props.scale}px;
  user-select: none;
`;

const TextMessage = styled.div`
  width: ${props => props.scale * 523}px;
  height: ${props => props.scale * 25}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.scale * 16}px;
  color: #133300;
  user-select: none;
  position: absolute;
  top: -${props => props.scale * 344}px;
  left: ${props => props.scale * 520}px;
  background-image: url(${images.navigationBg});
  padding-top: ${props => props.scale * 2}px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

const ImageLogoDBAC = styled.img`
  width: ${props => props.scale * 135}px;
  height: ${props => props.scale * 16}px;
  background-size: 100% 100%;
`;

const ImageBurstOn = styled.img`
  width: ${props => props.scale * 109}px;
  height: ${props => props.scale * 35}px;
  margin-left: ${props => props.scale * (props.isWaitBet ? 70 : 230)}px;
  background-size: 100% 100%;
  margin-right: 10px;
`;

const TextBurst = styled.div`
  height: 100%;
  font-size: ${props => props.scale * 16}px;
  color: white;
  display: flex;
  align-items: center;
  font-weight: 500;
  margin-left: ${props => props.scale * 15}px;
`;

const SwitchOnOffVideoRelative = styled(SwitchOnOffVideo)`
  position: unset;
  margin-left: ${props => props.scale * 32}px;
`;

class SummaryCount extends Component {
  componentDidMount() {
  }

  checkEnableReBet() {
    return true;
  }

  renderSummary() {
    const { summary, scale } = this.props;
    return (
      <RowDiv>
        <Triangle
          src={images.triangle}
          scale={scale}
        />
        <BlueText left={7} width={31} scale={scale}>All</BlueText>
        <BlueText left={6} scale={scale}>{summary.summary}</BlueText>
        <Icon
          width={18}
          height={17}
          src={images.B}
          left={0}
          scale={scale}
        />
        <BlueText left={4} width={29} scale={scale}>{summary.banker}</BlueText>
        <Icon
          width={18}
          height={17}
          src={images.P}
          left={0}
          scale={scale}
        />
        <BlueText left={4} width={29} scale={scale}>{summary.player}</BlueText>
        <Icon
          width={18}
          height={17}
          src={images.T}
          left={0}
          scale={scale}
        />
        <BlueText left={4} width={29} scale={scale}>{summary.tie}</BlueText>
        <Icon
          width={18}
          height={17}
          src={images.BP}
          left={0}
          scale={scale}
        />
        <BlueText left={4} width={29} scale={scale}>{summary.b_pair}</BlueText>
        <Icon
          width={18}
          height={17}
          src={images.PP}
          left={0}
          scale={scale}
        />
        <BlueText left={4} width={29} scale={scale}>{summary.p_pair}</BlueText>
      </RowDiv>
    );
  }

  renderSwitch() {
    const { scale } = this.props;
    const isTurnOnVideo = true;
    return (
      <SwitchOnOffVideoRelative
        showLoading={false}
        isTurnOnVideo={isTurnOnVideo}
        scale={scale}
        id="SwitchOnOffVideo"
      >
        <Switch
          onChange={() => { }}
          checked={isTurnOnVideo}
          handleDiameter={13}
          activeBoxShadow="none"
          height={18 * scale}
          width={46 * scale}
          offColor="#186f00"
          offHandleColor="#fff"
          onColor="#DCDCDC"
          onHandleColor="#186f00"
          uncheckedIcon={<SwitchText>off</SwitchText>}
          checkedIcon={<SwitchText on>on</SwitchText>}
          className="react-switch-video"
          id="switch-video"
        />
      </SwitchOnOffVideoRelative>
    );
  }

  render() {
    const {
      scale, goDashBoard, botInfo,
    } = this.props;

    return (
      <SummaryView scale={scale} id="SummaryView">
        {this.renderSummary()}
        {/* <ImageLogoDBAC src={images.iconAutoDbac} alt="" scale={scale} /> */}
        {/* <ButtonImage
          enable
          onClick={goDashBoard}
          imgNormal={images.btnDashBoard}
          imgSelected={images.btnDashBoard}
          imgDisable={images.btnDashBoard}
          left={10 * scale}
          width={169 * scale}
          height={28 * scale}
        /> */}
        {this.props.isWaitBet ? (
          <NotiWaitingBet
            src={images.waitingBetNoti}
            scale={scale}
          >
            <span>{i18n.t('waitBetting')}</span>
            <div className="sp sp-3balls" />
          </NotiWaitingBet>
        ) : null}
        <ButtonGoToDashboard
          onClick={goDashBoard}
          left={10 * scale}
          width={169 * scale}
          height={28 * scale}
          fontSize={16 * scale}
        >
          <StyledImage
            src={images.iconGoToDashboard}
            right={10 * scale}
          />{i18n.t('dashBoard')}
        </ButtonGoToDashboard>
        {
          // <TextBurst scale={scale}>BURST TICKET</TextBurst>
        }
        {
          (botInfo && botInfo.burst_status === 1) && <ImageBurstOn src={images.burstOn} alt="" scale={scale} isWaitBet={this.props.isWaitBet} />
        }
        {
          // this.renderSwitch()
        }
      </SummaryView>
    );
  }
}
SummaryCount.propTypes = {
  summary: PropTypes.objectOf(PropTypes.any),
  scale: PropTypes.number,
  goDashBoard: PropTypes.func.isRequired,
  botInfo: PropTypes.objectOf(PropTypes.any),
  isWaitBet: PropTypes.bool,
};

SummaryCount.defaultProps = {
  summary: null,
  scale: 1,
  isWaitBet: false,
};
export default SummaryCount;
