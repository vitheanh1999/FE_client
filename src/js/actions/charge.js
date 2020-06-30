import { UPDATE_CHARGE_GC } from '../constants/Charge';

export const updateChargeGc = (onSuccess, onError, param) => ({
  type: UPDATE_CHARGE_GC,
  onSuccess,
  onError,
  param,
});

export const foo = () => { };
