import {
  SET_LIST_BOTS,
  SELECT_ALL_BOTS_ENABLE_DEPOSIT,
  SET_PAYMENT_INFO,
} from '../constants/Deposit';

const initState = {
  listBots: [],
  botIdsSelected: [],
  paymentInfo: {},
  priceUSDInfo: {},
};

const Deposit = (state = initState, action = {}) => {
  switch (action.type) {
    case SET_LIST_BOTS: {
      const result = { ...state };
      const { data } = result;
      if (!data) {
        return result;
      }
      result.listBots = data.filter(item => item.status === 'OFF');
      return result;
    }

    case SELECT_ALL_BOTS_ENABLE_DEPOSIT: {
      const result = { ...state };
      const { botIdsSelected, listBots } = result;
      const allBotsEnableDeposit = listBots.filter(bot => bot.isDeposit === true);
      if (botIdsSelected.length < allBotsEnableDeposit.length) {
        result.botIdsSelected = allBotsEnableDeposit.map(bot => bot.id);
      } else {
        result.botIdsSelected = [];
      }
      return result;
    }

    case SET_PAYMENT_INFO: {
      const result = { ...state };
      result.paymentInfo = action.data;
      return result;
    }

    default: {
      return state;
    }
  }
};

export default Deposit;
