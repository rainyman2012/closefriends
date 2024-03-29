import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { logout } from "../store/actions/auth";
import { Row, Col, Menu, Select, Icon, Steps, Button, message } from "antd";
import { Lang as T } from "../languages";

// const getWidth = () => {
//   const isSSR = typeof window === "undefined";
//   return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
// };

class HomepageLayout extends Component {
  handleGetSurvey = e => {
    this.props.getSurvey();
  };

  handlePostSurvey = e => {
    this.props.setSurvey("Ehsan");
  };

  render() {
    return <p>Home</p>;
  }
}

// const mapStateToProps = state => {
//   return {
//     authenticated: !!state.auth.token
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     logout: () => dispatch(logout())
//   };
// };

export default withRouter(
  connect(
    null,
    null
  )(HomepageLayout)
);
