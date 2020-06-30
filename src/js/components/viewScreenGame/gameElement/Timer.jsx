import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import images from '../../../../assets/lucImage';

export const StyledRotate = styled.div`
  transform: matrix(-1, 0, 0, 1, 0, 0);
`;

export const StyledProgress = styled.div`
  background-image: url(${props => props.background});
  background-repeat: no-repeat;
  position: absolute;
  width: ${props => props.percent}%;
  height: ${props => props.scale * 68}px;
  transition: width 1s;
`;

export const Wrapper = styled.div`
  width: 101px;
  height: 68px;
  position: absolute;
  top: ${props => props.scale * 390}px;
  left: ${props => props.scale * 487}px;
  display: flex;
  flex-direction: column;
  transform: scale(${props => props.scale});
  transform-origin: 0% 0%;
`;

export const LimitText = styled.div`
  width: ${props => props.scale * 97}px;
  height: ${props => props.scale * 30}px;
  font-size: ${props => props.scale * 10}px;
  color: #428ca5;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-weight: 800;
  user-select: none;
`;

export const TimeText = styled.div`
  width: ${props => props.scale * 97}px;
  height: ${props => props.scale * 40}px;
  font-size: ${props => props.scale * 40}px;
  color: ${props => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  user-select: none;
`;

export default class Timer extends PureComponent {
  render() {
    const {
      countDownTimer, timeTurn, customStyle, scale,
    } = this.props;
    let color = '#01c0ff';
    let url = images.countLine_full;
    if (countDownTimer < 30 && countDownTimer >= 16) {
      color = '#01d076';
      url = images.countLine_30_16;
    }
    if (countDownTimer <= 15 && countDownTimer >= 6) {
      color = '#f1cd24';
      url = images.countLine_15_6;
    }
    if (countDownTimer <= 5 && countDownTimer >= 1) {
      color = '#ff3c0c';
      url = images.countLine_5_1;
    }
    if (countDownTimer < 1) {
      color = '#aaa';
      url = images.countLine_5_1;
    }
    return (
      <Wrapper style={customStyle} scale={scale} id="Timer">
        <StyledRotate scale={1}>
          <StyledProgress
            id="progress"
            percent={countDownTimer * 100 / timeTurn}
            background={url}
            scale={1}
          />
        </StyledRotate>
        <LimitText scale={1}>limit</LimitText>
        <TimeText color={color} scale={1}>{countDownTimer}</TimeText>
      </Wrapper>
    );
  }
}

Timer.propTypes = {
  countDownTimer: PropTypes.number.isRequired,
  timeTurn: PropTypes.number.isRequired,
  customStyle: PropTypes.objectOf(PropTypes.any),
  scale: PropTypes.number.isRequired,
};

Timer.defaultProps = {
  customStyle: {},
};
