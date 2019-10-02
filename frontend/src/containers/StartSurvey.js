import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect, Link } from "react-router-dom";
import { surveyGet, surveySetUserName } from "../store/actions/survey";
import Cookies from "universal-cookie";

import { Input, Button, Icon, Row, Col, Spin } from "antd";
import Hoc from "../hoc/hoc";
import { Lang as T } from "../languages";

class StartSurvey extends Component {
  state = {
    size: "large",
    error: "",
    redirect_to: "",
    twiceAttendError: false
  };

  setLanguage() {
    let htmlElement = "";
    if (this.props.language === "fa") {
      document.body.style.fontFamily = "Amiri";

      htmlElement = document.getElementsByTagName("html")[0];
      htmlElement.dir = "rtl";
    } else {
      document.body.style.fontFamily = "Indie Flower";
      htmlElement = document.getElementsByTagName("html")[0];
      htmlElement.dir = "ltr";
    }
  }
  componentWillMount() {
    const cookies = new Cookies();
    const assignments = cookies.get("assignments");

    if (assignments && assignments === `EHS_${this.props.match.params.uuid}`)
      this.setState({ redirect_to: `/result/${this.props.match.params.uuid}` });

    // This is a list of UUIDes about users who you have surveyed and we
    // want to ban you from attending to survey you had already attended to that.
    const expired = cookies.get("expired");
    if (expired) {
      const expired_list = expired.split(",");
      if (expired_list.includes(this.props.match.params.uuid))
        this.setState({ twiceAttendError: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.language !== prevProps.language) {
      this.setLanguage();
    }
  }

  componentDidMount() {
    this.props.getSurvey(this.props.match.params.uuid);
  }

  handleStartBtn = e => {
    const name = document.getElementById("nameInput").value;
    const error = "You must set a value in this field";
    if (!name) {
      this.setState({ error });
      return;
    } else this.setState({ error: "" });

    this.props.setUserName(name);
    this.props.history.push("/polling");
  };

  render() {
    const { size } = this.state;
    const { error } = this.state;
    let errorStyle = null;

    const general_texts = T[this.props.language];
    const page_texts = T[this.props.language].startSurvey;

    if (this.state.twiceAttendError)
      return (
        <div style={{ textAlign: "center" }}>
          <Row type="flex" justify="center" style={{ marginBottom: "50px" }}>
            <Col>
              <Button
                type="success"
                size={size}
                onClick={() => this.props.history.push("/precreate")}
              >
                <Icon
                  type="heart"
                  theme="filled"
                  style={{ color: "#eb2f96" }}
                />
                {page_texts.createYourSurveyBtn}
              </Button>
            </Col>
          </Row>

          <p>{general_texts.twiceAttendError}... </p>
        </div>
      );

    if (this.props.serverError)
      return (
        <div style={{ textAlign: "center" }}>
          <p>{general_texts.notFoundError}... </p>
        </div>
      );

    if (this.props.loading || !this.props.currentSurvey)
      return (
        <div style={{ textAlign: "center" }}>
          <Spin />
          <p>{general_texts.loading} ...</p>
        </div>
      );

    if (this.props.language === "fa") {
      document.body.style.fontFamily = "Amiri";
      let htmlElement = document.getElementsByTagName("html")[0];
      htmlElement.dir = "rtl";
    } else {
      document.body.style.fontFamily = "Indie Flower";
      let htmlElement = document.getElementsByTagName("html")[0];
      htmlElement.dir = "ltr";
    }

    let rtl_support = null;
    if (this.props.language === "fa") {
      rtl_support = {
        textAlign: "right"
      };
    }

    if (this.state.redirect_to) return <Redirect to={this.state.redirect_to} />;
    if (error) errorStyle = { borderColor: "#f5222d" };

    return (
      <Hoc>
        <Row type="flex" justify="center" style={{ marginBottom: "50px" }}>
          <Col>
            <div>
              <p style={{ textAlign: "center" }}>
                {page_texts.welcome.replace(
                  "{}",
                  this.props.currentSurvey.name
                )}
              </p>
              <Button
                type="success"
                size={size}
                style={{ width: "200px", marginBottom: "5px" }}
                onClick={() => this.props.history.push("/precreate")}
              >
                <Icon
                  type="heart"
                  theme="filled"
                  style={{ color: "#eb2f96" }}
                />
                {page_texts.createYourSurveyBtn}
              </Button>
            </div>
          </Col>
          <Col>
            <Link to="/recovery">
              <Button type="success" style={{ width: "200px" }} size={size}>
                {page_texts.recovery}
              </Button>
            </Link>
          </Col>
        </Row>

        <Row type="flex" justify="center">
          <Col span={22}>
            <Input
              style={{ ...errorStyle, ...rtl_support }}
              id="nameInput"
              placeholder={page_texts.enterYourName}
            />
            {this.state.error ? (
              <p style={{ color: "#f5222d" }}>{this.state.error}</p>
            ) : (
              ""
            )}
          </Col>
        </Row>

        <Row style={{ marginTop: "50px" }} type="flex" justify="center">
          <Col span={12}>
            <Button
              type="primary"
              size={size}
              style={{ width: "100%" }}
              onClick={this.handleStartBtn}
            >
              <Icon type="heart" theme="filled" style={{ color: "#eb2f96" }} />{" "}
              {page_texts.start}
            </Button>
          </Col>
        </Row>
      </Hoc>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentSurvey: state.survey.currentSurvey,
    loading: state.survey.loading,
    serverError: state.survey.error,
    language: state.general.language
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSurvey: uuid => dispatch(surveyGet(uuid)),
    setUserName: userName => dispatch(surveySetUserName(userName))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StartSurvey)
);
