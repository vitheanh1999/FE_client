import {
  takeLatest,
  call,
  put,
  fork,
} from 'redux-saga/effects';
import api from '../services/api';
import {
  DEPOSIT_FETCH_LIST_BOTS,
  FETCH_PAYMENT_INFO,
  DEPOSIT_GET_PRICE_USD,
  DEPOSIT_GET_PRICE_BTC,
  DEPOSIT_REQUEST_PAYING,
  DEPOSIT_GET_HISTORY,
  GIFT_GET_HISTORY,
  PURCHASE_GIFT,
  FETCH_PAYOUT_HISTORY,
} from '../constants/Deposit';
import { setListBots, setPaymentInfo } from '../actions/Deposit';

export function* fetchListBots(action) {
  try {
    const result = yield call(api.create().getListBots, action.sortBy);
    yield (put(setListBots(result.data)));
    action.onSuccess();
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchListBots() {
  yield takeLatest(DEPOSIT_FETCH_LIST_BOTS, fetchListBots);
}

export function* fetchPaymentInfo(action) {
  try {
    const result = yield call(api.create().fetchPaymentInfo);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchPaymentInfo() {
  yield takeLatest(FETCH_PAYMENT_INFO, fetchPaymentInfo);
}

export function* getPriceUSD(action) {
  try {
    const params = { botIds: action.botIds };
    const result = yield call(api.create().getPriceUSD, params);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchGetPriceUSD() {
  yield takeLatest(DEPOSIT_GET_PRICE_USD, getPriceUSD);
}

export function* getPriceBTC(action) {
  try {
    const params = {
      botIds: action.botIds,
      symbol: action.symbol,
      amount: action.amount,
    };
    const result = yield call(api.create().getPriceBTC, params);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchGetPriceBTC() {
  yield takeLatest(DEPOSIT_GET_PRICE_BTC, getPriceBTC);
}

export function* requestPaying(action) {
  try {
    const { amount, detail } = action;
    const params = {
      amount,
      detail,
    };
    const result = yield call(api.create().requestPaying, params);
    yield put(setPaymentInfo(result.data.data));
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchRequestPaying() {
  yield takeLatest(DEPOSIT_REQUEST_PAYING, requestPaying);
}

export function* getDepositHistory(action) {
  try {
    const { perPage, currentPage } = action;
    const result = yield call(api.create().getDepositHistory, perPage, currentPage);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchGetDepositHistory() {
  yield takeLatest(DEPOSIT_GET_HISTORY, getDepositHistory);
}

export function* getGiftHistory(action) {
  try {
    const { perPage, currentPage } = action;
    const result = yield call(api.create().getGiftHistory, perPage, currentPage);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchGetGiftHistory() {
  yield takeLatest(GIFT_GET_HISTORY, getGiftHistory);
}

export function* gift(action) {
  try {
    const params = {
      bot_ids: action.botIds,
      gc: action.gc,
    };
    const result = yield call(api.create().gift, params);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchGift() {
  yield takeLatest(PURCHASE_GIFT, gift);
}

export function* fetchPayoutHistory(action) {
  try {
    const { params } = action;
    const result = yield call(api.create().fetchPayoutHistory, params);
    action.onSuccess(result.data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchFetchPayoutHistory() {
  yield takeLatest(FETCH_PAYOUT_HISTORY, fetchPayoutHistory);
}

export default function* Deposit() {
  yield fork(watchFetchListBots);
  yield fork(watchGetPriceUSD);
  yield fork(watchGetPriceBTC);
  yield fork(watchRequestPaying);
  yield fork(watchGetDepositHistory);
  yield fork(watchGetGiftHistory);
  yield fork(watchFetchPayoutHistory);
  yield fork(watchGift);
}
