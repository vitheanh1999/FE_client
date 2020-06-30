import axios from 'axios';
import { API } from '../config';
import StorageUtils, { TOKEN_KEY_LUC88 } from '../helpers/StorageUtils';

const create = (baseUrl = null) => {
  const api = axios.create({
    baseURL: (baseUrl === null ? API : baseUrl),
    timeout: 60000,
  });

  const sendGet = (path, options) => (
    api.get(path, options)
      .then((response) => {
        const { code } = response.data || {};
        if (code === 503) {
          throw response;
        } else {
          return response;
        }
      })
  );

  const sendPost = (path, params, options = {}) => (
    api.post(path, params, options)
      .then((res) => {
        const { code } = res.data || {};
        if (code === 503) {
          throw res;
        } else {
          return res;
        }
      })
  );

  const sendPut = (path, params, options = {}) => (
    api.put(path, params, options)
      .then((res) => {
        const { code } = res.data || {};
        if (code === 503) {
          throw res;
        } else {
          return res;
        }
      })
  );

  const generateGet = (path, params = null) => {
    const options = {
      headers: {
        Authorization: `Bearer ${StorageUtils.getToken()}`,
        params,
      },
    };
    return sendGet(path, options);
  };

  const generatePost = (path, params) => {
    const options = {
      headers: {
        Authorization: `Bearer ${StorageUtils.getToken()}`,
      },
    };
    return sendPost(path, params, options);
  };

  const generatePut = (path, params) => {
    const options = {
      headers: {
        Authorization: `Bearer ${StorageUtils.getToken()}`,
      },
    };
    return sendPut(path, params, options);
  };


  const generatePostLUC = (path, params) => {
    const options = {
      headers: {
        Authorization: `Bearer ${StorageUtils.getSectionStorageItem(TOKEN_KEY_LUC88)}`,
      },
    };
    return sendPost(path, params, options);
  };

  const getBotTotalGcHistory = params => generatePost('/get-bot-total', params);
  const getUserInfo = () => generateGet('/user-info');
  const getListBots = () => generateGet('/deposit');
  const fetchUser = () => generateGet('/users/dashboard-account');
  const connectToLucAccount = params => generatePost('/users/linktoluc', params);
  const fetchListBots = params => generateGet(`/users/bots?sort_by=${params.sortBy}&page=${params.currentPage}&per_page=${params.perPage}&is_deleted=${params.isDeleted || 0}`);
  const fetchBurstStatus = () => generateGet('/count-burst-status');
  const fetchPaymentInfo = () => generateGet('/chip/crypto');
  const updateBotStatus = params => generatePost(`bots/${params.botId}/update-status`, params);
  const createBots = params => generatePost('/users/add-bot', params);
  const getPriceUSD = params => generatePost('/usdt-price', params);
  const getPriceBTC = params => generatePost('/btc-price', params);
  const requestPaying = params => generatePost('/invoice', params);

  const fetchBotHistory = params => generateGet(`bots/${params.botId}/payoff?start_date=${params.startDate}&end_date=${params.endDate}&page=${params.currentPage}&per_page=${params.perPage}`);

  const fetchPayOffHistory = params => generatePost('bots/payoffs', params);
  const fetchBotHistoryNow = params => generateGet(`bots/${params.botId}/history-betting?page=${params.currentPage}&per_page=${params.perPage}`);
  const payout = params => generatePost(`bots/${params.botId}/payout`, params);
  const fetchBotGCNow = botId => generateGet(`/bots/${botId}/get-gc`);
  const fetchTableStatusNow = botId => generateGet(`/bots/${botId}/table-info`);

  const fetchChartData = params => generateGet(`bots/${params.botId}/chart?start_date=${params.startDate}&end_date=${params.endDate}`);
  const fetchDataCharts = params => generatePost('bots/charts', params);

  const fetchBotDetail = params => generateGet(`/users/bots/${params.botId}?id=${params.botId}`);
  const fetchHistoryTable = params => generatePost('/lobby-board', params);
  const getDepositHistory = (perPage, currentPage) => generateGet(`/users/deposit-history?per_page=${perPage}&current_page=${currentPage}`);
  const getGiftHistory = (perPage, currentPage) => generateGet(`/users/history-gift?per_page=${perPage}&current_page=${currentPage}`);
  const fetchPayoutHistory = params => generatePost('/bots/payouts', params);
  const gift = params => generatePost('/users/gift', params);
  const loginDemo = params => generatePost('/users/signin', params);
  const login = params => generatePost('/users/signin', params);
  const register = params => generatePost('/users/signup', params);
  const refreshToken = params => generatePost('/users/refresh-token', params);

  const fetchMaintainInfo = () => sendGet('/maintenances/check');
  const fetchMinProfitValue = () => generateGet('admin/settings');

  const fetchListCampaigns = params => generateGet(`/users/campaigns?per_page=${params.perPage}&page=${params.currentPage}`);
  const createCampaign = params => generatePost('/users/campaigns/create', params);
  const updateCampaign = params => generatePut('/users/campaigns/update', params);
  const deleteCampaign = params => generatePost('/users/campaigns/delete', params);
  // 2 step auth
  const sendAuthCode = params => generatePostLUC('auth-setting/send-code', params);
  const submitAuthCode = params => generatePostLUC('auth-setting/submit-code', params);

  const deleteBot = params => generatePost(`bots/${params.botId}/delete`);
  const updateBotName = params => generatePost('bots/rename', params);
  const updateBotCampaign = params => generatePut(`bots/${params.botId}/update-campaign?campaign_id=${params.campaignId}`);

  const fetchListBetPattern = () => generateGet('/users/bet-patterns');
  const fetchListLogicPattern = () => generateGet('/users/logic-patterns');

  const fetchListNews = params => generateGet(`/users/news/list?per_page=${params.perPage}&page=${params.currentPage}`);
  const fetchNewDetail = params => generateGet(`/users/news/details?id=${params.id}`);
  const fetchListNewsNotLogin = params => generateGet(`/news/list?per_page=${params.perPage}&page=${params.currentPage}`);
  const fetchNewDetailNotLogin = params => generateGet(`/news/details?id=${params.id}`);

  const fetchListTable = () => generateGet('/users/list-table');
  const selectTable = params => generatePost('bots/choose-table', params);

  return {
    fetchListTable,
    selectTable,
    fetchListNews,
    fetchNewDetail,
    fetchListNewsNotLogin,
    fetchNewDetailNotLogin,
    updateBotCampaign,
    fetchListCampaigns,
    fetchListBetPattern,
    fetchListLogicPattern,
    sendAuthCode,
    submitAuthCode,
    login,
    refreshToken,
    register,
    getBotTotalGcHistory,
    getUserInfo,
    getListBots,
    fetchUser,
    connectToLucAccount,
    fetchListBots,
    fetchBurstStatus,
    fetchPaymentInfo,
    updateBotStatus,
    createBots,
    fetchBotHistory,
    fetchBotHistoryNow,
    getPriceUSD,
    requestPaying,
    getPriceBTC,
    fetchChartData,
    fetchDataCharts,
    fetchBotDetail,
    getDepositHistory,
    fetchHistoryTable,
    getGiftHistory,
    fetchPayoutHistory,
    gift,
    payout,
    loginDemo,
    fetchBotGCNow,
    fetchTableStatusNow,
    fetchMaintainInfo,
    fetchMinProfitValue,
    fetchPayOffHistory,
    updateBotName,
    createCampaign,
    updateCampaign,
    deleteBot,
    deleteCampaign,
  };
};

export default {
  create,
};
