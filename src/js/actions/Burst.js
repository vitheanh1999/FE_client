import {
  SET_BURST_STATUS,
  FETCH_BURST_STATUS,
} from '../constants/Burst';

export const fetchBurstStatus = (onSuccess, onError) => ({
  type: FETCH_BURST_STATUS,
  onSuccess,
  onError,
});

export const setBurstStatus = burstStatus => ({
  type: SET_BURST_STATUS,
  burstStatus,
});
