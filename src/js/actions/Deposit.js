import {
  DEPOSIT_FETCH_LIST_BOTS,
  SET_LIST_BOTS,
  SELECT_ALL_BOTS_ENABLE_DEPOSIT,
  FETCH_PAYMENT_INFO,
  SET_PAYMENT_INFO,
  DEPOSIT_GET_PRICE_USD,
  DEPOSIT_GET_PRICE_BTC,
  DEPOSIT_REQUEST_PAYING,
  DEPOSIT_GET_HISTORY,
  GIFT_GET_HISTORY,
  PURCHASE_GIFT,
  FETCH_PAYOUT_HISTORY,
} from '../constants/Deposit';

export const fetchListBots = (onSuccess, onError) => ({
  type: DEPOSIT_FETCH_LIST_BOTS,
  onSuccess,
  onError,
});

export const setListBots = data => ({
  type: SET_LIST_BOTS,
  data,
});

export const selectAllBotsEnableDeposit = () => ({
  type: SELECT_ALL_BOTS_ENABLE_DEPOSIT,
});

/**
 * @param amount: number
 * @param totalGC: number
 * @param detail: {curreny: string, price: number, method: number}
 */
export const fetchPaymentInfo = (amount, totalGC, detail, onSuccess, onError) => ({
  type: FETCH_PAYMENT_INFO,
  amount,
  totalGC,
  detail,
  onSuccess,
  onError,
});

export const setPaymentInfo = data => ({
  type: SET_PAYMENT_INFO,
  data,
});

export const getPriceUSD = (botIds, onSuccess, onError) => ({
  type: DEPOSIT_GET_PRICE_USD,
  botIds,
  onSuccess,
  onError,
});

export const getPriceBTC = (symbol, amount, botIds, onSuccess, onError) => ({
  type: DEPOSIT_GET_PRICE_BTC,
  symbol,
  amount,
  botIds,
  onSuccess,
  onError,
});

export const requestPaying = (amount, detail, onSuccess, onError) => ({
  type: DEPOSIT_REQUEST_PAYING,
  amount,
  detail,
  onSuccess,
  onError,
});

export const getDepositHistory = (perPage, currentPage, onSuccess, onError) => ({
  type: DEPOSIT_GET_HISTORY,
  perPage,
  currentPage,
  onSuccess,
  onError,
});

export const getGiftHistory = (perPage, currentPage, onSuccess, onError) => ({
  type: GIFT_GET_HISTORY,
  perPage,
  currentPage,
  onSuccess,
  onError,
});

export const fetchPayoutHistory = (params, onSuccess, onError) => ({
  type: FETCH_PAYOUT_HISTORY,
  params,
  onSuccess,
  onError,
});

export const gift = (botIds, gc, onSuccess, onError) => ({
  type: PURCHASE_GIFT,
  botIds,
  gc,
  onSuccess,
  onError,
});
