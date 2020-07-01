import {
  SET_LIST_LOGIC_PATTERN_CUSTOM,
  SET_LIST_BET_PATTERN_CUSTOM,
} from '../constants/customCampaign';

const initState = {
  listLogicSetting: [],
  totalLogicSetting: 0,
  listBetPattern: [],
  totalBetPattern: 0,
};

const CustomCampaign = (state = initState, action = {}) => {
  switch (action.type) {
    case SET_LIST_LOGIC_PATTERN_CUSTOM: {
      const result = { ...state };
      result.listLogicSetting = action.data.data;
      result.totalLogicSetting = action.data.total_logic_pattern;
      return result;
    }
    case SET_LIST_BET_PATTERN_CUSTOM: {
      const result = { ...state };
      result.listBetPattern = action.data.data;
      result.totalBetPattern = action.data.total_bet_pattern;
      return result;
    }
    default:
      return state;
  }
};

export default CustomCampaign;
