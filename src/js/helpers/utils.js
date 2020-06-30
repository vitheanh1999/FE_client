/* global navigator, performance, window */
/* eslint no-console: 0 */
import moment from 'moment';
import dayjs from 'dayjs';
import StorageUtils, { STORAGE_KEYS, TOKEN_KEY_LUC88 } from './StorageUtils';
// import i18n from '../i18n/i18n';

export function isAndroid(userAgent = navigator.userAgent) {
  const android = /Android/;
  return android.test(userAgent);
}

export function isIos(userAgent = navigator.userAgent) {
  const android = /iPhone|iPad/;
  return android.test(userAgent);
}

const perfNow = window.performance && (
  performance.now
  || performance.mozNow
  || performance.msNow
  || performance.oNow
  || performance.webkitNow
);

export function now() {
  return (perfNow && perfNow.call(performance)) || (new Date().getTime());
}

export function appInitMonitor() {
  window.addEventListener('load', () => {
    const { timing } = window.performance;
    const interactive = timing.domInteractive - timing.domLoading;
    const dcl = timing.domContentLoadedEventStart - timing.domLoading;
    const complete = timing.domComplete - timing.domLoading;
    console.log(`interactive ${interactive}ms, dcl ${dcl}ms, complete ${complete}ms`);
  });
}

export const countDecimals = unit => (unit.toString().split('.')[1] || '').length || 0;

export const convertNumberGCShop = (data, fractionalUnit = 1) => {
  const maximumFractionDigits = countDecimals(fractionalUnit);
  const value = parseFloat(data.toFixed(maximumFractionDigits));
  return (data >= fractionalUnit || data === 0) ? value : data; // fractionalUnit;
};

export const getSubExact = (floatX, floatY) => {
  const xLength = countDecimals(floatX);
  const yLength = countDecimals(floatY);
  const maxLength = xLength >= yLength ? xLength : yLength;
  const pow = Math.pow(10, maxLength);
  const result = (floatX * pow - floatY * pow) / pow;
  return result.toFixed(maxLength);
};

export const getBrowserLanguageCode = () => {
  try {
    const userLang = navigator.language || navigator.userLanguage;
    const prefix = userLang.split('-')[0];
    switch (prefix) { // for https://www.blockchain.com
      case 'id':
      case 'ms':
      case 'de':
      case 'en':
      case 'es':
      case 'fr':
      case 'it':
      case 'nl':
      case 'pl':
      case 'pt':
      case 'ru':
      case 'ro':
      case 'sv':
      case 'vi':
      case 'tr':
      case 'cs':
      case 'uk':
      case 'ja':
      case 'ko':
      case 'th':
        return `${prefix}/`;
      default:
      {
        if (userLang.includes('zh-cn')) return 'zh-cn/';
        return '';
      }
    }
  } catch (e) {
    return '';
  }
};

const getDayBetween = (date1, date2) => {
  // Convert both dates to milliseconds
  const date1MS = date1.getTime();
  const date2MS = date2.getTime();

  // Calculate the difference in milliseconds
  let differenceMS = date1MS - date2MS;
  // take out milliseconds
  differenceMS /= 1000;
  const seconds = Math.floor(differenceMS % 60);
  differenceMS /= 60;
  const minutes = Math.floor(differenceMS % 60);
  differenceMS /= 60;
  const hours = Math.floor(differenceMS % 24);
  const days = Math.floor(differenceMS / 24);

  return [days, hours, minutes, seconds];
};

const getTimeBetween = (date1, date2) => {
  const dateParse1 = new Date(date1).getTime();
  const dateParse2 = new Date(date2).getTime();

  return dateParse2 - dateParse1;
};

export const checkEnableSecuritySetting = (authSetApp, authSetMail, authSetPhone) => {
  if (authSetApp === 1 || authSetMail === 1 || authSetPhone === 1) {
    return true;
  }
  return false;
};

