import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

const WrapperAll = styled.div`
  display: flex;
  right: ${props => props.right};
  margin-right: 0;
  z-index: 3;
  ${() => (isMobile && (window.orientation !== 90 && window.orientation !== -90) ? 'width: 100%' : 'width: 530px; height: 336px; position: absolute;')}
`;

export const cssShadow = `-3px -2px 0 #ffffff, -3px -1px 0 #ffffff, -3px 0px 0 #ffffff, -3px 1px 0 #ffffff,
-3px 2px 0 #ffffff, -2px -3px 0 #ffffff, -2px -2px 0 #ffffff, -2px -1px 0 #ffffff, -2px 0px 0 #ffffff,
-2px 1px 0 #ffffff, -2px 2px 0 #ffffff, -2px 3px 0 #ffffff, -1px -3px 0 #ffffff, -1px -2px 0 #ffffff,
-1px -1px 0 #ffffff, -1px 0px 0 #ffffff, -1px 1px 0 #ffffff, -1px 2px 0 #ffffff, -1px 3px 0 #ffffff,
0px -3px 0 #ffffff, 0px -2px 0 #ffffff, 0px -1px 0 #ffffff, 0px 0px 0 #ffffff, 0px 1px 0 #ffffff,
0px 2px 0 #ffffff, 0px 3px 0 #ffffff, 1px -3px 0 #ffffff, 1px -2px 0 #ffffff, 1px -1px 0 #ffffff,
1px 0px 0 #ffffff, 1px 1px 0 #ffffff, 1px 2px 0 #ffffff, 1px 3px 0 #ffffff, 2px -3px 0 #ffffff,
2px -2px 0 #ffffff, 2px -1px 0 #ffffff, 2px 0px 0 #ffffff, 2px 1px 0 #ffffff, 2px 2px 0 #ffffff,
2px 3px 0 #ffffff, 3px -2px 0 #ffffff, 3px -1px 0 #ffffff, 3px 0px 0 #ffffff, 3px 1px 0 #ffffff,
3px 2px 0 #ffffff;`;

const Title = styled.h1`
  font-size: 28px;
  text-align: center;
  text-shadow: ${cssShadow};
  font-family: Arial, sans-serif;
  color: ${props => props.color};
  user-select: none;
  pointer-events: none;
  ${() => isMobile && (window.orientation !== 90 && window.orientation !== -90) && 'font-size: 1.5vh; font-weight: 900;'}
`;

const TitleBet = styled.h1`
  font-size: 20px;
  text-align: center;
  text-shadow: ${cssShadow};
  font-family: Arial, sans-serif;
  color: ${props => props.color};
  margin-left: 50px;
  user-select: none;
  pointer-events: none;
  ${() => isMobile && (window.orientation !== 90 && window.orientation !== -90) && 'font-size: 1.5vh; font-weight: 900; margin-left: 14px;'}
`;
const Wrapper = styled.div`
  display: flex;
  width: 530px;
  height: 40px;
  ${() => isMobile && (window.orientation !== 90 && window.orientation !== -90) && 'width: 100%;'}
`;
const WrapperText = styled.div`
  display: flex;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
`;
const WrapperPoint = styled.div`
  display: flex;
  width: 530px;
  height: 100px;
  position: absolute;
  bottom: 205px;
  align-items: center;
  justify-content: ${props => (props.align === 'left' ? 'flex-start' : 'flex-end')};
`;
const TextPoint = styled.h1`
  font-size: 74px;
  text-align: center;
  text-shadow: ${cssShadow};
  font-family: Arial, sans-serif;
  color: ${props => props.color};
  ${props => (props.isPlayer ? 'margin-right: 55px;' : 'margin-left: 55px;')}
  user-select: none;
  pointer-events: none;
`;

class TitleResult extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }


  render() {
    const {
      color, text, subtext, right, point, pointShow, isPlayer,
    } = this.props;
    const pointView = pointShow && !isMobile && (window.orientation === 90 || window.orientation === -90)
      ? <TextPoint color={color} isPlayer={isPlayer}>{point}</TextPoint> : null;
    return (
      <WrapperAll right={right}>
        <Wrapper>
          <WrapperText>
            <Title color={color}>{text}</Title>
            <TitleBet color={color}>{subtext}</TitleBet>
          </WrapperText>
        </Wrapper>
        <WrapperPoint align={isPlayer ? 'right' : 'left'}>
          {pointView}
        </WrapperPoint>
      </WrapperAll>
    );
  }
}

TitleResult.propTypes = {
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  subtext: PropTypes.string.isRequired,
  right: PropTypes.string,
  point: PropTypes.string.isRequired,
  pointShow: PropTypes.bool.isRequired,
  isPlayer: PropTypes.bool.isRequired,
};

TitleResult.defaultProps = {
  right: null,
};

export default TitleResult;
