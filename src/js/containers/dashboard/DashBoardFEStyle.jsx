import styled from 'styled-components';
import { SCREEN_SIZE } from '../../constants/screenSize';

export const Container = styled.div`
  position: relative;
`;

export const Header = styled.div`
  height: 4.8em;
  width: 100%;
  color: #00647aad;
  font-size: ${props => props.fontSize * 1.25}px;
  background-color: #ccc;
  display: flex;
  align-items: center;
  padding: 1em;
  font-weight: 600;
  justify-content: space-between;
`;

export const Body = styled.div`
  padding-left: 1em;
  width: 100%;
`;

export const WrapperContent = styled.div`
  width: ${props => (props.isRotation ? '100vw' : '88vw')};
  z-index: 0;
  position: absolute;
  right: 0;
`;

export const IconMenu = styled.img`
  width: 1em;
  height: 1em;
`;

export const calculatorFontSize = () => {
  let screenWidth = window.innerWidth;
  // const browserZoomLevel = window.devicePixelRatio;
  const browserZoomLevel = 1;
  screenWidth *= browserZoomLevel;
  if (screenWidth > SCREEN_SIZE.width4k) return 40 / browserZoomLevel;
  if (screenWidth > SCREEN_SIZE.width2k) return 21 / browserZoomLevel;
  if (screenWidth > SCREEN_SIZE.width1k8) return 20 / browserZoomLevel;
  if (screenWidth > SCREEN_SIZE.width1k6) return 19 / browserZoomLevel;
  if (screenWidth > SCREEN_SIZE.xl) return 18 / browserZoomLevel; // >=1200
  if (screenWidth > SCREEN_SIZE.lg) return 18 / browserZoomLevel; // >=992
  if (screenWidth > SCREEN_SIZE.md) return 16 / browserZoomLevel; // >=768
  if (screenWidth > SCREEN_SIZE.sm) return 12 / browserZoomLevel; // >=576
  return 10 / browserZoomLevel;
};
