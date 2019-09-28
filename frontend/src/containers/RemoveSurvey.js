import React, { Component } from "react";
import Cookies from "universal-cookie";

class RemoveSurvey extends Component {
  render() {
    const cookies = new Cookies();

    cookies.remove("assignments", { path: "/" });
    cookies.remove("expired", { path: "/" });

    return <p>removeing </p>;

    return <p> assignement successfully removed </p>;
  }
}

export default RemoveSurvey;
