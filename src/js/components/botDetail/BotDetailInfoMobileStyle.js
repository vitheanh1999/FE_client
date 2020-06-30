import styled from 'styled-components';
import {
  Image, ButtonViewMode, Button,
} from '../listBots/Main';

export const WrapperBotInfo = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 0.25em;
  position: relative;
`;

export const Content = styled.div`
  margin: 1em;
`;

export const BurstAndDepositArea = styled.div`
  margin-top: 0.5em;
  display: flex;
  padding-bottom: 0.5em;
  border-bottom: solid 2px #ccc;
`;

export const DepositInfo = styled.div`
  flex: ${props => props.flex};
`;

export const Name = styled.div`
  font-weight: bold;
`;

export const NameArea = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  justify-content: center;
  height: 1.8em;
`;

export const HeaderArea = styled.div`
  height: 25%;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
`;

export const StatusInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.div`
  font-size: 0.8em;
  text-transform: uppercase;
  font-weight: 700;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const DepositButton = styled.div`
  border-radius: 0.25em;
  padding: 0.25em 1em;
  background-color: #2d889c;
  cursor: pointer;
  color: #fff;
  font-size: 0.7em;
  white-space: nowrap;
`;

export const StatusDepositBtnStyled = styled.img`
  width: 1em;
`;

export const BurstInfo = styled.div`
  flex: ${props => props.flex};
  border-right: solid 2px #ccc;
`;

export const StatusBurstBtnStyled = styled.img`
  width: 5em;
  cursor: pointer;
`;

export const BotActionBtnStyled = styled.img`
  width: 6.25em;
  cursor: pointer;
  margin-right: 0.5em;
`;

export const ImageButtonDetail = styled(Image)`
  width: 0.8em;
  position: absolute;
  right: 0;
`;

export const ButtonViewModeMobile = styled(ButtonViewMode)`
  width: 100%;
  font-size: 0.8em;
  margin-top: 0.5em;
  background-color: #fff;
  border: solid 1.5px #2d889c;
  color: #2d889c;
`;

export const ButtonOnOff = styled(Button)`
  font-size: 0.8em;
  position: absolute;
  right: 0;
`;

export const ButtonX = styled.img`
  position: absolute;
  top: 0.2em;
  right: 0.2em;
  height: 0.6em;
`;
