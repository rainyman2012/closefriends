import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import "antd/dist/antd.css";
// import "./stylesheets/form.css";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import surveyReducer from "./store/reducers/survey";
import statisticsReducer from "./store/reducers/statistics";
import generalReducer from "./store/reducers/general";
import authReducer from "./store/reducers/auth";
import "font-awesome/css/font-awesome.min.css";

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  survey: surveyReducer,
  statistics: statisticsReducer,
  general: generalReducer,
  auth: authReducer
});

const store = createStore(rootReducer, composeEnhances(applyMiddleware(thunk)));

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

registerServiceWorker();
