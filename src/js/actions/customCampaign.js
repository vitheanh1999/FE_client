import {
  FETCH_LIST_LOGIC_PATTERN_CUSTOM,
  SET_LIST_LOGIC_PATTERN_CUSTOM,
  FETCH_LIST_BET_PATTERN_CUSTOM,
  SET_LIST_BET_PATTERN_CUSTOM,
  CREATE_OR_UPDATE_LOGIC_PATTERN,
  DELETE_LOGIC_PATTERN_CUSTOM,
  CREATE_OR_UPDATE_BET_PATTERN,
  DELETE_BET_PATTERN,
  GET_DETAIL_BET_PATTERN,
  GET_DETAIL_LOGIC_PATTERN_CUSTOM,
  GET_SETTING_WORKER,
} from '../constants/customCampaign';

export const fetchListLogicSetting = (onSuccess, onError, params) => ({
  type: FETCH_LIST_LOGIC_PATTERN_CUSTOM,
  onSuccess,
  onError,
  params,
});

export const setListLogicSetting = data => ({
  type: SET_LIST_LOGIC_PATTERN_CUSTOM,
  data,
});

export const fetchListBetPatternCustom = (onSuccess, onError, params) => ({
  type: FETCH_LIST_BET_PATTERN_CUSTOM,
  onSuccess,
  onError,
  params,
});

export const setListBetPatternCustom = data => ({
  type: SET_LIST_BET_PATTERN_CUSTOM,
  data,
});

export const createOrUpdateLoginPattern = (params, onSuccess, onError) => ({
  type: CREATE_OR_UPDATE_LOGIC_PATTERN,
  params,
  onSuccess,
  onError,
});

export const deleteLogicSetting = (params, onSuccess, onError) => ({
  type: DELETE_LOGIC_PATTERN_CUSTOM,
  params,
  onSuccess,
  onError,
});

export const createOrUpdateBetPattern = (params, onSuccess, onError) => ({
  type: CREATE_OR_UPDATE_BET_PATTERN,
  params,
  onSuccess,
  onError,
});

export const deleteBetPattern = (params, onSuccess, onError) => ({
  type: DELETE_BET_PATTERN,
  params,
  onSuccess,
  onError,
});

export const getDetailLogicPattern = (id, onSuccess, onError) => ({
  type: GET_DETAIL_LOGIC_PATTERN_CUSTOM,
  id,
  onSuccess,
  onError,
});

export const getDetailBetPattern = (id, onSuccess, onError) => ({
  type: GET_DETAIL_BET_PATTERN,
  id,
  onSuccess,
  onError,
});

export const getSettingWorker = (currentTab, onSuccess, onError) => ({
  type: GET_SETTING_WORKER,
  currentTab,
  onSuccess,
  onError,
});
