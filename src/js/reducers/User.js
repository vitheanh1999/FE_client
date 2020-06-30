import {
  SET_USER,
  AUTH_DEFAULT,
} from '../constants/auth';

const initState = {
  detail: {},
};

const User = (state = initState, action = {}) => {
  switch (action.type) {
    case SET_USER: {
      const result = { ...state };
      const { data } = action;
      data.data.user_gc = Math.trunc(data.data.user_gc * 100) / 100;
      result.detail = action.data.data;
      return result;
    }
    case AUTH_DEFAULT:
      return state;
    default:
      return state;
  }
};

export default User;
