import {
  SET_BOT_TOTAL_GC_HISTORY,
  DEFAULT,
} from '../constants/Dashboard';

const initState = {
  totalGc: [],
};

const Dashboard = (state = initState, action = {}) => {
  switch (action.type) {
    case SET_BOT_TOTAL_GC_HISTORY: {
      const result = { ...state };
      result.totalGc = action.data;
      return result;
    }

    case DEFAULT:
      return state;

    default: {
      return state;
    }
  }
};

export default Dashboard;
