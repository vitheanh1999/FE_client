import { FETCH_LIST_TABLE, SELECT_TABLE, SET_LIST_TABLE } from '../constants/table';

export const fetchListTable = (onSuccess, onError, params) => ({
  type: FETCH_LIST_TABLE,
  onSuccess,
  onError,
  params,
});

export const selectTable = (onSuccess, onError, params) => ({
  type: SELECT_TABLE,
  params,
  onSuccess,
  onError,
});

export const setListTable = data => ({
  type: SET_LIST_TABLE,
  data,
});
