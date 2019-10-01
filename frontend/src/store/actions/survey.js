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

export const surveySuccessReceivedSurvey = (survey, userType) => {
  return {
    type: actionType.SURVEY_SUCCESS_RECEIVED,
    currentSurvey: survey,
    userType: userType
  };
};

export const surveySuccessCreated = uuid => {
  return {
    type: actionType.SURVEY_SUCCESS_CREATED,
    uuid: uuid
  };
};

export const surveySuccessQuestionsReceived = (
  userName,
  sex,
  password,
  userType,
  questions
) => {
  return {
    type: actionType.SURVEY_SUCCESS_QUESTIONS_RECEIVERD,
    userName: userName,
    sex: sex,
    password: password,
    userType: userType,
    questions: questions
  };
};

export const surveySuccessUpdated = () => {
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
export const surveyGetQuestions = (name, sex, lang, password) => {
  //survey/getQuestions/fa/m/
  return dispatch => {
    dispatch(surveyStart());
    axios({
      method: "get",
      url: `${HOSTNAME}/survey/getQuestions/${lang}/${sex}/`,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        const questions = res.data;
        dispatch(
          surveySuccessQuestionsReceived(
            name,
            sex,
            password,
            "admin",
            questions
          )
        );
      })
      .catch(err => {
        dispatch(surveyFail(err));
      });
  };
};

// This UserName is the name of user is being poing
export const surveyGet = uuid => {
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
        dispatch(surveySuccessReceivedSurvey(survey, "user"));
        dispatch(setLanguage(survey.lang));
      })
      .catch(err => {
        dispatch(surveyFail(err));
      });
  };
};

export const surveyCreate = (
  name,
  lang,
  sex,
  password,
  questions,
  realAnswers
) => {
  return dispatch => {
    dispatch(surveyStart());
    axios({
      method: "post",
      data: {
        name: name,
        lang: lang,
        sex: sex,
        password: password,
        questions: questions,
        realAnswers: realAnswers
      },
      url: `${HOSTNAME}/survey/`,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        const data = res.data;
        // const token = res.data.key;
        // const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        // localStorage.setItem("token", token);
        // localStorage.setItem("expirationDate", expirationDate);
        dispatch(surveySuccessCreated(data.uuid));

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
        dispatch(surveySuccessUpdated());
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
        dispatch(surveySuccessUpdated());
      })
      .catch(err => {
        dispatch(surveyFail(err));
      });
  };
};
