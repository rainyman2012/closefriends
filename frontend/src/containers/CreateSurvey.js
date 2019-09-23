import React, { Component } from "react";
import Cookies from "universal-cookie";

class CreateSurvey extends Component {
  render() {
    const cookies = new Cookies();
    cookies.set("assignments", `EHS_${this.props.match.params.uuid}`, {
      path: "/"
    });

    return <p>Created</p>;
  }
}

export default CreateSurvey;
