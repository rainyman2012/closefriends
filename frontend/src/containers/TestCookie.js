import React, { Component } from "react";
import Cookies from "universal-cookie";

class TestCookie extends Component {
  setCookie1 = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie =
      cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
  };
  getCookie1 = cname => {
    var name = cname + "=";
    var cookie = document.cookie;
    var ca = cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return decodeURIComponent(c.substring(name.length, c.length));
      }
    }
    return "";
  };

  setModernCookie = (name, value) => {
    const cookies = new Cookies();
    cookies.set(name, value, {
      path: "/"
    });
  };

  getModernCookie = name => {
    const cookies = new Cookies();
    return cookies.get(name);
  };

  render() {
    let value = "";
    let message = "";
    switch (this.props.match.params.method) {
      case "legacySet":
        this.setCookie1("legacyTest", "Ehsan_legacy");
        message = "Legacy cookie have set ...";
        break;
      case "legacyGet":
        value = this.getCookie1("legacyTest");
        message = `Legacy test have been got: ${value}`;
        break;
      case "modernSet":
        this.setModernCookie("modernTest", "Ehsan_modern");
        message = "Modern cookie have set ...";
        break;
      case "modernGet":
        value = this.getModernCookie("modernTest");
        message = `Modern test have been got: ${value}`;
        break;
      case "modernAllGet":
        const cookies = new Cookies();
        message = JSON.stringify(cookies.getAll());
        break;
      default:
        break;
    }

    return <p>${message}</p>;
  }
}

export default TestCookie;
