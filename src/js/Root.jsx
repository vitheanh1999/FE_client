import React from 'react';
import {
  BrowserRouter, Switch,
  Route, Redirect,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import styled from 'styled-components';
import configureStore from './store/configureStore';
import Authenticate from './components/authenicate/Authenticate';
import NotFound from './containers/notFound/NotFound';
import PrivateRoute from './PrivateRoute';
import Maintain from './containers/maintain/Maintain';
import MaintainStatic from './containers/maintain/MaintainStatic';
import LoginMaintain from './containers/login/LoginMaintain';
import { ENABLE_LOGIN } from './config';
import Terms from './components/termsAndPolicy/Terms';
import Policy from './components/termsAndPolicy/Policy';
import Register from './containers/auth/Register';
import DashBoard from './containers/mainScreen/MainScreen';
import Guide from './containers/guide/Guide';
import { ENABLE_MAINTAIN_STATIC } from './config/localConfig';
import ShowDebugLogs from './containers/debugLogs/ShowDebugLogs';

const AppRoot = styled.div`
  height: 100vh;
  font-family:
    sans-serif,
    "SF Pro JP",
    "SF Pro Display",
    "SF Pro Icons",
    "Hiragino Kaku Gothic Pro",
    "ヒラギノ角ゴ Pro W3",
    "メイリオ",
    "Meiryo",
    "ＭＳ Ｐゴシック",
    "Helvetica Neue",
    "Helvetica",
    "Arial";
`;

const store = configureStore();


const RootMaintainStatic = () => (
  <Provider store={store} key={Math.random()}>
    <BrowserRouter>
      <AppRoot id="root">
        <Switch>
          <Route component={MaintainStatic} />
        </Switch>
      </AppRoot>
    </BrowserRouter>
  </Provider>
);

const Root = () => {
  if (ENABLE_MAINTAIN_STATIC) return RootMaintainStatic();
  return (
    <Provider store={store} key={Math.random()}>
      <BrowserRouter>
        <AppRoot id="root">
          <Switch>
            <Route path="/authenticate" component={Authenticate} />
            <PrivateRoute exact path="/" component={DashBoard} />
            <Route exact path="/not-found" component={NotFound} />
            <Route exact path="/guide/:tab" component={Guide} />
            <Route exact path="/guide" component={Guide} />
            {ENABLE_LOGIN && <Route exact path="/login" render={() => <Redirect to="/" />} />}
            {ENABLE_LOGIN && <Route exact path="/login-maintain/:id" component={LoginMaintain} />}
            <Route exact path="/terms" component={Terms} />
            <Route exact path="/privacy" component={Policy} />
            <Route exact path="/maintain" component={Maintain} />
            <Route exact path="/maintain-static" component={MaintainStatic} />
            <Route exact path="/register" component={Register} />
            <Route
              exact
              path="/top"
              render={props => (<Redirect to={{ ...props, pathname: '/' }} />)}
            />
            <Route component={NotFound} />
          </Switch>
          <ShowDebugLogs />
        </AppRoot>
      </BrowserRouter>
    </Provider>
  );
};

export default Root;
