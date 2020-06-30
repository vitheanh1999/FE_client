import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import images from '../../../../../assets/lucImage';
import { CHIP_VALUES } from '../../logicCore/animationHelp';

export const Wrapper = styled.div`
  display: flex;
  width: 50px;
  height: 50px;
  margin-right: 8px;
  flex-direction: center;
  justify-content: center;
  align-items: center;
  animation-name: ${props => props.moveCoin};
  animation-duration: 0.3s;
  -webkit-animation-fill-mode: forwards;
  margin-bottom: ${props => (props.isSelected ? 8 : 0)}px;
`;

export const moverY = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(1.2); }
`;

export const resetY = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(1); }
`;

export const ImageChip = styled.div`
  width: 42px;
  height: 42px;
  cursor: pointer;
  background-image: url(${props => props.image});
  background-size: contain;
  background-repeat: no-repeat;

  &: hover {
    transform: scale(${props => (props.isSelected ? 1 : 1.2)});
  }
`;

export const ImageGray = styled.div`
  width: 42px;
  height: 42px;
  cursor: pointer;
  background-image: url(${images.grayChip});
  background-size: contain;
  background-repeat: no-repeat;
`;

export const getImageChip = (value) => {
  const listChipValue = [...CHIP_VALUES];
  const listChipImage = [
    images.chip100,
    // images.chip250,
    images.chip500,
    images.chip1k,
    images.chip5k,
    images.chip10k,
    images.chip25k,
    images.chip50k,
    images.chip100K,
    images.chip500K,
  ];

  for (let i = 0; i < listChipValue.length; i += 1) {
    if (value === listChipValue[i]) return listChipImage[i];
  }
  return listChipImage[0];
};

class Coin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    const {
      click, choseCoin, value,
    } = this.props;
    return (
      <Wrapper
        onClick={() => click(value)}
        moveCoin={choseCoin === value ? moverY : resetY}
        isSelected={choseCoin === value}
        chose={choseCoin}
      >
        {
          <ImageChip image={getImageChip(value)} isSelected={choseCoin === value} />
        }
      </Wrapper>
    );
  }
}
Coin.propTypes = {
  click: PropTypes.func.isRequired,
  choseCoin: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
export default Coin;
