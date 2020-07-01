import {
  SET_LIST_BOTS,
  SET_BOT_HISTORY,
  DEFAULT,
  SET_BOT_DETAIL,
  SET_CHART_DATA,
  UPDATE_TABLE_NAME,
  SET_PAY_OF_HISTORY,
  SET_DATA_CHARTS,
} from '../constants/ListBots';

const customRoundNumber = (number, afterDot = 2, delta = 0.001) => {
  const ratio = 10 ** afterDot;
  const mul = number * ratio;
  const truncNum = Math.trunc(mul);
  const ceil = truncNum + 1;
  if ((ceil - mul) < delta) return ceil / ratio;
  return truncNum / ratio;
};

const initState = {
  total: 0,
  lucUserGC: 0,
  bots: [],
  timeUpdateListBot: new Date(),
  history: [],
  chartData: {
    data: [],
    labels: [],
    gc: [],
    lastestUpdateAt: '',
  },
  botDetail: {},
};

const listBots = (state = initState, action = {}) => {
  switch (action.type) {
    case SET_LIST_BOTS: {
      const result = { ...state };
      result.total = action.data.total;
      result.bots = action.data.data;
      result.lucUserGC = customRoundNumber(action.data.user_gc, 2);
      result.timeUpdateListBot = new Date();
      return result;
    }

    case SET_BOT_HISTORY: {
      const result = { ...state };
      result.history = action.data;
      return result;
    }

    case SET_CHART_DATA: {
      const result = { ...state };
      result.chartData.data = action.data.data;
      result.chartData.labels = action.data.data && action.data.data.data.map(item => item.date);
      result.chartData.gc = action.data.data && action.data.data.data.map(item => item.gcs);
      result.chartData.lastestUpdateAt = action.data.data.updated_at;
      return result;
    }

    case SET_BOT_DETAIL: {
      const result = { ...state };
      result.botDetail = action.data;
      return result;
    }

    case UPDATE_TABLE_NAME: {
      const result = { ...state };
      const pusherData = action.listGroupBotChangeTable;

      if (!Object.keys(pusherData).length || !result.bots.length) {
        return result;
      }

      result.bots.map((item) => {
        const itemClone = item;
        if (Object.keys(pusherData).includes((itemClone.group_id.toString()))) {
          itemClone.table_name = pusherData[itemClone.group_id];
        }
        return itemClone;
      });

      const { botDetail } = result;
      if (Object.keys(botDetail).length) {
        if (Object.keys(pusherData).includes((botDetail.group_id.toString()))) {
          botDetail.table_name = pusherData[botDetail.group_id];
        }
      }
      return result;
    }

    case SET_PAY_OF_HISTORY: {
      const result = { ...state };
      result.payOffsData = action.data.data;
      return result;
    }

    case SET_DATA_CHARTS: {
      const result = { ...state };
      result.chartsData = action.data.data;
      return result;
    }

    case DEFAULT:
      return state;

    default:
      return state;
  }
};

export default listBots;
