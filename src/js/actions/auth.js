import {
  FETCH_USER,
  SET_USER,
  CONNECT_LUC_ACCOUNT,
  REFRESH_TOKEN,
} from '../constants/auth';

export const fetchUser = (onSuccess, onError) => ({
  type: FETCH_USER,
  onSuccess,
  onError,
});

export const setUser = data => ({
  type: SET_USER,
  data,
});

export const connectLucAccount = (supportId, email, onSuccess, onError) => ({
  type: CONNECT_LUC_ACCOUNT,
  supportId,
  email,
  onSuccess,
  onError,
});

export const refreshToken = (onSuccess, onError) => ({
  type: REFRESH_TOKEN,
  onSuccess,
  onError,
});
