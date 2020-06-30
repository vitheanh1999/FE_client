import styled from 'styled-components';
import i18n from '../../i18n/i18n';


export const WrapperCampaignItem = styled.div`
  padding: 1em 2%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 1px #c7c0b8;
  background-color: ${props => (props.isOffMin ? '#f4dbdb4f' : '#fff')};

  &:hover {
    background-color: ${props => (props.isOffMin ? '#f4dbdb80' : '#f4f3f2')};
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${props => props.flex};
`;

export const Row = styled.div`
  display: flex;
`;

export const WrapperInfo = styled.div`
  height: 100%;
`;

export const WrapperAction = styled.div`
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
`;

export const ButtonAction = styled.div`
  cursor: pointer;
  width: ${props => props.width && props.width}em;
  height: ${props => props.height && props.height}em;
  font-size: ${props => props.fontSize && props.fontSize};
  margin: ${props => props.margin && props.margin};
  padding: ${props => props.padding && props.padding};
  background-color: ${props => (props.color && props.color)};
  border-radius: ${props => (props.borderRadiusor ? props.borderRadiusor : 0.3)}em;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  > img {
    width: 1em;
  }

  &: hover {
    background-color: ${props => props.hoverBgColor && props.hoverBgColor};
  }
`;

export const FieldText = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-left: 0.5em;
`;

export const Title = styled.div`
  font-weight: bold;
  font-size: 1.2em;
`;

export const FieldTitle = styled(FieldText)`
  font-weight: bold;
  margin-left: 0;
`;

export const Image = styled.img`
  margin-left: 0.25em;
`;

export const TotalText = styled.div`
  flex-direction: row;
  display: flex;
  color: black;
  justify-content: flex-start;
  font-size: 1.3em;
  font-weight: bold;
`;

export const WrapperDetail = styled.div`
  width: 100%;
  height: ${props => !props.isMobile && '40em'};
  display: flex;
  flex-direction: column;
  font-size: ${props => (props.fontSize && props.fontSize)}px;
`;

export const DATA_TYPE = {
  int: 1,
  float: 2,
  text: 3,
  bool: 4,
};

export const FooterWrapper = styled(Row)`
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  padding-right: 1em;
`;

export const ButtonOK = styled.div`
  background-color: #23b083;
  border-radius: 0.2em;
  width: 9em;
  padding: 0.3em 0;
  font-weight: bold;
  cursor: pointer;
  margin: 0.5em 0;
  display: flex;
  justify-content: center;
  align-items: center;

  &: hover {
    background-color: #23b083aa;
  }
`;

export const ButtonRevert = styled(ButtonOK)`
  background-color: #b0b4b5;
  margin-right: 1em;

  &: hover {
    background-color: #b0b4b5d9;
  }
`;

export const RowBlankCenter = styled(Row)`
  justify-content: space-between;
`;

export const ButtonAddCampaign = styled.div`
  padding: 1em;
  opacity: 1;
  border-radius: 0.3em;
  color: #fff;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 1.7em;
  background-color: #2d889c;

  &: hover {
    background-color: #20bcdf;
  }
`;

export const IconAdd = styled.img`
  width: 1em;
  margin-right: 0.5em;
`;

export const Blank = styled.div`
  height: ${props => props.height}em;
  width: ${props => props.width}em;
`;

export const TABS = {
  basic: { id: 1, text: i18n.t('basic') },
  advance: { id: 2, text: i18n.t('advance') },
  // option: { id: 3, text: 'Option' },
};

export const validCampaign = {
  name: {
    isValid: true,
    invalidText: '',
    tabId: TABS.basic.id,
  },
  max_profit: {
    isValid: true,
    invalidText: '',
    tabId: TABS.basic.id,
  },
  min_profit: {
    isValid: true,
    invalidText: '',
    tabId: TABS.basic.id,
  },
  total_played_turn: {
    isValid: true,
    invalidText: '',
    tabId: TABS.advance.id,
  },
  nearest_turns: {
    isValid: true,
    invalidText: '',
    tabId: TABS.advance.id,
  },
  win_rate_value: {
    isValid: true,
    invalidText: '',
    tabId: TABS.advance.id,
  },
  look_rate_value: {
    isValid: true,
    invalidText: '',
    tabId: TABS.advance.id,
  },
  point_rate: {
    isValid: true,
    invalidText: '',
    tabId: TABS.basic.id,
  },
  zero_bet_mode: {
    isValid: true,
    invalidText: '',
    tabId: TABS.advance.id,
  },
};

export const DEFAULT_MAX_POINT_RATE = 10000;
export const UN_LIMMITED_BET = -1;
const DEFAULT_SETTING_POINT_RATE = {
  min: 1,
  max: DEFAULT_MAX_POINT_RATE,
  minBetPoint: 1,
  maxBetPoint: UN_LIMMITED_BET,
};

export const getPointRateSetting = (logicId, listLogic) => {
  const setting = { ...DEFAULT_SETTING_POINT_RATE };
  if (logicId === null || logicId === undefined || logicId < 0) return setting;
  if (listLogic === null || listLogic === undefined || listLogic.length < 1) {
    return setting;
  }

  let info = null;
  for (let i = 0; i < listLogic.length; i += 1) {
    if (listLogic[i].id === logicId) {
      info = listLogic[i];
      break;
    }
  }
  if (info === null) return setting;
  setting.min = info.min_point_rate;
  setting.max = info.max_point_rate;
  setting.minBetPoint = parseFloat(info.min_bet_point || '1');
  setting.maxBetPoint = info.max_bet_point === '-' ? UN_LIMMITED_BET : parseFloat(info.max_bet_point);
  return setting;
};
