import { TableState } from './bettingConst';
import * as reBet from './reBet';

export const restoreTableStatus = (tracking) => {
  let enableBtnOk;
  let totalBet;
  let confirmBetData;
  let turnId;
  let statusBetText;
  let startDeal;
  let choseCoin;
  let nameTable;
  let timeTurn;
  let dataResult;
  try {
    const turnTimeDown = tracking.table.time;
    const turnStartTime = new Date(tracking.turn.start_at);
    const currentTime = new Date(tracking.serverTime.date);
    let timeDistance = parseInt((currentTime.valueOf() - turnStartTime.valueOf()) / 1000, 10);
    if (tracking.turn.terminated_at) {
      timeDistance = 0;
    }

    let tableStatus = TableState.unknown;
    if (tracking.table.shuffling === 1) {
      tableStatus = TableState.shuffling;
    } else if (timeDistance > 0 && timeDistance <= turnTimeDown) {
      tableStatus = TableState.betting;
    } else tableStatus = TableState.waitOpenCard;

    startDeal = (tableStatus === TableState.betting); // set betting or wait open cards
    timeTurn = tracking.table.time; // set time turn of table

    // restore betting
    enableBtnOk = false; // disable btn ok
    statusBetText = startDeal ? 'placeYourBet' : 'noMoreBet'; // set text betting
    choseCoin = 0; // no select any chip in LayoutCoinFrame
    let bettingInfo = tracking.betting;
    if (bettingInfo === null || bettingInfo === undefined) {
      bettingInfo = {
        player: 0,
        banker: 0,
        tie: 0,
        p_pair: 0,
        b_pair: 0,
      };
    }

    const totalChipBet = bettingInfo.player + bettingInfo.banker
      + bettingInfo.tie + bettingInfo.p_pair + bettingInfo.b_pair;
    const bettingData = {
      totalBet: totalChipBet,
      betPlayer: bettingInfo.player,
      betBanker: bettingInfo.banker,
      betTie: bettingInfo.tie,
      betPlayerPair: bettingInfo.p_pair,
      betBankerPair: bettingInfo.b_pair,
    };

    totalBet = bettingData; // set all betting info
    confirmBetData = bettingData; // set chips confirmed
    turnId = tracking.turn.id; // set turn Id

    nameTable = tracking.table.name;
    dataResult = null; // set info at open cards

    return ({
      state: {
        startDeal,
        timeTurn,
        enableBtnOk,
        statusBetText,
        choseCoin,
        totalBet,
        confirmBetData,
        turnId,
        nameTable,
        dataResult,
        preBetData: reBet.preBetDataDefault,
      },
      timeRemain: turnTimeDown - timeDistance,
      tableStatus,
    });
  } catch (e) {
    return null;
  }
};

export const foo = 1;
