import styled from 'styled-components';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { ChartArea } from '../dashboard/Main';
import { Image } from '../listBots/listBotsStyle';

export const JapaneseDiv = styled.div`
`;

export const Notice = styled.div`
  white-space: pre-wrap;
  font-size: 0.7em;
  margin-left: 1em;
`;

export const PayoutButton = styled.div`
  background-color: ${props => (props.isActive ? '#2d889c' : '#ccc')};
  width: 6em;
  margin-left: 1em;
  cursor: ${props => (props.isActive ? 'pointer' : 'not-allowed')};
  color: #fff;
  border-radius: 0.3em;
  padding: 0.1em;
  text-align: center;
`;

export const DropdownArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const TitleChart = styled(DropdownArea)`
  justify-content: space-between;

  > span {
    color: red;
    font-size: 0.6em;
    align-self: flex-end;
  }
`;

export const GcArea = styled.div`
  > span {
    color: ${props => (props.isRed ? 'red' : 'black')};
  }
`;

export const ModalWrapper = styled(Modal)`
  max-width: ${props => props.width && props.width}px;
  min-width: ${props => props.width && props.width}px;
`;

export const StyledChartArea = styled(ChartArea)`
  padding-top: 1.5em;
  width: ${props => props.width && props.width};
  background-color: #333;
  color: #fff;
`;

export const ContentArea = styled(JapaneseDiv)`
  display: ${props => (props.display && props.display)};
  margin: 0.5em 1em 0 1em;
  border-radius: 0.25em;
  background-color: ${props => (props.bgrColor ? props.bgrColor : '')};
`;

export const Wrapper = styled(JapaneseDiv)`
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: ${props => (props.fontSize && props.fontSize)}px;
`;

export const ModalHeaderCustom = styled(ModalHeader)`
  padding: 0.5em;
  font-family:
    "SF Pro JP",
    "SF Pro Display"
    "SF Pro Icons",
    "Hiragino Kaku Gothic Pro",
    "ヒラギノ角ゴ Pro W3",
    "メイリオ", "Meiryo",
    "ＭＳ Ｐゴシック",
    "Helvetica Neue",
    "Helvetica",
    "Arial",
    sans-serif !important;

  button {
    outline: none;
  }
`;

export const HeaderPopup = styled(ModalHeaderCustom)`
  color: #fff;
  font-size: 1.5em;
  background: #2d889c;
`;

export const WrapperBotInfo = styled.div`
  width: 100%;
  border-radius: 0.25em;
  font-size: 1em;
`;

export const Content = styled.div`
  margin: 1em;
`;

export const CampaignAndDepositArea = styled.div`
  margin-top: 1em;
  display: ${props => props.isMobile || 'flex'};
  border: solid 2px #ccc;
  justify-content: space-between;
  padding: 1em;
`;

export const DepositInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.isMobile ? 'flex-start' : 'flex-end')};
`;

export const Name = styled.div`
  display: flex;
  align-items: center;
  font-size: ${props => (props.fontSize ? props.fontSize : 1.5)}em;
  font-weight: 400;
  margin-left: ${props => props.marginLeft && props.marginLeft};
  margin-bottom: ${props => props.marginBottom && props.marginBottom};
`;

export const NameArea = styled.div`
  width: 80%;
`;

export const HeaderArea = styled.div`
  height: 25%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatusInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.div`
  font-size: ${props => (props.fontSize ? props.fontSize : '1.4')}em;
  font-size: uppercase;
  font-weight: 900;
  text-align: center;
  display: flex;
  justify-content: ${props => (props.justifyContent ? props.justifyContent : 'space-between')};
`;

export const DepositButton = styled.div`
  border-radius: 0.25em;
  padding: 0.25em 1em;
  background-color: ${props => (props.isDisable ? '#ccc' : '#2d889c')};
  cursor: pointer;
  color: #fff;
`;

export const StatusDepositBtnStyled = styled.img`
  width: 1em;
`;

export const CampaignInfo = styled.div`
  font-size: 1em;
  margin-bottom: ${props => props.isMobile && '0.5em'};
`;

export const StatusBurstBtnStyled = styled.img`
  width: 5em;
  cursor: pointer;
`;

export const ImageButtonDetail = styled(Image)`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`;

export const BotActionBtnStyled = styled.img`
  width: 6.25em;
  cursor: pointer;
  margin-right: 0.5em;
`;

export const ModalMessage = styled.div`
  text-align: center;
  margin: 0 0 0.5em 0;
`;

export const BodyPopup = styled(ModalBody)`
  background: #17a2b87d;
  padding: 1.5em 0 1.5em 0;
  font-size: 1.5em;
`;

export const FormPopup = styled.div`
  justify-content: center;
  display: flex;
`;

export const TowButtonPopup = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const ContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  height: fit-content;
`;

export const Blank = styled.div`
  height: ${props => props.height}em;
  width: ${props => props.width}em;
`;

export const WrapperSpan = styled.span`
  display: flex;
  align-items: baseline;
  white-space: pre-wrap;
`;
