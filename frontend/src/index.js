import React from "react";
import ReactDOM from "react-dom";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import App from "./App";
import "antd/dist/antd.css";

import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import surveyReducer from "./store/reducers/survey";
import statisticsReducer from "./store/reducers/statistics";
import generalReducer from "./store/reducers/general";
import "font-awesome/css/font-awesome.min.css";

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  survey: surveyReducer,
  statistics: statisticsReducer,
  general: generalReducer
});

// optional cofiguration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 5000,
  offset: "30px",
  // you can also just use 'scale'
  transition: transitions.SCALE
};

const store = createStore(rootReducer, composeEnhances(applyMiddleware(thunk)));

const app = (
  <AlertProvider template={AlertTemplate} {...options}>
    <Provider store={store}>
      <App />
    </Provider>
  </AlertProvider>
);

ReactDOM.render(app, document.getElementById("root"));

registerServiceWorker();
