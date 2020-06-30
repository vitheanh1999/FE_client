import * as Lodash from 'lodash';

export const initTableChipTypes = (chipTypes) => {
  const result = [...chipTypes];
  let minIdType = 1000000;
  let index = -1;
  for (let i = 0; i < chipTypes.length; i += 1) {
    result[i].selected = false;
    if (minIdType > result[i].id) {
      minIdType = result[i].id;
      index = i;
    }
  }

  if (index >= 0) { // default select min id (GC)
    result[index].selected = true;
  }
  return result;
};

export const getDeltaBet = (currentBet, oldBet) => {
  const oldBetData = oldBet || {};
  const currentBetData = currentBet || {};
  const keys = Object.keys(currentBetData);
  const result = { ...currentBetData };
  for (let i = 0; i < keys.length; i += 1) {
    if (oldBetData[keys[i]]) {
      result[keys[i]] -= oldBetData[keys[i]];
    }
  }
  return result;
};

export const getChipCanAdd = (betAreaData, tableChipTypes, chooseCoin,
  userMoney, confirmBetArea) => {
  const result = [];
  const delta = getDeltaBet(betAreaData, confirmBetArea);
  for (let i = 0; i < tableChipTypes.length; i += 1) {
    if (tableChipTypes[i].selected === true) {
      const key = tableChipTypes[i].id;
      const moneyInfo = userMoney.find(item => item.id === key);
      const currentMoney = moneyInfo ? moneyInfo.value : 0;
      const deltaMoney = delta[key] ? delta[key] : 0;
      if ((deltaMoney + chooseCoin) <= currentMoney) result.push(key);
    }
  }
  return result;
};


export const addCoinToBetData = (betAreaData, betChipTypes, chooseCoin) => {
  const result = { ...betAreaData };
  for (let i = 0; i < betChipTypes.length; i += 1) {
    const key = betChipTypes[i];
    if (betAreaData[key]) {
      result[key] += chooseCoin;
    } else {
      result[key] = chooseCoin;
    }
  }
  return result;
};

export const checkOutOfRange = (betAreaData, max) => {
  const keys = Object.keys(betAreaData);
  let isNotOver = false;
  for (let i = 0; i < keys.length; i += 1) {
    if (betAreaData[keys[i]] <= max) isNotOver = true;
  }
  return !isNotOver;
};

export const checkBothBet = (betPlayer, betBanker) => {
  let checkPlayer = false;
  let keys = Object.keys(betPlayer);
  for (let i = 0; i < keys.length; i += 1) {
    if (betPlayer[keys[i]] > 0) {
      checkPlayer = true;
      break;
    }
  }
  if (!checkPlayer) return false;

  keys = Object.keys(betBanker);
  for (let i = 0; i < keys.length; i += 1) {
    if (betBanker[keys[i]] > 0) {
      return true;
    }
  }
  return false;
};

export const checkEnough = (userTotal, totalBet) => {
  const userTotalData = userTotal || [];
  const totalBetData = totalBet || {};
  const keys = Object.keys(totalBetData);
  for (let i = 0; i < keys.length; i += 1) {
    const value = totalBetData[keys[i]];
    const idChipType = parseInt(keys[i], 10);
    if (value) {
      const moneyInfo = userTotalData.find(item => item.id === idChipType);
      if (!moneyInfo || value > moneyInfo.value) return false;
    }
  }
  return true;
};

export const addBetAreaData = (dataArea1, dataArea2) => {
  const data1 = dataArea1 || {};
  const data2 = dataArea2 || {};
  const result = { ...data1 };
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const keys = Lodash.uniq(keys1.concat(keys2));
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value1 = data1[key] || 0;
    const value2 = data2[key] || 0;
    result[key] = value1 + value2;
  }
  return result;
};

export const subBetAreaData = (dataArea1, dataArea2) => {
  const data1 = dataArea1 || {};
  const data2 = dataArea2 || {};
  const result = { ...data1 };
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const keys = Lodash.uniq(keys1.concat(keys2));
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value1 = data1[key] || 0;
    const value2 = data2[key] || 0;
    result[key] = value1 - value2;
  }
  return result;
};
