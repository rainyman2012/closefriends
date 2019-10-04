import axios from "axios";
import * as actionType from "./actionTypes";
import { HOSTNAME } from "../../static";
import { setLanguage } from "./general";

//==================================================== Statistics

export const statisticsStart = () => {
  return {
    type: actionType.STATISTICS_START
  };
};

export const statisticsSuccessReceived = (statistics, type) => {
  return {
    type: actionType.STATISTICS_SUCCESS,
    userName: statistics.name,
    userType: type,
    statistics: statistics
  };
};

export const statisticsFail = error => {
  return {
    type: actionType.STATISTICS_FAIL,
    error: error
  };
};

// This UserName is the name of user is being poing
export const getStatisticsData = uuid => {
  return dispatch => {
    dispatch(statisticsStart());
    axios({
      method: "get",
      url: `${HOSTNAME}/survey/statistics/${uuid}/`,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        const statistic = res.data;
        dispatch(statisticsSuccessReceived(statistic, "admin"));
        dispatch(setLanguage(statistic.lang));
      })
      .catch(err => {
        dispatch(statisticsFail(err));
      });
  };
};

// This UserName is the name of user is being poing
export const getSimpleStatisticsData = uuid => {
  return dispatch => {
    dispatch(statisticsStart());
    axios({
      method: "get",
      url: `${HOSTNAME}/survey/simplestat/${uuid}/`,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        const statistic = res.data;
        dispatch(statisticsSuccessReceived(statistic, "user"));
        dispatch(setLanguage(statistic.lang));
      })
      .catch(err => {
        dispatch(statisticsFail(err));
      });
  };
};