export const checkShowAuthStep2 = (authSetApp, authSetMail, authSetPhone) => {
  const isEnableSecuritySet = checkEnableSecuritySetting(authSetApp,
    authSetMail, authSetPhone);
  const rememberMeData = StorageUtils.getItem(STORAGE_KEYS.AUTH_SECURITY_REMEMBER_KEY);
  if (rememberMeData && isEnableSecuritySet) {
    const rememberMeObject = JSON.parse(rememberMeData);
    const userId = rememberMeObject ? rememberMeObject.userId : -1;
    if (userId === parseInt(StorageUtils.getSectionStorageItem(STORAGE_KEYS.USER_ID_KEY), 10)) {
      const [days] = getDayBetween(new Date(), new Date(rememberMeObject.time));
      if (days < 30) return false;
    }
    return true;
  }
  return isEnableSecuritySet;
};

export const getCurrentBaseUrl = () => {
  let baseUrl = `${window.location.protocol}//${window.location.hostname}/`;
  if (window.location.port !== '') {
    baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/`;
  }
  return baseUrl;
};

export const convertPatternCampaign = (listPatterns, pattern, fieldName) => {
  const patternOption = [];
  listPatterns.forEach((element) => {
    if (
      element.status_fe
      || (pattern[fieldName] === element[fieldName])
    ) {
      patternOption.push({
        id: element.id,
        value: element.id,
        text: element[fieldName],
        description: element.description,
      });
    }
  });
  return patternOption;
};

export const convertCampaignOption = (data, maxWidth) => {
  const campaignOption = [];
  let maxLength = maxWidth || 198;
  const elementDocument = document.createElement('canvas');
  const context = elementDocument.getContext('2d');
  context.font = '18px Arial';
  data.forEach((element) => {
    const text = context.measureText(element.name);
    if (text.width > maxLength) {
      maxLength = text.width;
    }
    campaignOption.push({
      id: element._id,
      text: element.name,
      value: element._id,
    });
  });

  return { campaignOption, maxLength: maxLength / 18 + 1 };
};


export const convertTableOption = (data) => {
  const dataOption = [];
  data.forEach((element) => {
    let color = element.status ? '#186f00' : '#adb5bd';
    let isError = false;
    let isFull = false;
    if (element.is_full) {
      isError = true;
      color = '#d00000';
      isFull = true;
    }
    dataOption.push({
      id: element.id,
      text: element.name,
      value: element.id,
      color,
      isError,
      isFull,
    });
  });

  return { dataOption };
};

export const handleAfterLogin = (data, email) => {
  // const languageCode = data && data.lang_setting ? data.lang_setting : 'en';
  StorageUtils.setToken(data.access_token);
  if (data.luc_access_token) {
    StorageUtils.setSectionStorageItem(TOKEN_KEY_LUC88, data.luc_access_token);
  }
  if (email) {
    StorageUtils.setSectionStorageItem(STORAGE_KEYS.userName, email);
    StorageUtils.setItem(STORAGE_KEYS.currentEmail, email);
  }
  if (data.auth_setting) {
    StorageUtils.setSectionStorageItem(STORAGE_KEYS.USER_ID_KEY, data.auth_setting.id);
  }

  StorageUtils.setSectionStorageItem(STORAGE_KEYS.userRole, data.role);
  // i18n.changeLanguage(languageCode);
  return null;
};

export const getLanguageCurrent = () => {
  const language = StorageUtils.getItem('i18nextLng');
  switch (language) {
    case 'ja':
      return 'ja';
    case 'en':
      return 'en';
    case 'kr':
      return 'kr';
    case 'cn':
      return 'cn';
    case 'en-US':
      return 'en';
    default:
      return 'en';
  }
};

export function convertToLocalDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const d = new Date();
  const timezoneOffset = d.getTimezoneOffset() * (-1);
  if (!date) {
    return '';
  }

  return dayjs(date).add(timezoneOffset, 'm').format(format);
}

export const convertLocalTimeToUTC = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) {
    return '';
  }
  return moment(date).utc().format(format);
};

export const convertTime = (time, format = 'YYYY/MM/DD') => {
  const date = new Date();
  const delta = date.getTimezoneOffset() * (-1);
  return time ? dayjs(time).add(delta, 'm').format(format) : '';
};

export const convertNumber = (value) => {
  let number = value === '00' ? '0' : value;
  if (number !== '' && number % 1 !== 0) {
    number = value * 100;
    number = parseInt(number, 10);
    return number / 100;
  }
  return number;
};

export const convertBotRemainTime = (seconds, format = 'mm:ss') => {
  const time = moment.utc(seconds * 1000).format(format);
  return time;
};
