import { CompanyInfo } from '../constants/login';
import CustomCrypto from './CustomCrypto';

const TOKEN_KEY = 'TOKEN_KEY';
export const TOKEN_KEY_LUC88 = 'TOKEN_KEY_LUC888';
export const AUTH_SECURITY_REMEMBER_KEY = 'AUTH_SECURITY_REMEMBER_KEY';
export const USER_ID_KEY = 'USER_ID_KEY';

export const STORAGE_KEYS = {
  botCurrentTable: 'botCurrentTable',
  rememberAccount: 'rememberAccount',
  lastAccountId: 'lastAccountId',
  companyInfo: 'companyInfo',
  lastCompanyInfo: 'lastCompanyInfo',
  dashboardState: 'dashboardState',
  waitSubmit2StepFa: 'waitSubmit2StepFa',
  listGroupBotChangeTable: 'listGroupBotChangeTable',
  userRole: 'userRole',
  userName: 'USER_NAME_KEY',
  AUTH_SECURITY_REMEMBER_KEY: 'AUTH_SECURITY_REMEMBER_KEY',
  USER_ID_KEY: 'USER_ID_KEY',
  affiliateCode: 'affiliateCode',
  junketId: 'junketId',
};

export default class StorageUtils {
  static setItem(key, value) {
    window.localStorage.setItem(key, value);
  }

  static getItem(key, defaultValue) {
    const result = window.localStorage.getItem(key);
    if (result === null || result === undefined) return defaultValue;
    return result;
  }

  static removeItem(key) {
    window.localStorage.removeItem(key);
  }

  // section storage
  static setSectionStorageItem(key, value) {
    window.sessionStorage.setItem(key, value);
  }

  static getSectionStorageItem(key) {
    return window.sessionStorage.getItem(key);
  }

  static removeSectionStorageItem(key) {
    window.sessionStorage.removeItem(key);
  }

  // Token
  static setToken(value) {
    StorageUtils.setSectionStorageItem(TOKEN_KEY, value);
  }

  static getToken() {
    return StorageUtils.getSectionStorageItem(TOKEN_KEY);
  }

  static removeToken() {
    StorageUtils.removeSectionStorageItem(TOKEN_KEY);
  }

  static setItemObject(key, itemObject, crypto = false) {
    let plainText = JSON.stringify(itemObject);
    if (crypto) plainText = CustomCrypto.encrypt(plainText);
    StorageUtils.setItem(key, plainText);
  }

  static getItemObject(key, defaultValue = {}, crypto = false) {
    let stringJson = StorageUtils.getItem(key);
    if (!stringJson) {
      return defaultValue;
    }
    try {
      if (crypto) stringJson = CustomCrypto.decrypt(stringJson);
      return JSON.parse(stringJson);
    } catch (e) {
      return defaultValue;
    }
  }

  static setSessionItemObject(key, itemObject, crypto = false) {
    let plainText = JSON.stringify(itemObject);
    if (crypto) plainText = CustomCrypto.encrypt(plainText);
    window.sessionStorage.setItem(key, plainText);
  }

  static getSessionItemObject(key, defaultValue = {}, crypto = false) {
    let stringJson = window.sessionStorage.getItem(key);
    if (!stringJson) {
      return defaultValue;
    }
    try {
      if (crypto) stringJson = CustomCrypto.decrypt(stringJson);
      return JSON.parse(stringJson);
    } catch (e) {
      return defaultValue;
    }
  }

  static setCompanyInfo(infoObject) {
    StorageUtils.setSessionItemObject(STORAGE_KEYS.companyInfo, infoObject, false);
    StorageUtils.setItemObject(STORAGE_KEYS.lastCompanyInfo, infoObject, true);
  }

  static getCompanyInfo() {
    try {
      let obj = StorageUtils.getSessionItemObject(STORAGE_KEYS.companyInfo, {}, true);
      if (Object.keys(obj).length === 0) {
        obj = StorageUtils.getItemObject(STORAGE_KEYS.lastCompanyInfo, {}, true);
      }
      if (Object.keys(obj).length === 0) return CompanyInfo;
      return obj;
    } catch (e) {
      return CompanyInfo;
    }
  }

  static clearInfoLogout() {
    StorageUtils.removeToken();
    StorageUtils.removeSectionStorageItem(STORAGE_KEYS.userRole);
    StorageUtils.removeSectionStorageItem(STORAGE_KEYS.userName);
  }

  static setUserItem(key, value) {
    const userId = StorageUtils.getSectionStorageItem(USER_ID_KEY);
    const userSetting = StorageUtils.getItemObject(`setting${userId}`);
    userSetting[key] = value;
    StorageUtils.setItemObject(`setting${userId}`, userSetting);
  }

  static getUserItem(key, defaultValue = null) {
    const userId = StorageUtils.getSectionStorageItem(USER_ID_KEY);
    const userSetting = StorageUtils.getItemObject(`setting${userId}`);
    if (userSetting[key] !== null && userSetting[key] !== undefined) {
      return (userSetting[key]);
    }
    return defaultValue;
  }
}
