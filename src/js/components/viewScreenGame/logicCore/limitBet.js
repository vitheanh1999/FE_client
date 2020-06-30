

export const getLimitData = (tableInfo) => {
  const limitInfo = {};
  let stringJson = tableInfo.banker_player_limit;
  const baseLimit = JSON.parse(stringJson);
  limitInfo.baseMin = parseInt(baseLimit.min, 10);
  limitInfo.baseMax = parseInt(baseLimit.max, 10);

  stringJson = tableInfo.pair_limit;
  const pairLimit = JSON.parse(stringJson);
  limitInfo.pairMin = parseInt(pairLimit.min, 10);
  limitInfo.pairMax = parseInt(pairLimit.max, 10);

  stringJson = tableInfo.tie_limit;
  const tieLimit = JSON.parse(stringJson);
  limitInfo.tieMin = parseInt(tieLimit.min, 10);
  limitInfo.tieMax = parseInt(tieLimit.max, 10);

  limitInfo.betRangeMin = -1;
  limitInfo.betRangeMax = -1;

  return limitInfo;
};

export const foo = 1;
