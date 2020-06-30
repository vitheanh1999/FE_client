import {
  SET_BURST_STATUS,
  BURST_DEFAULT,
} from '../constants/Burst';

const initState = {
  burstStatus: {
    burst_active: 0,
    burst_inactive: 0,
  },
};

const Burst = (state = initState, action = {}) => {
  switch (action.type) {
    case SET_BURST_STATUS: {
      const result = { ...state };
      result.burstStatus = action.data.data;
      return result;
    }

    case BURST_DEFAULT:
      return state;

    default:
      return state;
  }
};

export default Burst;
