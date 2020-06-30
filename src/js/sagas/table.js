import {
  takeLatest, call,
  fork, put,
} from 'redux-saga/effects';
import api from '../services/api';
import { FETCH_LIST_TABLE, SELECT_TABLE } from '../constants/table';
import { setListTable } from '../actions/table';

export function* fetchListTable(action) {
  try {
    const result = yield call(api.create().fetchListTable);
    const { data } = result;
    yield put(setListTable(data));
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchListTable() {
  yield takeLatest(FETCH_LIST_TABLE, fetchListTable);
}

export function* selectTable(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().selectTable, params);
    const { data } = result;
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchSelectTable() {
  yield takeLatest(SELECT_TABLE, selectTable);
}

export default function* table() {
  yield fork(watchFetchListTable);
  yield fork(watchSelectTable);
}
