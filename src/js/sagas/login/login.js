import { call, fork, takeLatest } from 'redux-saga/effects';
import jwt from 'jwt-simple';
import api from '../../services/api';
import { KEY_JWT, ENABLE_CHANGE_LANGUAGE } from '../../config';
import {
  LOGIN, LOGIN_DEMO, // LOGOUT,
} from '../../constants/login';
import StorageUtils, { STORAGE_KEYS } from '../../helpers/StorageUtils';
import { handleAfterLogin, getLanguageCurrent } from '../../helpers/utils';

export function* login(action) {
  try {
    const {
      email, pass,
    } = action;
    const language = ENABLE_CHANGE_LANGUAGE ? getLanguageCurrent() : 'ja';
    const params = {
      email,
      password: pass,
      language,
    };
    const result = yield call(api.create().login, params);
    const { data } = result;
    handleAfterLogin(data, email);
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchLogin() {
  yield takeLatest(LOGIN, login);
}

export function* loginDemo(action) {
  try {
    const params = { dashboard_account_id: action.dashboardAccountId };
    const result = yield call(api.create().loginDemo, { jwt: jwt.encode(params, KEY_JWT) });
    const { data } = result;
    StorageUtils.setToken(data.access_token);
    StorageUtils.setSectionStorageItem(STORAGE_KEYS.userRole, data.role);
    action.onSuccess(LOGIN_DEMO, data);
  } catch (err) {
    action.onError(LOGIN_DEMO, err);
  }
}

export function* watchLoginDemo() {
  yield takeLatest(LOGIN_DEMO, loginDemo);
}

export default function* loginSaga() {
  yield fork(watchLogin);
  yield fork(watchLoginDemo);
}
