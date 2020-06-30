import {
  FETCH_LIST_BOTS,
  SET_LIST_BOTS,
  LIST_BOTS_UPDATE_BOT_STATUS,
  FETCH_BOT_HISTORY,
  SET_BOT_HISTORY,
  FETCH_CHART_DATA,
  SET_CHART_DATA,
  FETCH_BOT_DETAIL,
  SET_BOT_DETAIL,
  FETCH_BOT_HISTORY_NOW,
  FETCH_HISTORY_TABLE,
  PAYOUT,
  FETCH_BOT_GC_NOW,
  FETCH_TABLE_STATUS_NOW,
  FETCH_MIN_PROFIT_VALUE,
  UPDATE_TABLE_NAME,
  CREATE_BOTS,
  FETCH_PAY_OFF_HISTORY,
  SET_PAY_OF_HISTORY,
  FETCH_DATA_CHARTS,
  SET_DATA_CHARTS,
  UPDATE_BOT_NAME,
  UPDATE_BOT_CAMPAIGN,
  DELETE_BOT,
} from '../constants/ListBots';

export const fetchMinProfitValue = (onSuccess, onError) => ({
  type: FETCH_MIN_PROFIT_VALUE,
  onSuccess,
  onError,
});

export const fetchListBots = (onSuccess, onError, params) => ({
  type: FETCH_LIST_BOTS,
  onSuccess,
  onError,
  params,
});

export const setListBots = data => ({
  type: SET_LIST_BOTS,
  data,
});

export const updateBotStatus = (botId, status, isResetLogic, onSuccess, onError) => ({
  type: LIST_BOTS_UPDATE_BOT_STATUS,
  botId,
  status,
  isResetLogic,
  onSuccess,
  onError,
});

export const updateBotName = (botId, name, onSuccess, onError) => ({
  type: UPDATE_BOT_NAME,
  botId,
  name,
  onSuccess,
  onError,
});

export const updateBotCampaign = (botId, idCampaign, onSuccess, onError) => ({
  type: UPDATE_BOT_CAMPAIGN,
  botId,
  idCampaign,
  onSuccess,
  onError,
});

export const fetchBotHistory = (params, onSuccess, onError) => ({
  type: FETCH_BOT_HISTORY,
  params,
  onSuccess,
  onError,
});

export const setBotHistory = data => ({
  type: SET_BOT_HISTORY,
  data,
});

export const fetchChartData = (botId, startDate, endDate, onSuccess, onError) => ({
  type: FETCH_CHART_DATA,
  botId,
  startDate,
  endDate,
  onSuccess,
  onError,
});

export const setChartData = data => ({
  type: SET_CHART_DATA,
  data,
});

export const fetchDataCharts = (botIds, startDate, endDate, onSuccess, onError) => ({
  type: FETCH_DATA_CHARTS,
  botIds,
  startDate,
  endDate,
  onSuccess,
  onError,
});

export const setDataCharts = data => ({
  type: SET_DATA_CHARTS,
  data,
});

export const fetchBotDetail = (botId, onSuccess, onError) => ({
  type: FETCH_BOT_DETAIL,
  botId,
  onSuccess,
  onError,
});

export const setBotDetail = data => ({
  type: SET_BOT_DETAIL,
  data,
});

export const fetchBotHistoryNow = (botId, currentPage, perPage, onSuccess, onError) => ({
  type: FETCH_BOT_HISTORY_NOW,
  botId,
  currentPage,
  perPage,
  onSuccess,
  onError,
});

export const fetchHistoryTable = (tableName, onSuccess, onError) => ({
  type: FETCH_HISTORY_TABLE,
  tableName,
  onSuccess,
  onError,
});

export const payout = (params, onSuccess, onError) => ({
  type: PAYOUT,
  params,
  onSuccess,
  onError,
});

export const fetchBotGCNow = (botId, onSuccess, onError) => ({
  type: FETCH_BOT_GC_NOW,
  botId,
  onSuccess,
  onError,
});

export const fetchTableStatusNow = (botId, onSuccess, onError) => ({
  type: FETCH_TABLE_STATUS_NOW,
  botId,
  onSuccess,
  onError,
});

export const updateNameTable = listGroupBotChangeTable => ({
  type: UPDATE_TABLE_NAME,
  listGroupBotChangeTable,
});

export const createBots = (onSuccess, onError, params) => ({
  type: CREATE_BOTS,
  onSuccess,
  onError,
  params,
});

export const deleteBot = (params, onSuccess, onError) => ({
  type: DELETE_BOT,
  onSuccess,
  onError,
  params,
});

export const fetchPayOffHistory = (params, onSuccess, onError) => ({
  type: FETCH_PAY_OFF_HISTORY,
  params,
  onSuccess,
  onError,
});

export const setPayOffHistory = data => ({
  type: SET_PAY_OF_HISTORY,
  data,
});
