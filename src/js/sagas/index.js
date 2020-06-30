import { fork } from 'redux-saga/effects';
import DashBoard from './Dashboard';
import auth from './auth';
import Deposit from './Deposit';
import listBots from './listBots';
import loginSaga from './login/login';
import maintainSaga from './maintain';
import registerSaga from './register';
import stepAuth from './stepAuth';
import campaign from './campaign';
import news from './news';
import table from './table';

export default function* root() {
  yield fork(DashBoard);
  yield fork(auth);
  yield fork(Deposit);
  yield fork(listBots);
  yield fork(loginSaga);
  yield fork(maintainSaga);
  yield fork(registerSaga);
  yield fork(stepAuth);
  yield fork(campaign);
  yield fork(news);
  yield fork(table);
}
