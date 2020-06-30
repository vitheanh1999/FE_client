import {
  LOGIN,
  LOGOUT,
  LOGIN_DEMO,
} from '../constants/login';

export const login = (email, pass, onSuccess, onError) => ({
  type: LOGIN,
  email,
  pass,
  onSuccess,
  onError,
});

export const logout = (onSuccess, onError) => ({
  type: LOGOUT,
  onSuccess,
  onError,
});

export const loginDemo = (dashboardAccountId, onSuccess, onError) => ({
  type: LOGIN_DEMO,
  dashboardAccountId,
  onSuccess,
  onError,
});
