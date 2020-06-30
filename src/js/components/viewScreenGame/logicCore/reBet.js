export const preBetDataDefault = {
  turnId: -10,
  totalBet: {},
  betPlayerPair: {},
  betBankerPair: {},
  betTie: {},
  betBanker: {},
  betPlayer: {},
};

export const resetPreBetData = (turnId) => {
  const data = { ...preBetDataDefault };
  data.turnId = turnId;
  return data;
};

export const confirmPreBetData = (turnId, confirmBetData) => ({
  turnId,
  totalBet: confirmBetData.totalBet,
  betPlayerPair: confirmBetData.betPlayerPair,
  betBankerPair: confirmBetData.betBankerPair,
  betTie: confirmBetData.betTie,
  betBanker: confirmBetData.betBanker,
  betPlayer: confirmBetData.betPlayer,
});

export const checkResetPreBetData = (turnId, preBetData) => {
  if (turnId === preBetData.turnId) { // show cards in same turn with preBet
    return preBetData;
  }
  return resetPreBetData(turnId);
  // show card in other turn with preBet, user don't bet in this turn
};
