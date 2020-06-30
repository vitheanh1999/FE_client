import {
  takeLatest,
  call,
  put,
  fork,
} from 'redux-saga/effects';
import api from '../services/api';
import {
  FETCH_LIST_BOTS, LIST_BOTS_UPDATE_BOT_STATUS, FETCH_BOT_HISTORY, FETCH_CHART_DATA,
  FETCH_BOT_DETAIL, FETCH_BOT_HISTORY_NOW, FETCH_HISTORY_TABLE, PAYOUT,
  FETCH_BOT_GC_NOW, FETCH_TABLE_STATUS_NOW, FETCH_MIN_PROFIT_VALUE,
  FETCH_PAY_OFF_HISTORY, FETCH_DATA_CHARTS, CREATE_BOTS,
  UPDATE_BOT_NAME, UPDATE_BOT_CAMPAIGN, DELETE_BOT,
} from '../constants/ListBots';
import {
  setListBots, setBotHistory, setChartData, setBotDetail, setPayOffHistory, setDataCharts,
} from '../actions/ListBots';

export function* fetchListBots(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().fetchListBots, params);
    const { data } = result;
    yield put(setListBots(data));
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchListBots() {
  yield takeLatest(FETCH_LIST_BOTS, fetchListBots);
}

export function* updateBotStatus(action) {
  try {
    const params = {
      botId: action.botId,
      status: action.status,
      is_reset_logic: action.isResetLogic,
    };
    const result = yield call(api.create().updateBotStatus, params);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchUpdateBotStatus() {
  yield takeLatest(LIST_BOTS_UPDATE_BOT_STATUS, updateBotStatus);
}

export function* updateBotName(action) {
  try {
    const params = {
      id: action.botId,
      name: action.name,
    };
    const result = yield call(api.create().updateBotName, params);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchUpdateBotName() {
  yield takeLatest(UPDATE_BOT_NAME, updateBotName);
}

export function* updateBotCampaign(action) {
  try {
    const params = {
      botId: action.botId,
      campaignId: action.idCampaign,
    };
    const result = yield call(api.create().updateBotCampaign, params);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchUpdateBotCampaign() {
  yield takeLatest(UPDATE_BOT_CAMPAIGN, updateBotCampaign);
}

export function* createBots(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().createBots, params);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchCreateBots() {
  yield takeLatest(CREATE_BOTS, createBots);
}

export function* deleteBot(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().deleteBot, params);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchDeleteBot() {
  yield takeLatest(DELETE_BOT, deleteBot);
}

export function* fetchBotHistory(action) {
  yield put(setBotHistory([]));
  try {
    const result = yield call(api.create().fetchBotHistory, action.params);
    action.onSuccess(result.data);
    yield put(setBotHistory(result.data));
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchBotHistory() {
  yield takeLatest(FETCH_BOT_HISTORY, fetchBotHistory);
}

export function* fetchPayOffHistory(action) {
  try {
    const { params } = action;
    const requestParams = {
      botIds: params.idsSelected,
      start_date: params.startDate,
      end_date: params.endDate,
    };
    const result = yield call(api.create().fetchPayOffHistory, requestParams);
    action.onSuccess(result.data);
    yield put(setPayOffHistory(result.data));
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchPayOffHistory() {
  yield takeLatest(FETCH_PAY_OFF_HISTORY, fetchPayOffHistory);
}

export function* fetchChartData(action) {
  try {
    const params = {
      botId: action.botId,
      startDate: action.startDate,
      endDate: action.endDate,
    };
    const result = yield call(api.create().fetchChartData, params);
    action.onSuccess(result.data);
    yield put(setChartData(result.data));
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchChartData() {
  yield takeLatest(FETCH_CHART_DATA, fetchChartData);
}

export function* fetchDataCharts(action) {
  try {
    const params = {
      botIds: action.botIds,
      start_date: action.startDate,
      end_date: action.endDate,
    };
    const result = yield call(api.create().fetchDataCharts, params);
    action.onSuccess();
    yield put(setDataCharts(result.data));
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchDataCharts() {
  yield takeLatest(FETCH_DATA_CHARTS, fetchDataCharts);
}

export function* fetchBotDetail(action) {
  try {
    const params = {
      botId: action.botId,
    };
    const result = yield call(api.create().fetchBotDetail, params);
    action.onSuccess(result.data);
    yield put(setBotDetail(result.data.data));
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchBotDetail() {
  yield takeLatest(FETCH_BOT_DETAIL, fetchBotDetail);
}

export function* fetchBotHistoryNow(action) {
  try {
    const params = {
      botId: action.botId,
      currentPage: action.currentPage,
      perPage: action.perPage,
    };

    const result = yield call(api.create().fetchBotHistoryNow, params);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchBotHistoryNow() {
  yield takeLatest(FETCH_BOT_HISTORY_NOW, fetchBotHistoryNow);
}

export function* fetchHistoryTable(action) {
  try {
    const params = {
      table: action.tableName,
    };

    const result = yield call(api.create().fetchHistoryTable, params);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchHistoryTable() {
  yield takeLatest(FETCH_HISTORY_TABLE, fetchHistoryTable);
}

export function* payout(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().payout, params);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchPayout() {
  yield takeLatest(PAYOUT, payout);
}

export function* fetchBotGCNow(action) {
  try {
    const { botId } = action;
    const result = yield call(api.create().fetchBotGCNow, botId);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchBotGCNow() {
  yield takeLatest(FETCH_BOT_GC_NOW, fetchBotGCNow);
}

export function* fetchTableStatusNow(action) {
  try {
    const { botId } = action;
    const result = yield call(api.create().fetchTableStatusNow, botId);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchTableStatusNow() {
  yield takeLatest(FETCH_TABLE_STATUS_NOW, fetchTableStatusNow);
}

export function* fetchMinProfitValue(action) {
  try {
    const result = yield call(api.create().fetchMinProfitValue);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchMinProfitValue() {
  yield takeLatest(FETCH_MIN_PROFIT_VALUE, fetchMinProfitValue);
}

export default function* listBots() {
  yield fork(watchFetchListBots);
  yield fork(watchUpdateBotStatus);
  yield fork(watchCreateBots);
  yield fork(watchFetchBotHistory);
  yield fork(watchFetchChartData);
  yield fork(watchFetchDataCharts);
  yield fork(watchFetchBotDetail);
  yield fork(watchFetchBotHistoryNow);
  yield fork(watchFetchHistoryTable);
  yield fork(watchPayout);
  yield fork(watchFetchBotGCNow);
  yield fork(watchFetchTableStatusNow);
  yield fork(watchFetchMinProfitValue);
  yield fork(watchFetchPayOffHistory);
  yield fork(watchUpdateBotName);
  yield fork(watchUpdateBotCampaign);
  yield fork(watchDeleteBot);
}
