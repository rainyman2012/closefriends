import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter, Redirect, Link } from "react-router-dom";
import { surveyGetData, surveySetUserName } from "../store/actions/survey";
import Cookies from "universal-cookie";
import { HOSTNAME } from "../static";
import { Input, Button, Icon, Row, Col, message } from "antd";
import Hoc from "../hoc/hoc";
import { Lang as T } from "../languages";
import "../stylesheets/LinkRecovery.css";

class LinkRecovery extends Component {
  state = {
    suCode: "",
    size: "large",
    enterSuCodeError: "",
    enterPasswordError: "",
    verified: false,
    serverError: false
  };

  handleRecoverBtn = e => {
    const suCode = document.getElementById("suCodeInput").value;
    const password = document.getElementById("passwordInput").value;
    let state = {
      enterSuCodeError: false,
      enterPasswordError: false,
      suCode: suCode
    };
    if (!password) state.enterPasswordError = true;
    if (!suCode) state.enterSuCodeError = true;

    this.setState(state);

    if (!state.enterPasswordError && !state.enterSuCodeError) {
      axios({
        method: "post",
        data: {
          uuid: suCode,
          password: password
        },
        url: `${HOSTNAME}/survey/verify`,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          const verified = res.data;
          this.setState({ verified });
        })
        .catch(err => {
          this.setState({ serverError: true });
          console.log(err);
        });
    }
  };

  copyToClipBoard = (e, msg) => {
    /* Select the text field */
    e.target.select();
    /* Copy the text inside the text field */
    document.execCommand("copy");
    // I prefer to not show the the whole text area selected.
    e.target.blur();
    message.success(msg);
  };

  render() {
    const { size } = this.state;
    const { error } = this.state;
    let errorStyle = null;

    const general_texts = T[this.props.language];
    const page_texts = T[this.props.language].linkRecovery;

    if (this.state.serverError)
      return (
        <div style={{ textAlign: "center" }}>
          <p>{general_texts.serverError}... </p>
        </div>
      );

    let rtl_support = null;
    if (this.props.language === "fa") {
      rtl_support = {
        textAlign: "right"
      };
    }

    if (this.state.redirect_to) return <Redirect to={this.state.redirect_to} />;
    if (error) errorStyle = { borderColor: "#f5222d" };

    if (this.state.verified) {
      const cookies = new Cookies();
      cookies.set("assignments", `EHS_${this.state.suCode}`, {
        path: "/"
      });
    }

    return (
      <Hoc>
        <Row type="flex" justify="center" style={{ marginBottom: "50px" }}>
          <Col>
            <div style={{ textAlign: "center" }}>
              <h5 style={{ textAlign: "center" }}>{page_texts.caption}</h5>
              <img
                width="80%"
                className="SUCodeImage"
                src="http://localhost:8000/media/serial.png"
                alt=""
              />
            </div>
          </Col>
        </Row>

        <Row type="flex" justify="center">
          <Col span={22}>
            <Input
              style={{ ...errorStyle, ...rtl_support }}
              id="suCodeInput"
              placeholder={page_texts.enterYourSuCode}
            />
            {this.state.enterSuCodeError ? (
              <p style={{ color: "#f5222d" }}>
                {page_texts.enterSuCodeErrorTxt}
              </p>
            ) : (
              ""
            )}
          </Col>
        </Row>

        <Row type="flex" justify="center" style={{ marginTop: "10px" }}>
          <Col span={22}>
            <Input.Password
              style={{ ...errorStyle, ...rtl_support }}
              id="passwordInput"
              placeholder={page_texts.enterYourPassword}
            />
            {this.state.enterPasswordError ? (
              <p style={{ color: "#f5222d" }}>
                {page_texts.enterPasswordErrorTxt}
              </p>
            ) : (
              ""
            )}
          </Col>
        </Row>
        <Row style={{ marginTop: "50px" }} type="flex" justify="space-around">
          <Col span={8}>
            <Button
              type="primary"
              size={size}
              style={{ width: "100%" }}
              onClick={this.handleRecoverBtn}
            >
              {page_texts.recover}
            </Button>
          </Col>
          <Col span={8}>
            <Link to="/">
              <Button type="primary" size={size} style={{ width: "100%" }}>
                {page_texts.back}
              </Button>
            </Link>
          </Col>
        </Row>
        {this.state.verified ? (
          <Row style={{ marginTop: "50px" }} type="flex" justify="center">
            <Col span={23}>
              <div
                style={{
                  borderStyle: "solid",
                  borderWidth: "5px",
                  borderColor: "yellow",
                  padding: "10px",
                  textAlign: "center",
                  borderRadius: "10px"
                }}
              >
                <p style={{ textAlign: "center" }}>
                  {page_texts.successfulRecovery}
                </p>
                <textarea
                  style={{ width: "100%" }}
                  onClick={(e, msg = page_texts.copied) =>
                    this.copyToClipBoard(e, msg)
                  }
                >{`${HOSTNAME}/su/${this.state.suCode}`}</textarea>
              </div>
            </Col>
          </Row>
        ) : null}
      </Hoc>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentSurvey: state.survey.currentSurvey,
    loading: state.survey.loading,
    serverError: state.survey.error,
    verifiedPass: state.survey.verifiedPass,
    language: state.general.language
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSurvey: uuid => dispatch(surveyGetData(uuid)),
    setUserName: userName => dispatch(surveySetUserName(userName))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LinkRecovery)
);
