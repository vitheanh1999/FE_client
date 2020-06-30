
export const CHIP_VALUES = [
  /* 1, 5, 10, 50, */
  100,
  /* 250, */
  500, 1000, 5000, 10000, 25000, 50000, 100000, 500000,
];

const setZero = (lsChip, i, k) => {
  for (let j = i; j < k; j += 1) {
    lsChip[j].value = 0;
  }
};

const checkCanGroup = (chipValues, sum, except) => (
  chipValues.includes(sum) === true && sum > except);

export const mergeChips = (listChip, chipValues = CHIP_VALUES) => {
  const { length } = listChip;
  const lsChip = [...listChip];

  let checkMerge = false;
  for (let k = length - 1; k >= 0; k -= 1) {
    let sum = 0;
    for (let i = k; i >= 0; i -= 1) {
      if (lsChip[i].value !== 0) {
        sum += lsChip[i].value;
        if (checkCanGroup(chipValues, sum, lsChip[i].value) === true) {
          checkMerge = true;
          setZero(lsChip, i, k);
          lsChip[k].value = sum;
          break;
        }
      }
    }
    if (checkMerge === true) break;
  }

  if (checkMerge) {
    return mergeChips(lsChip, chipValues);
  }
  return listChip;
};

export const repositionChip = (listChip) => {
  const lsPos = listChip.map(item => ({ x: item.x, y: item.y }));
  const lsChip = [...listChip];
  const { length } = listChip;
  let index = 0;
  for (let i = 0; i < length; i += 1) {
    if (lsChip[i].value !== 0) {
      lsChip[i].x = lsPos[index].x;
      lsChip[i].y = lsPos[index].y;
      index += 1;
    }
  }
  return lsChip;
};

export const getMapChip = (listChip) => {
  const playerWinChips = [];
  const playerPairChips = [];
  const bankerWinChips = [];
  const bankerPairChips = [];
  const tieChips = [];

  const { length } = listChip;
  for (let i = 0; i < length; i += 1) {
    const chip = listChip[i];
    if (listChip[i].value > 0) {
      switch (chip.type) {
        case 'playerWin':
          playerWinChips.push(chip);
          break;
        case 'playerPair':
          playerPairChips.push(chip);
          break;
        case 'bankerWin':
          bankerWinChips.push(chip);
          break;
        case 'bankerPair':
          bankerPairChips.push(chip);
          break;
        case 'tie':
          tieChips.push(chip);
          break;
        default: break;
      }
    }
  }
  return {
    playerWinChips,
    playerPairChips,
    bankerWinChips,
    bankerPairChips,
    tieChips,
  };
};

export const calculatePositionChip = (chipInfo, index, listChipPosition, zero) => {
  const result = { x: 0, y: 0 };
  const position = index < listChipPosition.length
    ? listChipPosition[index]
    : listChipPosition[listChipPosition.length - 1];
  result.x = position.x - zero.left;
  result.y = position.y - zero.top;
  return result;
};
