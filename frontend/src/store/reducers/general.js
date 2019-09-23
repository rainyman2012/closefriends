import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  color: "green",
  language: "fa"
};

const changeColor = (state, action) => {
  return updateObject(state, {
    color: action.color
  });
};

const generalLanguageSet = (state, action) => {
  return updateObject(state, {
    language: action.language
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GENERAL_COLOR_CHANGED:
      return changeColor(state, action);

    case actionTypes.GENERAL_LANGUAGE_SET:
      return generalLanguageSet(state, action);

    default:
      return state;
  }
};

export default reducer;
