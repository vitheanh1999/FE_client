// import { PRODUCT_MODE } from '../constants/ProductType';
import { ENV_NAME } from '../constants/Environment';
import { getConfig } from './oemConfig';

// let PRODUCT_TYPE = PRODUCT_MODE.OEM_CROESUS;
// export const getProductType = () => PRODUCT_TYPE;
// export const setProductType = (value) => { PRODUCT_TYPE = value; };

export const ENVIRONMENT = ENV_NAME.DEVELOP;

export const API = getConfig([
  'https://dev-api.fifties-hacker.com/api/',
  'https://test-api.fifties-hacker.com/api/',
  'https://stg-api.fifties-hacker.com/api/',
  'https://api.fifties-hacker.com/api/',
], ENVIRONMENT);

let linkBuyBurst = 'https://bgt.vireca.org/';
export const setLinkBuyBurst = (value) => { linkBuyBurst = value; };
export const getLinkBuyBurst = () => linkBuyBurst;

export const COPYRIGHT = '© 2019 luc888.co';

export const KEY_PUSHER = 'f229d8505595a3e3206a';
const option = {
  app_id: '948907',
  secret: 'b4e5dd0dda7904e2b908',
  cluster: 'ap1',
};
export const OPTION_PUSHER = option;

export const KEY_PUSHER_DASHBOARD = 'f229d8505595a3e3206a';
const optionPusherDashboard = {
  app_id: '948907',
  secret: 'b4e5dd0dda7904e2b908',
  cluster: 'ap1',
};
export const OPTION_PUSHER_DASHBOARD = optionPusherDashboard;

// export const WEB_SOCKET_URL = 'wss://dev2-bs.luc888.co:8080/';
export const KEY_JWT = 'FtMcx2FSQKscjbcBHaT4';
export const ENABLE_CHANGE_LANGUAGE = true;
export const SENTRY_DSN = 'https://7b7cc6545e6e46c3ae630e07ef4f7af3@sentry.io/1773889';
export const ENABLE_LOGIN = true;

const env = {
  dev: 'dev', test: 'test', stg: 'stg', production: 'production', local: 'local',
};
const currentEnv = process.env.REACT_APP_ENV || env.dev;
const WEB_SOCKET_VIVO_GAMING = {
  local: 'wss://dev-rtsp-bs.luc888.co/',
  dev: 'wss://dev-rtsp-bs.luc888.co/',
  test: 'wss://stg-vivo-bs.luc888.co/',
  stg: 'wss://stg-vivo-bs.luc888.co/',
  production: 'wss://vivo-bs.luc888.co/',
};
export const WEB_SOCKET_URL_VIVO_GAMING = WEB_SOCKET_VIVO_GAMING[currentEnv];


const WEB_SOCKET = {
  local: 'wss://dev2-bs.luc888.co:8080/',
  dev: 'wss://dev2-bs.luc888.co:8080/',
  test: 'wss://test-bs.luc888.co/',
  stg: 'wss://stg2-bs.luc888.co/',
  production: 'wss://bs.luc888.co/',
};
export const WEB_SOCKET_URL = WEB_SOCKET[currentEnv];