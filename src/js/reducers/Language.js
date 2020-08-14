import StorageUtils from '../helpers/StorageUtils';
import { SETTING_LANGUAGE } from '../constants/language';

const initState = {
  lang: StorageUtils.getItem('i18nextLng'),
};

const Language = (state = initState, action = {}) => {
  if (action.type === SETTING_LANGUAGE) {
    const result = { ...state };
    result.lang = action.lang;
    return result;
  }
  return state;
};

export default Language;
