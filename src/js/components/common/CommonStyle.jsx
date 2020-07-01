import { Modal, ModalHeader } from 'reactstrap';
import styled from 'styled-components';
import { SCREEN_SIZE } from '../../constants/screenSize';

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

export const fontSize = calculatorFontSize();

const browserZoomLevel = window.devicePixelRatio;
export const scale = 1.5 * window.innerWidth * browserZoomLevel / 1920;

export const ContentContainer = styled.div`
  width: 95%;
  height: 100%;
  margin: 0 2em;
  padding-top: 1.111em;
  padding-bottom: 1.111em;
  max-width: 90vw;
  margin-left: auto;
  margin-right: auto;
`;

export const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 1em;
  font-weight: bold;
  font-size: 110%;
  min-height: 2.75em;
  background-color: #333;
  color: #fff;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  justify-content: ${props => (props.justifyContent ? props.justifyContent : 'space-between')};
`;

export const MedianStrip = styled.div`
  width: 100%;
  height: 0.3em;
  background-color: #2d889c;
`;

export const ContentBody = styled.div`
  width: 100%;
  padding: 1em;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: #333;
  color: #fff;
  font-size: 1.1em;
  flex-shrink: 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

export const ChartLineLabel = styled.div`
  background-color: #00647a;
  width: 3em;
  height: 0.25em;
  margin-right: 0.25em;
  border-radius: 5px;
`;

export const WrapperLineLabel = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5em;
`;

export const customStyleSwitch = {
  transform: `scale(${fontSize / 20})`,
  // transformOrigin: 'left',
  // justifyContent: 'flex-start',
};

export const WrapperStatus = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-bottom: 0.5em;
`;

export const ButtonStatus = styled.div`
  width: 4em;
  height: 1.7em;
  background-color: ${props => (props.isOn ? 'rgb(24, 111, 0)' : 'rgb(208, 0, 0)')};
  border-radius: 2.5em;
  color: #fff;
  font-size: 85%;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  cursor: ${props => (props.cursor ? props.cursor : 'context-menu')};
  margin-right: 0.5em;
`;

export const WrapperPaginationCustom = styled.div`
  transform: scale(${props => (props.scale)});
  width: ${props => props.width}em;
  height: ${props => props.height}em;

  li {
    background-color: #fff;
    color: #000;
    outline: none;

    &: hover {
      background-color: #00647a;
      border: none;
      color: #fff;
    }
  }

  .rc-pagination-item-active {
    background-color: #00647a;
    border: none;
    color: #fff;
  }

  .rc-pagination-item:hover a {
    color: #fff;
  }
`;

export const ListInformation = styled.div`
  height: 100%;
  width: 80%;
`;

export const WrapperList = styled.div`
  cursor: pointer;
  border-radius: 0.25em;
  color: #fff;
`;

export const WrapperListItem = styled.div`
  padding: 1em 2%;
  width: 100%;
  height: ${props => props.height}em;
  font-size: 0.99em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 1px #c7c0b8;
  background-color: ${props => (props.bgrColor ? props.bgrColor : '#333333')};

  &:hover {
    background-color: ${props => (props.bgrColorHover ? props.bgrColorHover : '#555555')};
  }
`;

export const SpanTotal = styled.span`
  color: ${props => (props.color ? props.color : 'unset')};
  display: flex;
  width: auto;
  white-space: pre-wrap;
`;

export const ModalWrapper = styled(Modal)`
  max-width: ${props => !props.isMobile && '80%'};

  > div {
    background-color: #333333;
    color: #fcfcfc;
  }
`;

export const ModalHeaderCustom = styled(ModalHeader)`
  height: 2.5em;
  font-weight: 700;
  padding: 0.5em;

  > h5 {
    font-size: 1em;
  }

  button {
    color: #fcfcfc;
  }
  background-color: ${props => (props.bgrColor ? props.bgrColor : '#00647a')};
`;

export const WrapperSpan = styled.span`
  display: flex;
  align-items: baseline;
  white-space: pre-wrap;
`;

export const SpanCharge = styled(WrapperSpan)`
  justify-content: flex-end;
`;
