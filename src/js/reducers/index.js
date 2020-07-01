import { combineReducers } from 'redux';
import User from './User';
import Dashboard from './Dashboard';
import ListBots from './ListBots';
import Deposit from './Deposit';
import Burst from './Burst';
import Maintain from './maintain';
import Campaigns from './campaigns';
import news from './news';
import table from './table';
import customCampaign from './customCampaign';

const appReducer = combineReducers({
  User,
  Dashboard,
  ListBots,
  Deposit,
  Burst,
  Maintain,
  Campaigns,
  news,
  table,
  customCampaign,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
