import {
  takeLatest,
  call,
  put,
  fork,
} from 'redux-saga/effects';
import api from '../services/api';
import {
  FETCH_BURST_STATUS,
} from '../constants/Burst';
import {
  setBurstStatus,
} from '../actions/Burst';

export function* fetchBurstStatus(action) {
  try {
    const result = yield call(api.create().fetchBurstStatus);
    yield (put(setBurstStatus(result.data)));
    action.onSuccess();
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchBurstStatus() {
  yield takeLatest(FETCH_BURST_STATUS, fetchBurstStatus);
}

export default function* Burst() {
  yield fork(watchFetchBurstStatus);
}
