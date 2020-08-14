import styled from 'styled-components';
import { Modal, ModalHeader } from 'reactstrap';
import i18n from '../../i18n/i18n';
import images from '../../theme/images';

export const Paging = styled.div`
  transform: scale(${props => (props.fontSize && props.fontSize) / 20});
  margin-top: -1em;
`;

export const BotActionBtnStyled = styled.img`
  width: 6.5em;
  cursor: pointer;
`;

export const DropdownArea = styled.div`
  display: flex;
  flex-direction: row-reverse;
  padding: 0.5em;
`;

export const StatusBurstBtnStyled = styled.img`
  width: 1.5em;
  margin-right: 0.5em;
  cursor: pointer;
`;

export const Wrapper = styled.div`
  padding: 1.111em 2em;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  min-width: 26em;
`;

export const WrapperBotInfo = styled.div`
  width: 100%;
  height: 10em;
  background: #f4f3f2;
  border-radius: 0.25em;
`;


export const WrapperAddBot = styled.div`
  width: 100%;
  height: 2em;
  background: #f4f3f2;
  border-radius: 0.25em;
`;

export const TotalGCTitle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3em;
  font-weight: 700;
  height: 3em;
`;

export const WrapperBotsStatus = styled.div`
  display: flex;
  justify-content: center;
  height: 6em;

  & > div:not(:last-child) {
    border-right: 1px solid grey;
  }
`;

export const BotStatus = styled.div`
  font-size: 1.2em;
  font-weight: 700;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1em;
`;

export const WrapperListBots = styled.div`
  cursor: pointer;
  border-radius: 0.25em;
  background: white;
`;

export const WrapperBot = styled.div`
  padding: 1em 2%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 7em;
  border-bottom: solid 1px #c7c0b8;
  background-color: ${props => (props.isOffMin ? '#f4dbdb4f' : '#fff')};

  &:hover {
    background-color: ${props => (props.isOffMin ? '#f4dbdb80' : '#f4f3f2')};
  }
`;

export const TotalGCText = styled.div`
  font-size: ${props => (props.fontSize ? props.fontSize : '1em')};
  font-weight: 700;
  display: flex;
  white-space: pre-wrap;

  > span {
    color: ${props => (props.isRed ? 'red' : '#fff')};
  }
`;

export const TableText = styled.div`
  font-size: ${props => (props.fontSize ? props.fontSize : '1em')};
  font-weight: 700;
  display: flex;
  white-space: pre-wrap;
`;

export const Message = styled.span`
  font-size: ${props => (props.fontSize ? props.fontSize : '1em')};
  font-weight: ${props => (props.fontWeight ? props.fontWeight : '700')};
  color: ${props => (props.color ? props.color : '#fff')};
  margin-left: 0.5em;
`;

export const ReasonOffBot = styled.div`
  display: flex;
  align-items: center;
  background-image:  url(${props => props.isMobile && images.iconOffReason.bkgReasonOff});
  background-size: 70% 100%;
  background-repeat: no-repeat;
  margin-left: -1em;
`;

export const KeyName = styled.div`
  display: flex;
  align-items: center;
`;

export const KeyStatusBtn = styled.div`
  width: 5em;
  height: 1.7em;
  background-color: ${props => (props.botStatus ? '#d00000' : '#31ae00')};
  border-radius: 0.3em;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-weight: 600;
  font-size: 1.2em;

  > img {
    width: 1em;
    margin-right: 0.2em;
  }
  ${props => (props.isTitle ? 'font-size: 1.2em' : '')};
`;

export const KeyActiveBurst = styled.img`
  width: 5em;
  height: 1.7em;
  margin-left: 0.5em;
`;

export const KeyNameText = styled.p`
  margin-left: 1.5em;
  font-size: 1em;
  font-weight: 700;
  margin-bottom: 0 !important;
`;

export const ModalWrapper = styled(Modal)`
  max-width: ${props => props.width}px;
  min-width: ${props => props.width}px;
  margin: auto;
  > div {
    background-color: ${props => props.isOffBot && '#3333'};
  }
`;

export const RightSideGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
  height: 100%;

  #show-detail-btn {
    width: 1em;
  }
`;

export const Image = styled.img`
  cursor: pointer;
  margin-left: 0.25em;
  margin-bottom: 0.35em;
`;

