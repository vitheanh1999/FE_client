import {
  SET_LIST_NEWS,
  SET_NEW_DETAIL,
  READ_NEW,
  READ_NEW_NOT_LOGIN,
  SET_LIST_NEWS_TOP,
} from '../constants/news';
import NewsHelper from '../helpers/NewsHelper';
import { convertTime } from '../helpers/utils';

const initState = {
  listNews: [],
  newDetail: {},
  total: 0,
  totalNew: 0,
};

const newsHelper = new NewsHelper();

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
  switch (action.type) {
    case SET_LIST_NEWS: {
      return setListNew(state, action);
    }

    case SET_LIST_NEWS_TOP: {
      return setListNew(state, action);
    }

    case SET_NEW_DETAIL: {
      const result = { ...state };
      result.newDetail = action.data;
      return result;
    }

    case READ_NEW: {
      const result = { ...state };
      // const { listNews } = result;
      // for (let i = 0; i < listNews.length; i += 1) {
      //   if (listNews[i].id === action.newId) {
      //     listNews[i].hasRead = true;
      //     newsHelper.addNewDashboardReadId(listNews[i].id, listNews[i].start_plan);
      //     break;
      //   }
      // }
      // const resultCheck = checkNew(listNews);
      // result.listNews = resultCheck.listNews;
      // result.totalNew = resultCheck.totalNew;
      return result;
    }

    case READ_NEW_NOT_LOGIN: {
      const result = { ...state };
      // const { listNews } = result;
      // for (let i = 0; i < listNews.length; i += 1) {
      //   if (listNews[i].id === action.newId) {
      //     listNews[i].hasRead = true;
      //     newsHelper.addNewTopReadId(listNews[i].id, listNews[i].start_plan);
      //     break;
      //   }
      // }
      // const resultCheck = checkNew(listNews);
      // result.listNews = resultCheck.listNews;
      // result.totalNew = resultCheck.totalNew;
      return result;
    }

    default:
      return state;
  }
};

export default news;
