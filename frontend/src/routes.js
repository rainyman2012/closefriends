import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

// import Login from "./containers/Login";
import StartSurvey from "./containers/StartSurvey";
import ThankFul from "./components/ThankFul";
import CreateSurvey from "./containers/CreateSurvey";
import RemoveSurvey from "./containers/RemoveSurvey";
import ResultSurvey from "./containers/ResultSurvey";
import PreCreate from "./containers/PreCreate";
import DetailResult from "./containers/DetailResult";
import AnalyzeSurvey from "./containers/AnalyzeSurvey";
import LoginForm from "./containers/Login";

import LinkRecovery from "./containers/LinkRecovery";
import TestCookie from "./containers/TestCookie";
import TestLocalStorage from "./containers/TestLocalStorage";
import SignUpForm from "./containers/Signup";
import Dashboard from "./containers/dashboard";
import Survey from "./containers/Survey";
import Homepage from "./containers/Home";
import ProtectRoute from "./ProtectRoute";

// class AllRoutes extends Component {
//   render() {
//     return (
//       <Switch>
//         <Route path='/login' component={Login} />
//         <ProtectedRoute path='/welcome' component={Welcome} />
//       </Switch>
//     )
//   }
//}

const BaseRouter = () => {
  return (
    <Hoc>
      {/* 
      <Route path="/signup" component={Signup} /> */}
      <Route exact path="/thankful" component={ThankFul} />
      <Route exact path="/create/:uuid" component={CreateSurvey} />
      <Route exact path="/remove" component={RemoveSurvey} />
      <Route path="/login" component={LoginForm} />
      {/* Here is a trick for getting to appropriate component. if our assignment_cookies exists 
      we find out we must go to admin page else we must go to surveying other user. */}

      <Route exact path="/result/:uuid" component={ResultSurvey} />
      <Route exact path="/detailResult/:uuid/:pk" component={DetailResult} />
      <Route exact path="/analyze/:uuid/:pk" component={AnalyzeSurvey} />
      <Route exact path="/recovery" component={LinkRecovery} />
      <Route exact path="/su/:uuid" component={StartSurvey} />
      <Route exact path="/polling" component={Survey} />
      <Route exact path="/signup" component={SignUpForm} />
      <Route exact path="/precreate" component={PreCreate} />
      <Route exact path="/testcookie/:method" component={TestCookie} />
      <Route exact path="/local/:method" component={TestLocalStorage} />
      <ProtectRoute
        exact
        path="/dashboard"
        component={Dashboard}
      ></ProtectRoute>
      <Route exact path="/" component={Homepage} />
    </Hoc>
  );
};

export default BaseRouter;
