import { CURRENT_ENV } from '../config';

export default class LogUtils {
  static log(tag, message = '') {
    // eslint-disable-next-line no-console
    if (CURRENT_ENV === 'local' || CURRENT_ENV === 'dev' || CURRENT_ENV === 'test') { console.log(tag, message); }
  }

  static info(tag, message = '') {
    // eslint-disable-next-line no-console
    if (CURRENT_ENV === 'local' || CURRENT_ENV === 'dev' || CURRENT_ENV === 'test') { console.info(tag, message); }
  }

  static warn(tag, message = '') {
    // eslint-disable-next-line no-console
    if (CURRENT_ENV === 'local' || CURRENT_ENV === 'dev' || CURRENT_ENV === 'test') { console.warn(tag, message); }
  }

  static error(tag, message = '') {
    // eslint-disable-next-line no-console
    if (CURRENT_ENV === 'local' || CURRENT_ENV === 'dev' || CURRENT_ENV === 'test') { console.error(tag, message); }
  }
}
