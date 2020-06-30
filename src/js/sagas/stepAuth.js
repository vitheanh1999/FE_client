import {
  call, fork, takeLatest,
} from 'redux-saga/effects';
import api from '../services/api';
import * as actions from '../constants/stepAuth';
import { handleAfterLogin } from '../helpers/utils';

export function* sendCode(action) {
  try {
    const {
      actionCode,
      method,
      email,
      phone,
    } = action;
    const params = {
      action_code: actionCode,
      method,
      email,
      phone,
    };
    const result = yield call(api.create().sendAuthCode, params);
    const { data } = result;
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchAuthSendCode() {
  yield takeLatest(actions.STEP_AUTH_SEND_CODE, sendCode);
}

export function* submitCode(action) {
  try {
    const {
      actionCode,
      method,
      code,
    } = action;
    const params = {
      action_code: actionCode,
      method,
      code,
    };
    const result = yield call(api.create().submitAuthCode, params);
    const { data } = result;
    handleAfterLogin(data);
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchAuthSubmitCode() {
  yield takeLatest(actions.STEP_AUTH_SUBMIT_CODE, submitCode);
}

export default function* stepAuth() {
  yield fork(watchAuthSendCode);
  yield fork(watchAuthSubmitCode);
}
