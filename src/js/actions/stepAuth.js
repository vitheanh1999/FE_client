import * as actions from '../constants/stepAuth';

export const sendCode = (actionCode, method, email, phone, onSuccess, onError) => ({
  type: actions.STEP_AUTH_SEND_CODE,
  actionCode,
  method,
  email,
  phone,
  onSuccess,
  onError,
});

export const submitCode = (actionCode, method, code, onSuccess, onError) => ({
  type: actions.STEP_AUTH_SUBMIT_CODE,
  actionCode,
  method,
  code,
  onSuccess,
  onError,
});
