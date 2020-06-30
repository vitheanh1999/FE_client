import {
  takeLatest,
  call,
  put,
  fork,
} from 'redux-saga/effects';
import api from '../services/api';
import {
  GET_BOT_TOTAL_GC_HISTORY,
} from '../constants/Dashboard';
import {
  setBotTotalGcHistory,
} from '../actions/Dashboard';

export function* getBotTotalGcHistory(action) {
  try {
    const params = {
      list_bot_id: action.listBotId,
      start_date: action.startDate,
      end_date: action.endDate,
    };
    const result = yield call(api.create().getBotTotalGcHistory, params);
    const { data } = result;
    yield put(setBotTotalGcHistory(data));
    action.onSuccess();
  } catch (err) {
    action.onError(err);
  }
}

export function* watchGetBotTotalGcHistory() {
  yield takeLatest(GET_BOT_TOTAL_GC_HISTORY, getBotTotalGcHistory);
}

export default function* Dashboard() {
  yield fork(watchGetBotTotalGcHistory);
}
