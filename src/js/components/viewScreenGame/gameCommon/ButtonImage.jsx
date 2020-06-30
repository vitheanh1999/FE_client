import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const isMobile = false;
const Wrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  margin-left: ${props => props.left}px;
  background-image: url(${props => props.img});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  cursor: ${props => (props.enable ? 'pointer' : 'auto')};
  pointer-events: auto;

  &: hover {
    filter: grayscale(80%);
  }
`;

export const BUTTON_MODE = {
  AUTO: 0,
  DESKTOP: 1,
  MOBILE: 2,
};

export default class ButtonImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
    };
  }

  onClick() {
    const { onClick, enable } = this.props;
    if (onClick && enable === true) onClick();
  }

  render() {
    const { isSelected } = this.state;
    const {
      imgNormal, imgSelected, imgDisable, left, width, height, enable, customStyle, children, mode,
    } = this.props;

    let img = imgNormal;
    if (enable === false) {
      img = imgDisable;
    } else {
      img = isSelected === false ? imgNormal : imgSelected;
    }

    return (
      <Wrapper
        enable={enable}
        left={left}
        width={width}
        height={height}
        img={img}
        onClick={() => {
          if (mode === BUTTON_MODE.DESKTOP) {
            this.onClick();
          } else if (mode === BUTTON_MODE.AUTO && isMobile === false) this.onClick();
        }}
        onTouchStart={() => {
          if (mode === BUTTON_MODE.MOBILE) {
            this.onClick();
          } else if (mode === BUTTON_MODE.AUTO && isMobile === true) this.onClick();
        }}
        onMouseUp={() => {
          this.setState({ isSelected: false });
        }}
        onMouseDown={() => {
          this.setState({ isSelected: true });
        }}
        onMouseLeave={() => {
          this.setState({ isSelected: false });
        }}
        style={customStyle}
      >
        {
          children
        }
      </Wrapper>
    );
  }
}

ButtonImage.propTypes = {
  enable: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  imgNormal: PropTypes.string.isRequired,
  imgSelected: PropTypes.string.isRequired,
  imgDisable: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  left: PropTypes.number,
  customStyle: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.objectOf(PropTypes.any),
  mode: PropTypes.number,
};

ButtonImage.defaultProps = {
  left: 0,
  customStyle: {},
  children: null,
  width: 0,
  height: 0,
  mode: BUTTON_MODE.AUTO,
};
