import React, { Component } from "react";
import Cookies from "universal-cookie";

class RemoveSurvey extends Component {
  render() {
    const cookies = new Cookies();
    const assignment_cookie = cookies.get("assignments");

    if (assignment_cookie) {
      cookies.remove("assignments", { path: "/" });
      return <p>removeing {assignment_cookie}</p>;
    }

    return <p> {assignment_cookie} assignement successfully removed </p>;
  }
}

export default RemoveSurvey;
