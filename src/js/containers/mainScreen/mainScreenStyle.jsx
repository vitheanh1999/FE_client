import styled from 'styled-components';
import colors from '../../theme/colors';
import images from '../../../assets/images';

export const TabContent = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: auto;
  font-size: ${props => props.fontSize}px;
`;

export const WrapperContent = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  overflow-y: auto;
  background-image: url(${images.backgroundCaro});
  background-repeat: repeat;
`;

export const WrapperMenu = styled.div`
  background: ${colors.primary};
  width: 14em;
  font-size: 75%;
  min-height: fit-content;
  z-index: 1;
`;

export const Background = styled.div`
  height: 100%;
  min-height: fit-content;
  display: flex;
  flex-direction: row;
  background-color: #dee3e4;
  font-size: ${props => props.fontSize}px;
  overflow: auto;
  font-family:
    "SF Pro JP",
    "SF Pro Display",
    "SF Pro Icons",
    "Hiragino Kaku Gothic Pro",
    "ヒラギノ角ゴ Pro W3",
    "メイリオ",
    "Meiryo",
    "ＭＳ Ｐゴシック",
    "Helvetica Neue",
    "Helvetica",
    "Arial",
    sans-serif;
`;


export const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;
