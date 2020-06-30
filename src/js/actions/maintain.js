
import {
  CHECK_MAINTAIN, SET_MAINTAIN,
} from '../constants/maintain';

export const fetchMaintainInfo = (onSuccess, onError) => ({
  type: CHECK_MAINTAIN,
  onSuccess,
  onError,
});

export const setMaintainInfo = data => ({
  type: SET_MAINTAIN,
  data,
});
