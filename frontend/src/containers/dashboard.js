import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link, Redirect } from "react-router-dom";
import { logout } from "../store/actions/auth";
import { Row, Col, Menu, Select, Icon, Steps, Button, message } from "antd";
import { Lang as T } from "../languages";

// const getWidth = () => {
//   const isSSR = typeof window === "undefined";
//   return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
// };

class Dashboard extends Component {
  componentWillMount() {
    if (!this.props.authenticated) this.props.history.push("/login");
  }
  handleGetSurvey = e => {
    this.props.getSurvey();
  };

  handlePostSurvey = e => {
    this.props.setSurvey("Ehsan");
  };

  render() {
    return <p>dashboard</p>;
  }
}

const mapStateToProps = state => {
  return {
    authenticated: !!state.auth.token
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     changeColor: color => dispatch(changeColor(color)),
//     logout: () => dispatch(logout())
//   };
// };

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(Dashboard)
);
