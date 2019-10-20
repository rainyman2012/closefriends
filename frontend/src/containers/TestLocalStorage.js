import React, { Component } from "react";
import Cookies from "universal-cookie";

class TestCookie extends Component {
  setLocal = (cname, cvalue) => {
    localStorage.setItem(cname, cvalue);
  };
  getLocal = cname => {
    return localStorage.getItem(cname);
  };

  render() {
    let value = "";
    let message = "";
    switch (this.props.match.params.method) {
      case "set":
        this.setLocal("LOCALS", "Ehsan_legacy");
        message = "Ehsan_legacy has been pu in Local Storage ...";
        break;
      case "get":
        value = this.getLocal("LOCALS");
        message = `Local Storage have been got: ${value}`;
        break;
      default:
        break;
    }

    return <p>${message}</p>;
  }
}

export default TestCookie;
