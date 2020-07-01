import {
  takeLatest,
  call,
  put,
  fork,
} from 'redux-saga/effects';
import api from '../services/api';
import {
  FETCH_LIST_LOGIC_PATTERN_CUSTOM,
  FETCH_LIST_BET_PATTERN_CUSTOM,
  DELETE_LOGIC_PATTERN_CUSTOM,
  CREATE_OR_UPDATE_LOGIC_PATTERN,
  GET_SETTING_WORKER,
  GET_DETAIL_LOGIC_PATTERN_CUSTOM,
  GET_DETAIL_BET_PATTERN,
  CREATE_OR_UPDATE_BET_PATTERN,
  DELETE_BET_PATTERN,
} from '../constants/customCampaign';
import {
  setListLogicSetting,
  setListBetPatternCustom,
} from '../actions/customCampaign';

export function* fetchListLogicSetting(action) {
  try {
    const result = yield call(api.create().fetchListLogicSetting, action.params);
    const { data } = result;
    yield put(setListLogicSetting(data));
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchListLogicSetting() {
  yield takeLatest(FETCH_LIST_LOGIC_PATTERN_CUSTOM, fetchListLogicSetting);
}

export function* fetchListBetPatternCustom(action) {
  try {
    const result = yield call(api.create().fetchListBetPatternCustom, action.params);
    const { data } = result;
    yield put(setListBetPatternCustom(data));
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* creatLogicPattern(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().createOrUpdateLogicPattern, params);
    const { data } = result;
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchCreatLogicPattern() {
  yield takeLatest(CREATE_OR_UPDATE_LOGIC_PATTERN, creatLogicPattern);
}

export function* creatBetPattern(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().createOrUpdateBetPattern, params);
    const { data } = result;
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchCreatBetPattern() {
  yield takeLatest(CREATE_OR_UPDATE_BET_PATTERN, creatBetPattern);
}

export function* deleteLogicSetting(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().deleteLogicPattern, params);
    const { data } = result;
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchListBetPatternCustom() {
  yield takeLatest(FETCH_LIST_BET_PATTERN_CUSTOM, fetchListBetPatternCustom);
}

export function* watchDeleteLogicSetting() {
  yield takeLatest(DELETE_LOGIC_PATTERN_CUSTOM, deleteLogicSetting);
}

export function* deleteBetPattern(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().deleteBetPattern, params);
    const { data } = result;
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchDeleteBetPattern() {
  yield takeLatest(DELETE_BET_PATTERN, deleteBetPattern);
}

export function* getSettingWorker(action) {
  try {
    const { currentTab } = action;
    const result = yield call(api.create().getSettingWorker, currentTab);
    const { data } = result;
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchGetSettingWorker() {
  yield takeLatest(GET_SETTING_WORKER, getSettingWorker);
}

export function* getDetailLogicPattern(action) {
  try {
    const result = yield call(api.create().getDetailLogicPattern, action.id);
    const { data } = result;
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchGetDetailLogicPattern() {
  yield takeLatest(GET_DETAIL_LOGIC_PATTERN_CUSTOM, getDetailLogicPattern);
}

export function* getDetailBetPattern(action) {
  try {
    const result = yield call(api.create().getDetailBetPattern, action.id);
    const { data } = result;
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchGetDetailBetPattern() {
  yield takeLatest(GET_DETAIL_BET_PATTERN, getDetailBetPattern);
}

export default function* listLogicSetting() {
  yield fork(watchFetchListLogicSetting);
  yield fork(watchFetchListBetPatternCustom);
  yield fork(watchDeleteLogicSetting);
  yield fork(watchCreatLogicPattern);
  yield fork(watchGetSettingWorker);
  yield fork(watchGetDetailLogicPattern);
  yield fork(watchGetDetailBetPattern);
  yield fork(watchCreatBetPattern);
  yield fork(watchDeleteBetPattern);
}
