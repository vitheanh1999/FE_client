import Pusher from 'pusher-js';
import dayjs from 'dayjs';
import {
  call,
} from 'redux-saga/effects';
import {
  KEY_PUSHER, OPTION_PUSHER,
  KEY_PUSHER_DASHBOARD, OPTION_PUSHER_DASHBOARD,
} from '../../config';
import api from '../../services/api';
// TO DO
// const KEY_PUSHER = 'd5780220254544c2aab3'; //product luc1
// const OPTION_PUSHER = {
//   app_id: '678357',
//   secret: 'e4c934d0d52350a09a68',
//   cluster: 'ap1',
// };

const socket = new Pusher(KEY_PUSHER, OPTION_PUSHER);
const socketDashboard = new Pusher(KEY_PUSHER_DASHBOARD, OPTION_PUSHER_DASHBOARD);

export const countDecimals = unit => (unit.toString().split('.')[1] || '').length || 0;

export const convertNumberGCShop = (data, fractionalUnit = 1) => {
  if (typeof (data) !== 'number') return data;
  const maximumFractionDigits = countDecimals(fractionalUnit);
  const value = parseFloat(data.toFixed(maximumFractionDigits));
  return (data >= fractionalUnit || data === 0) ? value : data; // fractionalUnit;
};

export const convertNumber = (data, maximumFractionDigits = 2) => (
  parseFloat(data.toFixed(maximumFractionDigits)).toLocaleString('ja')
);

export const browser = () => {
  const { navigator } = window;
  const ua = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
  const msie = navigator.userAgent.match(/Edge/i) || navigator.userAgent.match(/Trident.*rv[ :]*11\./i);
  return msie ? 'msie' : (ua && ua[1].toLowerCase());
};

export const browserInfo = () => {
  const { navigator } = window;
  const ua = navigator.userAgent.match(/(chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
  const opera = navigator.userAgent.match(/OPR\/?\s*(\.?\d+(\.\d+)*)/i);
  const chromeInIOS = navigator.userAgent.match(/CriOS\/?\s*(\.?\d+(\.\d+)*)/i);
  const msie = navigator.userAgent.match(/Edge\/?\s*(\.?\d+(\.\d+)*)/i) || navigator.userAgent.match(/Trident.*rv[ :]*11\./i);
  const appBrowser = navigator.userAgent || navigator.vendor || window.opera;
  if (appBrowser.includes('FBAN') || appBrowser.includes('FBAV')) {
    return 'Facebook';
  }
  if (appBrowser.includes('Instagram')) {
    return 'Instagram';
  }
  return (
    (chromeInIOS && chromeInIOS[0].replace('CriOS', 'Chrome'))
    || (opera && opera[0].replace('OPR', 'Opera'))
    || (ua && ua[0])
    || (msie && msie[0])
  );
};

export const socketConnection = socket;
export const socketConnectionDashboard = socketDashboard;

export const convertTime = (time, format = 'YYYY/MM/DD') => {
  const date = new Date();
  const delta = date.getTimezoneOffset() * (-1);
  return time ? dayjs(time).add(delta, 'm').format(format) : '';
};

export const convertNumberBetRange = (data, maximumFractionDigits = 2) => {
  const number = data.toFixed(maximumFractionDigits) / 1000;
  return `${parseFloat(number).toLocaleString('ja')}K`;
};

export default class Utils {
  static getResetPwParams(url) {
    const result = {};
    const params = (url.split('?')[1] || '').split('&');
    const { length } = params;
    const token = length > 1 ? params[0].split('=')[1] : '';
    const email = length > 1 ? params[1].split('=')[1] : '';
    result.token = token;
    result.email = email;
    return result;
  }

  static getVerifyRegistrationToken(url) {
    const params = url.split('?')[1] || [];
    const { length } = params;
    if (length > 0) return params.split('=')[1];
    return '';
  }

  static getErrorMessage(errors) {
    let errorMessage = '';
    Object.keys(errors).forEach((key) => {
      errorMessage += `${errors[key]} `;
    });
    if (errorMessage === '') { return 'Unknown error'; }
    return errorMessage;
  }

  static findSelectedOption(code) {
    return 'en';
  }

  static formatNumber(number) {
    return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
  }

  static formatUserName(userName) {
    let result = userName ? userName.substring(0, 12) : '';
    result = userName && userName.length > 12 ? `${result}...` : result;
    return result;
  }

  static getCurrentBaseUrl() {
    let baseUrl = `${window.location.protocol}//${window.location.hostname}/`;
    if (window.location.port !== '') {
      baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/`;
    }
    return baseUrl;
  }

  static getPositiveNumber(e) {
    const charEnable = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const value = e.target.value ? e.target.value.trim() : '';
    let result = '';
    for (let i = 0; i < value.length; i += 1) {
      if (charEnable.includes(value[i])) {
        result = `${result}${value[i]}`;
      }
    }
    return result;
  }

  static getDayBetween(date1, date2) {
    const date1MS = date1.getTime();
    const date2MS = date2.getTime();

    let differenceMS = date1MS - date2MS;
    differenceMS /= 1000;
    const seconds = Math.floor(differenceMS % 60);
    differenceMS /= 60;
    const minutes = Math.floor(differenceMS % 60);
    differenceMS /= 60;
    const hours = Math.floor(differenceMS % 24);
    const days = Math.floor(differenceMS / 24);

    return [days, hours, minutes, seconds];
  }

  static isEnableSecuritySetting(authSetApp, authSetMail, authSetPhone) {
    if (authSetApp === 1 || authSetMail === 1 || authSetPhone === 1) {
      return true;
    }
    return false;
  }

  // source http://stackoverflow.com/a/3109234
  static bankersRounding(num, decimalPlaces) {
    const d = decimalPlaces || 0;
    const m = 10 ** d;
    const n = +(d ? num * m : num).toFixed(8); // Avoid rounding errors
    const i = Math.floor(n);
    const f = n - i;
    const e = 1e-8; // Allow for rounding errors in f
    let r = (i % 2 === 0) ? i : i + 1;
    r = (f > 0.5 - e && f < 0.5 + e) ? r : Math.round(n);

    return d ? r / m : r;
  }

  static setRegisterInfo(data) {
    Utils.registerData = data;
    return data;
  }

  static getRegisterInfo() {
    return Utils.registerData || null;
  }

  static showPopupConfirm(alert, action, title, message) {
    if (alert && action) {
      alert.show(title, message, action, true, 'cancel');
    }
  }

  static showPopupTimeCount(alert, action, title, message, time, okMessage) {
    if (alert && action) {
      alert.showTimeout(title, message, action, true, 'cancel', null, time, okMessage);
    }
  }
}
