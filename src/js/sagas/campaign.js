import {
  takeLatest,
  call,
  put,
  fork,
} from 'redux-saga/effects';
import api from '../services/api';
import {
  FETCH_LIST_CAMPAIGNS,
  CREATE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  DELETE_CAMPAIGN,
  FETCH_LIST_LOGIC_PATTERN,
  FETCH_LIST_BET_PATTERN,
} from '../constants/campaign';
import {
  setListCampaigns,
  setListBetPattern,
  setListLogicPattern,
} from '../actions/campaign';

export function* fetchListCampaigns(action) {
  try {
    const params = {
      perPage: action.params ? action.params.perPage : '',
      currentPage: action.params ? action.params.currentPage : '',
    };
    const result = yield call(api.create().fetchListCampaigns, params);
    const { data } = result;
    yield put(setListCampaigns(data));
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchListCampaigns() {
  yield takeLatest(FETCH_LIST_CAMPAIGNS, fetchListCampaigns);
}

export function* creatCampaign(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().createCampaign, params);
    const { data } = result;
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchCreatCampaign() {
  yield takeLatest(CREATE_CAMPAIGN, creatCampaign);
}

export function* updateCampaign(action) {
  try {
    const params = {
      ...action.params,
      id: action.params._id
    };
    const result = yield call(api.create().updateCampaign, params);
    const { data } = result;
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchUpdateCampaign() {
  yield takeLatest(UPDATE_CAMPAIGN, updateCampaign);
}

export function* deleteCampaign(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().deleteCampaign, params);
    const { data } = result;
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchDeleteCampaign() {
  yield takeLatest(DELETE_CAMPAIGN, deleteCampaign);
}

export function* fetchListLogicPattern(action) {
  try {
    const result = yield call(api.create().fetchListLogicPattern, action.campaignId);
    const { data } = result;
    yield put(setListLogicPattern(data.data));
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchListLogicPattern() {
  yield takeLatest(FETCH_LIST_LOGIC_PATTERN, fetchListLogicPattern);
}

export function* fetchListBetPattern(action) {
  try {
    const result = yield call(api.create().fetchListBetPattern, action.campaignId);
    const { data } = result;
    yield put(setListBetPattern(data.data));
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchListBetPattern() {
  yield takeLatest(FETCH_LIST_BET_PATTERN, fetchListBetPattern);
}

export default function* listCampaigns() {
  yield fork(watchFetchListCampaigns);
  yield fork(watchCreatCampaign);
  yield fork(watchUpdateCampaign);
  yield fork(watchFetchListLogicPattern);
  yield fork(watchFetchListBetPattern);
  yield fork(watchDeleteCampaign);
}
