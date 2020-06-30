import {
  takeLatest,
  call,
  put,
  fork,
} from 'redux-saga/effects';
import api from '../services/api';
import { setUser } from '../actions/auth';
import { CONNECT_LUC_ACCOUNT, FETCH_USER, REFRESH_TOKEN } from '../constants/auth';
import StorageUtils from '../helpers/StorageUtils';

export function* fetchUser(action) {
  try {
    const result = yield call(api.create().fetchUser);
    const { data } = result;
    yield put(setUser(data));
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchUser() {
  yield takeLatest(FETCH_USER, fetchUser);
}

export function* connectToLucAcc(action) {
  try {
    const params = {
      support_id: action.supportId,
      email: action.email,
    };
    const result = yield call(api.create().connectToLucAccount, params);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchConnectToLucAccount() {
  yield takeLatest(CONNECT_LUC_ACCOUNT, connectToLucAcc);
}

export function* refreshToken(action) {
  try {
    const params = { delete_old_token: 0 };
    const result = yield call(api.create().refreshToken, params);
    const { data } = result;
    if (params.delete_old_token) {
      StorageUtils.setToken(data.access_token);
    }
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchRefreshToken() {
  yield takeLatest(REFRESH_TOKEN, refreshToken);
}

export default function* auth() {
  yield fork(watchFetchUser);
  yield fork(watchConnectToLucAccount);
  yield fork(watchRefreshToken);
}
