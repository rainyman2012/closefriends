import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  currentSurvey: null,
  error: null,
  loading: false,
  userName: "",
  userType: ""
};

const surveyStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const surveySetUserName = (state, action) => {
  return updateObject(state, {
    userName: action.userName,
    loading: false
  });
};

const surveySuccessCreated = (state, action) => {
  return updateObject(state, {
    currentSurvey: action.currentSurvey,
    error: null,
    loading: false
  });
};

const surveySuccessReceived = (state, action) => {
  return updateObject(state, {
    currentSurvey: action.currentSurvey,
    error: null,
    loading: false,
    userName: action.userName,
    userType: action.userType
  });
};

// const surveySuccessUpdated = (state, action) => {
//   return updateObject(state, {
//     currentSurvey: action.currentSurvey,
//     error: null,
//     loading: false
//   });
// };

const serveyFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SURVEY_START:
      return surveyStart(state, action);

    case actionTypes.SURVEY_SUCCESS_RECEIVED:
      return surveySuccessReceived(state, action);

    case actionTypes.SURVEY_SUCCESS_CREATED:
      return surveySuccessCreated(state, action);

    case actionTypes.SURVEY_USERNAME_SET:
      return surveySetUserName(state, action);

    case actionTypes.SURVEY_FAIL:
      return serveyFail(state, action);
    default:
      return state;
  }
};

export default reducer;
