import {
  FETCH_LIST_CAMPAIGNS,
  SET_LIST_CAMPAIGNS,
  SET_LIST_LOGIC_PATTERN,
  SET_LIST_BET_PATTERN,
  CREATE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  DELETE_CAMPAIGN,
  FETCH_LIST_LOGIC_PATTERN,
  FETCH_LIST_BET_PATTERN,
} from '../constants/campaign';

export const fetchListCampaigns = (onSuccess, onError, params) => ({
  type: FETCH_LIST_CAMPAIGNS,
  onSuccess,
  onError,
  params,
});

export const fetchListLogicPattern = (onSuccess, onError) => ({
  type: FETCH_LIST_LOGIC_PATTERN,
  onSuccess,
  onError,
});

export const fetchListBetPattern = (onSuccess, onError) => ({
  type: FETCH_LIST_BET_PATTERN,
  onSuccess,
  onError,
});

export const setListLogicPattern = data => ({
  type: SET_LIST_LOGIC_PATTERN,
  data,
});

export const setListBetPattern = data => ({
  type: SET_LIST_BET_PATTERN,
  data,
});

export const setListCampaigns = data => ({
  type: SET_LIST_CAMPAIGNS,
  data,
});

export const createCampaign = (params, onSuccess, onError) => ({
  type: CREATE_CAMPAIGN,
  params,
  onSuccess,
  onError,
});

export const updateCampaign = (params, onSuccess, onError) => ({
  type: UPDATE_CAMPAIGN,
  params,
  onSuccess,
  onError,
});

export const deleteCampaign = (params, onSuccess, onError) => ({
  type: DELETE_CAMPAIGN,
  params,
  onSuccess,
  onError,
});
