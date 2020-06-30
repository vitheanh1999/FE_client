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
