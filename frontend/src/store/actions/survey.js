import axios from "axios";
import * as actionType from "./actionTypes";
import { HOSTNAME } from "../../static";
import { setLanguage } from "./general";

export const surveyStart = () => {
  return {
    type: actionType.SURVEY_START
  };
};

export const setUserName = userName => {
  return {
    type: actionType.SURVEY_USERNAME_SET,
    userName: userName
  };
};

export const surveySuccessReceived = (survey, userType) => {
  return {
    type: actionType.SURVEY_SUCCESS_RECEIVED,
    currentSurvey: survey,
    userType: userType
  };
};

export const surveySuccessCreated = (survey, userName, userType) => {
  return {
    type: actionType.SURVEY_SUCCESS_RECEIVED,
    currentSurvey: survey,
    userName: userName,
    userType: userType
  };
};

export const surveySuccessUpdated = (survey, userName, userType) => {
  return {
    type: actionType.SURVEY_SUCCESS_UPDATED
  };
};

export const surveyFail = error => {
  return {
    type: actionType.SURVEY_FAIL,
    error: error
  };
};

export const surveySetUserName = userName => {
  return dispatch => {
    dispatch(setUserName(userName));
  };
};
// This UserName is the name of user is being poing
export const surveyGetData = uuid => {
  return dispatch => {
    dispatch(surveyStart());
    axios({
      method: "get",
      url: `${HOSTNAME}/survey/${uuid}/`,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        const survey = res.data;
        dispatch(surveySuccessReceived(survey, "user"));
        dispatch(setLanguage(survey.lang));
      })
      .catch(err => {
        dispatch(surveyFail(err));
      });
  };
};

export const createSurvey = (name, lang, sex) => {
  return dispatch => {
    dispatch(surveyStart());
    axios({
      method: "post",
      data: {
        name: name,
        lang: lang,
        sex: sex
      },
      url: `${HOSTNAME}/survey/`,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        const survey = res.data;
        // const token = res.data.key;
        // const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        // localStorage.setItem("token", token);
        // localStorage.setItem("expirationDate", expirationDate);
        dispatch(surveySuccessCreated(survey, survey.name, "admin"));

        // dispatch(checkAuthTimeout(3600));
      })
      .catch(err => {
        console.log(err);
        dispatch(surveyFail(err));
      });
  };
};

export const surveyUpdateRealAnswerData = (uuid, answers) => {
  return dispatch => {
    dispatch(surveyStart());
    axios({
      method: "put",
      data: {
        uuid: uuid,
        realAnswers: answers
      },
      url: `${HOSTNAME}/survey/${uuid}/`,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log(res);
        //dispatch(surveySuccessUpdated(res));
      })
      .catch(err => {
        console.log(err);

        dispatch(surveyFail(err));
      });
  };
};

export const surveyUpdateUserAnswerData = (uuid, answers, name) => {
  return dispatch => {
    dispatch(surveyStart());
    axios({
      method: "put",
      data: {
        uuid: uuid,
        answers: answers,
        name: name
      },
      url: `${HOSTNAME}/survey/${uuid}/`,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        dispatch(surveyFail(err));
      });
  };
};
