import {
  SET_LIST_NEWS,
  SET_NEW_DETAIL,
  READ_NEW,
  READ_NEW_NOT_LOGIN,
  SET_LIST_NEWS_TOP,
} from '../constants/news';
import { convertTime } from '../helpers/utils';

const initState = {
  listNews: [],
  newDetail: {},
  total: 0,
  totalNew: 0,
};

const checkNew = (data) => {
  const listNews = (data || []).map((item) => {
    return {
      ...item,
      created_at: convertTime(item.created_at),
      summary: item.content_data ? item.content_data[0].summary : '',
    };
  });
  return {
    listNews,
  };
};

const setListNew = (state, action) => {
  const result = { ...state };
  const { data, total } = action.data;
  const resultCheck = checkNew(data);
  result.listNews = resultCheck.listNews;
  result.total = total;
  result.totalNew = action.data.total_new > 9 ? '9+' : action.data.total_new;
  return result;
};

const news = (state = initState, action = {}) => {
  const actionType = action.type;
  if (actionType === SET_LIST_NEWS || actionType === SET_LIST_NEWS_TOP) {
    return setListNew(state, action);
  }

  if (actionType === SET_NEW_DETAIL) {
    const result = { ...state };
    result.newDetail = action.data;
    return result;
  }

  if (actionType === READ_NEW || actionType === READ_NEW_NOT_LOGIN) {
    const result = { ...state };
    return result;
  }

  return state;
};

export default news;
