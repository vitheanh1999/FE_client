import { ENV_NAME } from '../constants/Environment';
import { ENVIRONMENT } from './index';

export const getConfig = (configs, env) => {
  if (env !== undefined && env !== null && env < configs.length) {
    return configs[env];
  }
  return configs[ENV_NAME.DEVELOP];
};

export const getLoginUrlDbac = () => getConfig([
  'https://dev-dashboard.luc888.co/login/dbac',
  'https://stg.auto-dbac.com/login/dbac',
  'https://test.auto-dbac.com/login/dbac',
  'https://ctrl.rc-club.biz',
], ENVIRONMENT);

// export const getLoginUrlCroesus = () => getConfig([
//   'https://dev-dashboard.luc888.co/login/croesus',
//   'https://stg.auto-dbac.com/login/croesus',
//   'https://test.auto-dbac.com/login/croesus',
//   'https://portal.croesus-system.com',
// ], ENVIRONMENT);

// export const getLoginUrlRay9 = () => getConfig([
//   'https://dev-dashboard.luc888.co/login/ray9',
//   'https://stg.auto-dbac.com/login/ray9',
//   'https://test.auto-dbac.com/login/ray9',
//   'https://portal.ray9-sys.com',
// ], ENVIRONMENT);

// export const getLoginUrlKE = () => getConfig([
//   'https://dev-dashboard.luc888.co/login/dbac',
//   'https://stg.auto-dbac.com/login/ray9',
//   'https://test.auto-dbac.com/login/ray9',
//   'https://portal.ke.auto-dbac.com',
// ], ENVIRONMENT);

// export const getLoginUrlSonrisa = () => getConfig([
//   'https://dev-dashboard.luc888.co/login/dbac',
//   'https://stg.auto-dbac.com/login/ray9',
//   'https://test.auto-dbac.com/login/ray9',
//   'https://portal.sonrisa-sys.com',
// ], ENVIRONMENT);

// export const getLoginUrlIcowl = () => getConfig([
//   'https://dev-dashboard.luc888.co/login/dbac',
//   'https://stg.auto-dbac.com/login/ray9',
//   'https://test.auto-dbac.com/login/ray9',
//   'http://portal.icowl-sys.com',
// ], ENVIRONMENT);

// export const getLoginUrlLinclue = () => getConfig([
//   'https://dev-dashboard.luc888.co/login/dbac',
//   'https://stg.auto-dbac.com/login/ray9',
//   'https://test.auto-dbac.com/login/ray9',
//   'https://portal.linclue8.com',
// ], ENVIRONMENT);

// export const getLoginUrlAbs = () => getConfig([
//   'https://dev-dashboard.luc888.co/login/abs',
//   'https://stg.auto-dbac.com/login/ray9',
//   'https://test.auto-dbac.com/login/ray9',
//   'http://portal.abs.auto-dbac.com',
// ], ENVIRONMENT);

// export const getLoginUrlDbm = () => getConfig([
//   'https://dev-dashboard.luc888.co/login/dbm',
//   'https://stg.auto-dbac.com/login/ray9',
//   'https://test-dbm.auto-dbac.com/login/dbm',
//   'http://portal.dbm.auto-dbac.com/',
// ], ENVIRONMENT);

// export const getLoginUrlNatural8 = () => getConfig([
//   'https://dev-dashboard.luc888.co/login/dbm',
//   'https://stg.auto-dbac.com/login/ray9',
//   'https://test-dbm.auto-dbac.com/login/dbm',
//   'https://portal.natural8-sys.com/',
// ], ENVIRONMENT);

// export const getLoginUrlExtra5 = () => getConfig([
//   'https://dev-dashboard.luc888.co/login/dbm',
//   'https://stg.auto-dbac.com/login/ray9',
//   'https://test-dbm.auto-dbac.com/login/dbm',
//   'https://portal.extra5-sys.com/',
// ], ENVIRONMENT);
