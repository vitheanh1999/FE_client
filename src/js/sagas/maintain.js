import {
  takeLatest,
  call,
  put,
  fork,
} from 'redux-saga/effects';
import api from '../services/api';
import { setMaintainInfo } from '../actions/maintain';
import { CHECK_MAINTAIN } from '../constants/maintain';

export function* fetchMaintainInfo(action) {
  try {
    const result = yield call(api.create().fetchMaintainInfo);
    const { data } = result;
    yield put(setMaintainInfo(data));
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchMaintainInfo() {
  yield takeLatest(CHECK_MAINTAIN, fetchMaintainInfo);
}


export default function* maintain() {
  yield fork(watchFetchMaintainInfo);
}