const styleOpacity = (props) => {
  if (props.disable) {
    return 0.25;
  }
  return props.opacity ? props.opacity : 1;
};

export const ButtonCore = styled.div`
  cursor: pointer;
  width: ${props => props.width && props.width};
  height: ${props => props.height && props.height};
  font-size: ${props => props.fontSize && props.fontSize};
  margin: ${props => props.margin && props.margin};
  padding: ${props => props.padding && props.padding};
  background-color: ${props => (props.color && props.color)};
  opacity: ${props => styleOpacity(props)};
  border-radius: 0.3em;
  color: #fff;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;

  > img {
    width: 1em;
    margin-right: 0.2em;
  }

  &: hover {
    background-color: ${props => props.hoverBgColor && props.hoverBgColor};
  }
`;

export const ButtonDisable = styled(ButtonCore)`
  opacity: ${props => (props.disabled ? 0.25 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'initial')};
`;

export const Button = styled(ButtonCore)`
  cursor: ${props => (props.disable ? 'not-allowed' : 'pointer')};
  width: ${props => props.width};
  height: ${props => (props.height ? props.height : '1.7em')};
  background-color: ${props => (props.disable ? '#ccc' : '#2d889c')};
`;

export const ButtonViewMode = styled(Button)`
  margin-top: ${props => props.marginTop}em;
  margin-left: unset;
  width: 9em;
  > img {
  width: 1em;
  margin - right: unset;
  margin - left: 0.2em;
}
`;

export const TextNoMargin = styled.p`
margin: 0!important;
color: ${props => (props.isRed ? 'red' : 'black')};
`;

export const ModalHeaderCustom = styled(ModalHeader)`
  padding: 0.5em;
  background-color: ${props => props.isOffBot && '#00647a'};
  color: ${props => props.isOffBot && '#fcfcfc'};

  button {
    outline: none;
    color: ${props => props.isOffBot && '#fcfcfc'};
  }
`;

export const RemoveFormButton = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StyledModal = styled(Modal)`
  max-width: ${props => !props.isMobile && '80%'};
  >div {
    background-color: #333333;
    color: #fcfcfc;
  }
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
`;

export const ContentRemainTime = styled.div`
  font-size: 80%;
  display: ${props => !props.isMobile && 'flex'};
  background-image:  url(${props => !props.isMobile && images.iconOffReason.bkgReasonOff});
  background-size: 70% 100%;
  background-repeat: no-repeat;
  margin: 0.3em 0;
`;

export const JapanFont = styled.div`
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

export const Img = styled.img`
  width: 0.7em;
  vertical-align: middle;
  cursor: pointer;
  margin-left: 1em;
`;

export const getReasonTurnOff = (bot) => {
  const keyReasons = {
    isOffMinProfit: bot.is_off_min_profit,
    isOffMaxProfit: bot.is_off_max_profit,
    isOffBettingFe: bot.is_off_betting_fe,
    isOffManually: bot.is_off_manually_fe,
    isOffChangeTable: bot.is_off_change_table_fe,
  };
  const keyReason = Object.keys(keyReasons).find(key => keyReasons[key] === 1);
  return keyReason;
};


export const styleReasonOffBot = {
  isOffMinProfit: {
    color: '#ff1111',
    icon: images.iconOffReason.iconOffRed,
    labelOnBot: i18n.t('onBotAgain'),
  },
  isOffMaxProfit: {
    color: '#ffe720',
    icon: images.iconOffReason.iconOffYellow,
    labelOnBot: i18n.t('onBotAgain'),
  },
  isOffBettingFe: {
    color: '#ff1111',
    icon: images.iconOffReason.iconOffRed,
    labelOnBot: i18n.t('onChargeAgain'),
  },
  isOffManually: {
    color: '#cccccc',
    icon: images.iconOffReason.iconOffWhite,
    labelOnBot: i18n.t('onBotAgain'),
  },
  isOffChangeTable: {
    color: '#ff1111',
    icon: images.iconOffReason.iconOffRed,
    labelOnBot: i18n.t('onBotAgain'),
  },
};

export const IconViewMode = styled.img`
  margin-left: 0.3em;
`;

export const WrapperSpan = styled.span`
  display: flex;
`;
