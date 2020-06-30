import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const WrapperAll = styled.div`
  display: flex;
  right: ${props => props.right};
  margin-right: 0;
  z-index: 3;
  width: 530px;
  height: 336px;
  position: absolute;
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
`;
const Wrapper = styled.div`
  display: flex;
  width: 530px;
  height: 40px;
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

class TitleResultHorizontal extends Component {
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
    const pointView = pointShow ? <TextPoint color={color} isPlayer={isPlayer}>{point}</TextPoint>
      : null;
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

TitleResultHorizontal.propTypes = {
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  subtext: PropTypes.string.isRequired,
  right: PropTypes.string,
  point: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  pointShow: PropTypes.bool.isRequired,
  isPlayer: PropTypes.bool.isRequired,
};

TitleResultHorizontal.defaultProps = {
  right: null,
};

export default TitleResultHorizontal;
