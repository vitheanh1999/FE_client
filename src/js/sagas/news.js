import {
  takeLatest,
  call,
  put,
  fork,
} from 'redux-saga/effects';
import api from '../services/api';
import {
  FETCH_LIST_NEWS,
  FETCH_LIST_NEWS_NOT_LOGIN,
  FETCH_NEW_DETAIL,
  FETCH_NEW_DETAIL_NOT_LOGIN,
} from '../constants/news';
import {
  setListNews,
  setNewDetail,
  setListNewsTop,
} from '../actions/news';

export function* fetchListNews(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().fetchListNews, params);
    const { data } = result;
    yield put(setListNews(data));
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchListNews() {
  yield takeLatest(FETCH_LIST_NEWS, fetchListNews);
}

export function* fetchNewDetail(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().fetchNewDetail, params);
    const { data } = result;
    yield put(setNewDetail(data.data));
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchNewDetail() {
  yield takeLatest(FETCH_NEW_DETAIL, fetchNewDetail);
}

export function* fetchListNewsNotLogin(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().fetchListNewsNotLogin, params);
    const { data } = result;
    yield put(setListNewsTop(data));
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchListNewsNotLogin() {
  yield takeLatest(FETCH_LIST_NEWS_NOT_LOGIN, fetchListNewsNotLogin);
}

export function* fetchNewDetailNotLogin(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().fetchNewDetailNotLogin, params);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchNewDetailNotLogin() {
  yield takeLatest(FETCH_NEW_DETAIL_NOT_LOGIN, fetchNewDetailNotLogin);
}

export default function* news() {
  yield fork(watchFetchListNews);
  yield fork(watchFetchNewDetail);
  yield fork(watchFetchListNewsNotLogin);
  yield fork(watchFetchNewDetailNotLogin);
}
