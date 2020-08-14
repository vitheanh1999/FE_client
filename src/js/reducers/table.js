import { SET_LIST_TABLE } from '../constants/table';

const convertData = listTable => listTable.map((item) => {
  const newItem = { ...item };
  if (item.name_display) {
    newItem.name = item.name_display;
  }
  return newItem;
});
const initState = {
  listTable: [],
  totalTable: 0,
};

const table = (state = initState, action = {}) => {
  switch (action.type) {
    case SET_LIST_TABLE: {
      const result = { ...state };
      result.listTable = convertData(action.data.data);
      result.totalTable = action.data.total_table;
      return result;
    }

    default:
      return state;
  }
};

export default table;
