import {
  SET_LIST_CAMPAIGNS,
  SET_LIST_BET_PATTERN,
  SET_LIST_LOGIC_PATTERN,
} from '../constants/campaign';

const initState = {
  listCampaigns: [],
  listBetPatterns: [],
  listLogicPatterns: [],
  totalCampaign: 0,
};

const Campaigns = (state = initState, action = {}) => {
  switch (action.type) {
    case SET_LIST_CAMPAIGNS: {
      const result = { ...state };
      result.listCampaigns = action.data.data;
      result.totalCampaign = action.data.total_campaigns;
      return result;
    }

    case SET_LIST_BET_PATTERN: {
      const result = { ...state };
      result.listBetPatterns = action.data;
      return result;
    }

    case SET_LIST_LOGIC_PATTERN: {
      const result = { ...state };
      result.listLogicPatterns = action.data;
      return result;
    }

    default:
      return state;
  }
};

export default Campaigns;
