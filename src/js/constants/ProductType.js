import { images } from '../theme';
import { ENV_NAME } from './Environment';
import { ENVIRONMENT } from '../config/index';


const getConfig = (configs, env) => {
  if (env !== undefined && env !== null && env < configs.length) {
    return configs[env];
  }
  return configs[ENV_NAME.DEVELOP];
};

export const getLoginUrl = () => getConfig([
  'https://dev-dashboard.luc888.co/login/dbac',
  'https://stg.auto-dbac.com/login/dbac',
  'https://test.auto-dbac.com/login/dbac',
  'https://ctrl.rc-club.biz',
], ENVIRONMENT);

export const PRODUCT_MODE = {
  DBAC: {
    value: 1,
    getLoginUrl,
    name: 'AUTO D-BAC',
    logoMaintain: images.logoMenu,
  },
};

export const foo = 1;
