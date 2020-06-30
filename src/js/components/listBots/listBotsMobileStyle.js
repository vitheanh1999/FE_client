import styled from 'styled-components';
import { ModalWrapper, ModalHeaderCustom } from './Main';

export const WrapperBotName = styled.div`
  display: flex;
  align-items: center;
`;

export const BotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${props => props.scale * 0.5}em 0;
`;

export const WrapperBot = styled.div`
  padding: 0.5em 1em;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 1px #c7c0b8;
`;

export const BotInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  width: 100%;
`;

export const KeyNameText = styled.p`
  font-size: ${props => props.fontSize}em;
  font-weight: 600;
  margin-bottom: 0 !important;
`;

export const Button = styled.div`
  cursor: ${props => (props.disable ? 'not-allowed' : 'pointer')};
  width: ${props => props.scale * 8}em;
  height: ${props => props.scale * 1.7}em;
  background-color: #2d889c;
  border-radius: ${props => props.scale * 0.3}em;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  > img {
    width: ${props => props.scale * 0.7}em;
    margin-right: ${props => props.scale * 0.2}em;
  }
  margin-left: 0.5em;
`;

export const TotalGCText = styled.p`
  font-size: ${props => props.scale}em;
  font-weight: 500;
  margin-bottom: 0 !important;

  > span {
    color: ${props => (props.isRed ? 'red' : 'black')};
  }
`;

export const ViewModeBtn = styled.div`
  border: solid 1.5px #2d889c;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: .4em;
  padding: ${props => props.scale * 0.1}em 0;
  color: #2d889c;
  margin: ${props => props.scale * 0.5}em 0 !important;
`;

export const ViewBotDetailIcon = styled.img`
  width: ${props => props.scale}em;
`;

export const DropdownArea = styled.div`
  display: flex;
  flex-direction: row-reverse;
  padding: 0.5em;
`;

export const WrapperSelect = styled.div`
  cursor: pointer;
  border-radius: 0.25em;
  margin-top: 1em;
`;

export const KeyActiveBurst = styled.img`
  width: 3em;
  margin-left: 0.5em;
`;

export const ModalWrapperMobile = styled(ModalWrapper)`
  margin: auto;
`;

export const ModalGameSceneHeader = styled(ModalHeaderCustom)`
  padding: 0.3em;
`;
