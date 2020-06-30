import { SET_LIST_TABLE } from '../constants/table';

const initState = {
  listTable: [],
  totalTable: 0,
};

const table = (state = initState, action = {}) => {
  switch (action.type) {
    case SET_LIST_TABLE: {
      const result = { ...state };
      result.listTable = action.data.data;
      result.totalTable = action.data.total_table;
      return result;
    }

    default:
      return state;
  }
};

export default table;
