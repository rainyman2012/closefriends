import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  statistics: null,
  error: null,
  loading: true,
  userName: "",
  userType: ""
};

const statisticStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const statisticsSuccess = (state, action) => {
  return updateObject(state, {
    statistics: action.statistics,
    userName: action.userName,
    userType: action.userType,
    error: null,
    loading: false
  });
};

const statisticsFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STATISTICS_START:
      return statisticStart(state, action);
    case actionTypes.STATISTICS_SUCCESS:
      return statisticsSuccess(state, action);
    case actionTypes.STATISTICS_FAIL:
      return statisticsFail(state, action);
    default:
      return state;
  }
};

export default reducer;
