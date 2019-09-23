import axios from "axios";
import * as actionType from "./actionTypes";
//==================================================== Statistics

export const changeColorSet = color => {
  return {
    type: actionType.GENERAL_COLOR_CHANGED,
    color: color
  };
};
export const generalSetLanguage = language => {
  return {
    type: actionType.GENERAL_LANGUAGE_SET,
    language: language
  };
};

// This UserName is the name of user is being poing
export const changeColor = color => {
  return dispatch => {
    dispatch(changeColorSet(color));
  };
};

export const setLanguage = language => {
  return dispatch => {
    dispatch(generalSetLanguage(language));
  };
};
