import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

// import Login from "./containers/Login";
// import Signup from "./containers/Signup";
import StartSurvey from "./containers/StartSurvey";
import ThankFul from "./components/ThankFul";
import CreateSurvey from "./containers/CreateSurvey";
import RemoveSurvey from "./containers/RemoveSurvey";
import ResultSurvey from "./containers/ResultSurvey";
import PreCreate from "./containers/PreCreate";
import DetailResult from "./containers/DetailResult";
import AnalyzeSurvey from "./containers/AnalyzeSurvey";
import LinkRecovery from "./containers/LinkRecovery";
import TestCookie from "./containers/TestCookie";

import Survey from "./containers/Survey";

/* <Route exact path="/survey/:uuid" component={ResultSurvey} /> */

const BaseRouter = () => {
  return (
    <Hoc>
      {/* <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} /> */}
      <Route exact path="/thankful" component={ThankFul} />
      <Route exact path="/create/:uuid" component={CreateSurvey} />
      <Route exact path="/remove" component={RemoveSurvey} />

      {/* Here is a trick for getting to appropriate component. if our assignment_cookies exists 
      we find out we must go to admin page else we must go to surveying other user. */}

      <Route exact path="/result/:uuid" component={ResultSurvey} />
      <Route exact path="/detailResult/:uuid/:pk" component={DetailResult} />
      <Route exact path="/analyze/:uuid/:pk" component={AnalyzeSurvey} />
      <Route exact path="/recovery" component={LinkRecovery} />

      <Route exact path="/su/:uuid" component={StartSurvey} />

      <Route exact path="/polling" component={Survey} />
      <Route exact path="/" component={PreCreate} />
      <Route exact path="/precreate" component={PreCreate} />
      <Route exact path="/testcookie/:method" component={TestCookie} />
      {/* <Route exact path="/create" component={HomepageLayout} /> */}
    </Hoc>
  );
};

export default BaseRouter;

{
  /* <Route
  path='/dashboard'
  component={() => <Dashboard isAuthed={true} />}
/> */
}
{
  /* <Route
  path='/dashboard'
  render={(props) => <Dashboard {...props} isAuthed={true} />}
/> */
}
