import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: ${props => props.height}px;
  flex-direction: column;
  background-color: #0f3a03;
  background-size: 100% 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
  overflow: hidden;
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
    sans-serif !important;
`;

export const BackgroundBetting = styled.div`
  width: 100%;
  height: ${props => props.height}px;
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  background-image: url(${props => props.images});
  background-size: 100% 100%;
`;

export const DisableClick = styled.div`
  width: 100%;
  height: ${props => props.height}px;
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  background-color: #0000;
  z-index: 1000;
`;
