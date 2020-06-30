import {
  SET_MAINTAIN,
} from '../constants/maintain';

const initState = {
  maintainInfo: {},
};

const Maintain = (state = initState, action = {}) => {
  switch (action.type) {
    case SET_MAINTAIN: {
      const result = { ...state };
      result.maintainInfo = action.data.data;
      return result;
    }
    default:
      return state;
  }
};

export default Maintain;
