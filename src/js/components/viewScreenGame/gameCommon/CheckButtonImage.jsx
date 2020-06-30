import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Wrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-image: url(${props => props.img});
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;

  &:hover {
    transform: scale(${props => (props.isChecked ? 1 : 1.2)});
  }
`;

export const ImageCheck = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-image: url(${props => props.img});
  background-size: contain;
  background-repeat: no-repeat;
  cursor: default;
`;

export default class CheckButtonImage extends Component {
  onClick() {
    const { onClick } = this.props;
    if (onClick) onClick();
  }

  render() {
    const {
      imgNormal, imgSelected, width, height, isChecked, customStyle,
    } = this.props;

    return (
      <Wrapper
        width={width}
        height={height}
        img={imgNormal}
        onMouseDown={() => this.onClick()}
        style={customStyle}
        isChecked={isChecked}
      >
        {
          isChecked
            ? (
              <ImageCheck
                width={width}
                height={height}
                img={imgSelected}
              />
            )
            : ''
        }
      </Wrapper>
    );
  }
}

CheckButtonImage.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  imgNormal: PropTypes.string.isRequired,
  imgSelected: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  customStyle: PropTypes.objectOf(PropTypes.any),
};

CheckButtonImage.defaultProps = {
  customStyle: {},
};
