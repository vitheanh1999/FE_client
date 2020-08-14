import moment from 'moment';
import ApiErrorCode from '../constants/apiErrorCode';
import StorageUtils from './StorageUtils';
import i18n from '../i18n/i18n';
import { ENABLE_LOGIN } from '../config';
import { PRODUCT_MODE } from '../constants/ProductType';

const redirectToMaintainPage = () => {
  window.location.replace('/maintain');
};

export const redirectToLogin = () => {
  StorageUtils.clearInfoLogout();
  let url;
  if (ENABLE_LOGIN) {
    url = '/login';
  } else {
    url = PRODUCT_MODE.DBAC.getLoginUrl();
  }
  window.location.replace(url);
};

export default class ApiErrorUtils {
  static handleServerError(data, alert, onSuccess, onError, title) {
    const { code } = data;
    const { message } = data;
    let result = false;
    if (!alert) return false;
    if (code >= 200 && code < 300) {
      if (onSuccess) onSuccess();
      else alert.showAlert(title || i18n.t('success'), message);
      result = true;
    } else if (code === ApiErrorCode.UNAUTHORIZED) {
      if (message === 'dashboard-account.') {
        alert.showAlert(i18n.t('error'), i18n.t('Unauthenticated.'), i18n.t('OK'), () => redirectToLogin(), () => redirectToLogin());
      } else {
        alert.showAlert(i18n.t('error'), message, i18n.t('close'), () => alert.hideAlert());
      }
    } else if (code === 405) {
      alert.showBanUser();
    } else if (code === ApiErrorCode.MAINTENANCE) {
      return redirectToMaintainPage();
    } else if (code === ApiErrorCode.ON_BOT && message === i18n.t('accountExistError')) {
      alert.showAlert(
        i18n.t('error'),
        i18n.t('accountExist'),
        i18n.t('signInLUC888'),
        () => {
          alert.hideAlert();
          onError();
        },
      );
    } else if (code === ApiErrorCode.ON_BOT) {
      let textContent = message;
      if (data.notEqualGc) {
        textContent = textContent.replace(/\\n/g, '\n');
        alert.showAlert(i18n.t('onBotDiffGcTitle'), textContent, i18n.t('OK'), () => alert.hideAlert());
        return result;
      }
      const regex = new RegExp(/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/g);
      const detectDateTime = textContent.match(regex);
      if (detectDateTime && detectDateTime.length) {
        for (let i = 0; i < detectDateTime.length; i += 1) {
          textContent = textContent.replace(detectDateTime[i], moment(detectDateTime[i]).add(moment().utcOffset(), 'm').format('DD日 HH:mm'));
        }
      }

      alert.showAlert(i18n.t('error'), textContent, i18n.t('OK'), () => alert.hideAlert());

      if (onError) {
        onError();
      }
    } else {
      alert.showAlert(i18n.t('error'), message, i18n.t('OK'), () => alert.hideAlert());
      if (onError) {
        onError();
      }
    }
    return result;
  }

  static handleHttpError(error, alert, onError) {
    if (!alert) return;
    const { response, data } = error;
    let message = '';
    if (data && data.code === ApiErrorCode.MAINTENANCE) {
      message = i18n.t('maintainSystem');
      redirectToMaintainPage();
    }

    if (response && response.status === ApiErrorCode.UNAUTHORIZED) {
      if (response.data && response.data.message) message = response.data.message;
      if (message === 'Unauthenticated.') message = i18n.t('Unauthenticated.');
      alert.showAlert(i18n.t('error'), message, i18n.t('OK'), () => redirectToLogin(), () => redirectToLogin());
      return;
    }
    if (response && response.status === ApiErrorCode.NOT_FOUND) {
      message = 'notFound';
    }
    if (error.message && error.message === 'Network Error') {
      message = i18n.t('networkErr');
    }
    alert.showAlert('error', message);
    if (onError) {
      onError();
    }
  }
}
