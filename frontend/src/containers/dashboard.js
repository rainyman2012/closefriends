import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link, Redirect } from "react-router-dom";
import { getUserDetail } from "../store/actions/auth";
import {
  Row,
  Col,
  Avatar,
  Select,
  Icon,
  Steps,
  Button,
  message,
  Spin
} from "antd";
import { Lang as T } from "../languages";
import "../stylesheets/dashboard.css";
// const getWidth = () => {
//   const isSSR = typeof window === "undefined";
//   return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
// };

class Dashboard extends Component {
  state = {
    access: {
      general: true,
      marriage: false
    }
  };

  componentWillMount(nextProps, nextState) {
    console.log("im in update");

    if (this.props.token) {
      console.log("this token", this.props.token);

      this.props.getUserDetail(this.props.token);
    }
  }

  handleGetSurvey = e => {
    this.props.getSurvey();
  };

  handlePostSurvey = e => {
    this.props.setSurvey("Ehsan");
  };
  render() {
    if (this.props.loading) {
      return <Spin />;
    }

    if (!this.props.token || !this.props.user) {
      return <Spin />;
    }
    var marriage_part = null;
    if (
      this.props.user.permissions.indexOf("create_marriage_survey") == -1 &&
      this.props.user.permissions.indexOf("All") == -1
    ) {
      marriage_part = (
        <Col style={{ margin: "10px" }}>
          <img
            className="marriageBtn notPayed"
            width="200"
            height="100"
            onLoad={this.handlePermission}
            onclick={this.handleMarriageSubmit}
          />
          <div class="middle">
            <div class="text">خرید</div>
          </div>
        </Col>
      );
    } else {
      marriage_part = (
        <Col style={{ margin: "10px" }}>
          <img
            className="marriageBtn payed"
            width="200"
            height="100"
            onLoad={this.handlePermission}
            onclick={this.handleMarriageSubmit}
          />
        </Col>
      );
    }

    return (
      <React.Fragment>
        <Row type="flex" justify="center">
          <Col>
            <Avatar
              size={74}
              src={this.props.user.profile.image}
              style={{ position: "center center'" }}
            />
            <hr />
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col style={{ margin: "10px" }}>
            <img
              className="generalBtn"
              width="200"
              height="100"
              onclick={this.handleGeneralSubmit}
            />
          </Col>
          {marriage_part}
        </Row>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    user: state.auth.user,
    loading: state.auth.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserDetail: token => dispatch(getUserDetail(token))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
);
