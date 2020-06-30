import styled from 'styled-components';
import { SCREEN_SIZE } from '../../constants/screenSize';
// import { BGR_WRAPPER } from '../../constants/styleDefaultAuth';
import images from '../../../assets/images';


export const LightningTop = styled.img`
  width: 25em;
  position: absolute;
  top: 0;
  left: 0;
`;

export const LightningBot = styled.img`
  width: 25em;
  position: absolute;
  bottom: ${props => (props.bottom ? props.bottom : 0)};
  right: 0;
`;

export const calculatorFontSize = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth > SCREEN_SIZE.xl) return 25; // >=1200
  if (screenWidth > SCREEN_SIZE.lg) return 22; // >=1065
  if (screenWidth > SCREEN_SIZE.md) return 16; // >=768
  if (screenWidth > SCREEN_SIZE.sm) return 12; // >=576
  return 10;
};

export const Body = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 50em 30em;
`;

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${images.backgroundCaro});
  font-size: ${props => props.fontSize}px;
  background-repeat: repeat;
  min-height: 300px;
`;

export const WrapperLightning = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${images.backgroundCaro});
  font-size: ${props => props.fontSize}px;
  background-repeat: repeat;
  min-height: 300px;
`;

export const Shadow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-image: url(${images.backgroundShadow});
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

export const NewWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 20%
`;
