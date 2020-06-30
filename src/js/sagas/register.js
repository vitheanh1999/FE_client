import { call, fork, takeLatest } from 'redux-saga/effects';
import api from '../services/api';
import { REGISTER } from '../constants/register';

export function* register(action) {
  const {
    email,
    password,
    confirmPassword,
  } = action;
  try {
    const params = {
      email,
      password,
      password_confirmation: confirmPassword,
      affiliate_code: 'FE',
    };
    const result = yield call(api.create().register, params);
    const { data } = result;
    action.onSuccess(data);
  } catch (err) {
    action.onError(err);
  }
}

export function* watchRegister() {
  yield takeLatest(REGISTER, register);
}

export default function* registerSaga() {
  yield fork(watchRegister);
}
