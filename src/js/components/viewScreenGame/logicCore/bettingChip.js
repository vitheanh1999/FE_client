
export const confirmBet = (confirmBetData, totalBet) => {
  const result = { ...confirmBetData };
  result.totalBet = totalBet.totalBet;
  result.betPlayerPair = totalBet.betPlayerPair;
  result.betBankerPair = totalBet.betBankerPair;
  result.betTie = totalBet.betTie;
  result.betBanker = totalBet.betBanker;
  result.betPlayer = totalBet.betPlayer;
  return result;
};

export const copyConfirmDataBet = (totalBet, confirmBetData) => {
  const result = { ...totalBet };
  result.totalBet = confirmBetData.totalBet ? { ...confirmBetData.totalBet } : {};
  result.betPlayerPair = confirmBetData.betPlayerPair ? { ...confirmBetData.betPlayerPair } : {};
  result.betBankerPair = confirmBetData.betBankerPair ? { ...confirmBetData.betBankerPair } : {};
  result.betTie = confirmBetData.betTie ? { ...confirmBetData.betTie } : {};
  result.betBanker = confirmBetData.betBanker ? { ...confirmBetData.betBanker } : {};
  result.betPlayer = confirmBetData.betPlayer ? { ...confirmBetData.betPlayer } : {};
  return result;
};

export const requestConfirmBetting = (tableId, turnId, confirmBetData,
  bettingActions, callbackSuccess, callbackError) => {
  bettingActions.confirmRequest(
    tableId,
    turnId,
    confirmBetData.betPlayerPair,
    confirmBetData.betBankerPair,
    confirmBetData.betTie,
    confirmBetData.betBanker,
    confirmBetData.betPlayer,
    callbackSuccess,
    callbackError,
  );
};

export const totalChipBetting = (totalBet) => {
  const totalBetData = totalBet || {};
  return Object.values(totalBetData).reduce((acc, curr) => acc + Math.abs(curr), 0);
};
