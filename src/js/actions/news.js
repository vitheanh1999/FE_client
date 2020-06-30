import {
  FETCH_LIST_NEWS,
  FETCH_LIST_NEWS_NOT_LOGIN,
  FETCH_NEW_DETAIL,
  FETCH_NEW_DETAIL_NOT_LOGIN,
  SET_LIST_NEWS,
  SET_NEW_DETAIL,
  READ_NEW,
  READ_NEW_NOT_LOGIN,
  SET_LIST_NEWS_TOP,
} from '../constants/news';

export const fetchListNews = (params, onSuccess, onError) => ({
  type: FETCH_LIST_NEWS,
  onSuccess,
  onError,
  params,
});

export const fetchListNewsNotLogin = (params, onSuccess, onError) => ({
  type: FETCH_LIST_NEWS_NOT_LOGIN,
  onSuccess,
  onError,
  params,
});

export const fetchNewDetail = (params, onSuccess, onError) => ({
  type: FETCH_NEW_DETAIL,
  onSuccess,
  onError,
  params,
});

export const fetchNewDetailNotLogin = (params, onSuccess, onError) => ({
  type: FETCH_NEW_DETAIL_NOT_LOGIN,
  onSuccess,
  onError,
  params,
});

export const setListNews = data => ({
  type: SET_LIST_NEWS,
  data,
});

export const setNewDetail = data => ({
  type: SET_NEW_DETAIL,
  data,
});

export const setListNewsTop = data => ({
  type: SET_LIST_NEWS_TOP,
  data,
});

export const updateHasReadNew = (newId, startPlan) => ({
  type: READ_NEW,
  newId,
  startPlan,
});

export const updateHasReadNewTop = (newId, startPlan) => ({
  type: READ_NEW_NOT_LOGIN,
  newId,
  startPlan,
});
