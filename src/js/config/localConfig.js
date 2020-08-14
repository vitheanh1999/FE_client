import { ENVIRONMENT } from './index';
import { getConfig } from './oemConfig';

export const API_LUC888 = getConfig([
  'https://dev.luc888.co/',
  'https://test.luc888.co/',
  'https://stg.luc888.co/',
  'https://luc888.co/',
], ENVIRONMENT);

export const ENABLE_NEWS = true;
export const ENABLE_DELETE_BOT = true;

export const ENABLE_MAINTAIN_STATIC = false;
export const MAINTAIN_STATIC_COTENT = 'Test MaintainStatic';
export const MAINTAIN_STATIC_ENDTIME = '21h00 UTC';

export const foo = '';

const currentEnv = process.env.REACT_APP_ENV || ENVIRONMENT;
const WEB_SOCKET_VIVO_GAMING = {
  0: 'wss://dev-rtsp-bs.luc888.co/',
  1: 'wss://stg-vivo-bs.luc888.co/',
  2: 'wss://stg-vivo-bs.luc888.co/',
  3: 'wss://vivo-bs.luc888.co/',
};
export const WEB_SOCKET_URL_VIVO_GAMING = WEB_SOCKET_VIVO_GAMING[currentEnv];


const WEB_SOCKET = {
  0: 'wss://dev2-bs.luc888.co:8080/',
  1: 'wss://test-bs.luc888.co/',
  2: 'wss://stg2-bs.luc888.co/',
  3: 'wss://bs.luc888.co/',
};
export const WEB_SOCKET_URL = WEB_SOCKET[currentEnv];
