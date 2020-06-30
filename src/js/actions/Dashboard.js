import { GET_BOT_TOTAL_GC_HISTORY, SET_BOT_TOTAL_GC_HISTORY } from '../constants/Dashboard';

export const getBotTotalGcHistory = (botId, startDate, endDate, onSuccess, onError) => ({
  type: GET_BOT_TOTAL_GC_HISTORY,
  botId,
  startDate,
  endDate,
  onSuccess,
  onError,
});

export const setBotTotalGcHistory = data => ({
  type: SET_BOT_TOTAL_GC_HISTORY,
  data,
});
