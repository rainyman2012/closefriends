import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { surveyGetQuestions } from "../store/actions/survey";
import { setLanguage } from "../store/actions/general";
import { Input, Button, Icon, Row, Col, Spin } from "antd";
import { Menu, Dropdown, message } from "antd";
import Hoc from "../hoc/hoc";
import { Lang as T } from "../languages";
import Cookies from "universal-cookie";

class PreCreate extends Component {
  state = {
    size: "large",
    enterNameError: false,
    enterSexError: false,
    enterPasswordError: false,
    sex: ""
  };

  handleStartBtn = e => {
    const name = document.getElementById("nameInput").value;
    const password = document.getElementById("passwordInput").value;
    let state = {
      enterNameError: false,
      enterSexError: false,
      enterPasswordError: false
    };
    if (!password) state.enterPasswordError = true;
    if (!name) state.enterNameError = true;
    if (!this.state.sex) state.enterSexError = true;

    this.setState(state);

    if (!state.enterNameError && !state.enterSexError) {
      this.props.getQuestions(
        name,
        this.state.sex,
        this.props.language,
        password
      );
      this.props.history.push("/polling");
    }
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
    this.setLanguage();
  }

  handleLangMenuClick = e => {
    this.props.setLanguage(e.key);

    if (e.key === "en") {
      document.body.style.fontFamily = "Indie Flower";
      let htmlElement = document.getElementsByTagName("html")[0];
      htmlElement.dir = "ltr";
    } else {
      document.body.style.fontFamily = "Amiri";
      let htmlElement = document.getElementsByTagName("html")[0];
      htmlElement.dir = "rtl";
    }
  };

  handleSexMenuClick = e => {
    this.setState({ sex: e.key });
  };

  render() {
    const general_texts = T[this.props.language];
    const page_texts = T[this.props.language].precreate;

    const languageMenu = (
      <Menu onClick={this.handleLangMenuClick}>
        <Menu.Item key="fa">{T["fa"].languageName}</Menu.Item>
        <Menu.Item key="en">{T["en"].languageName}</Menu.Item>
      </Menu>
    );

    const sexMenu = (
      <Menu onClick={this.handleSexMenuClick}>
        <Menu.Item key="m">{page_texts.male}</Menu.Item>
        <Menu.Item key="f">{page_texts.female}</Menu.Item>
        <Menu.Item key="b">{page_texts.bisexual}</Menu.Item>
      </Menu>
    );
    let current_sex_name = page_texts.sex;

    if (this.state.sex) {
      switch (this.state.sex) {
        case "m":
          current_sex_name = page_texts.male;
          break;
        case "f":
          current_sex_name = page_texts.female;
          break;
        case "b":
          current_sex_name = page_texts.bisexual;
          break;
      }
    }

    const { size } = this.state;
    const { error } = this.state;

    let rtl_support = null;
    if (this.props.language === "fa")
      rtl_support = {
        textAlign: "right"
      };

    let errorStyle = null;

    if (this.props.serverError)
      return (
        <div style={{ textAlign: "center" }}>
          <p style={rtl_support}>{general_texts.serverError}</p>
        </div>
      );

    if (this.props.loading)
      return (
        <div style={{ textAlign: "center" }}>
          <Spin />
          <p style={rtl_support}>{general_texts.loading}</p>
        </div>
      );
    if (error) errorStyle = { borderColor: "#f5222d" };

    return (
      <Hoc>
        <Row type="flex" justify="center">
          <Col span={22}>
            <p style={rtl_support}>{page_texts.create}</p>

            <Input
              style={{ ...errorStyle, ...rtl_support }}
              id="nameInput"
              placeholder={page_texts.enterYourName}
            />
            {this.state.enterNameError ? (
              <p style={{ ...{ color: "#ffffff" }, ...rtl_support }}>
                {page_texts.enterNameErrorTxt}
              </p>
            ) : (
              ""
            )}
          </Col>
        </Row>

        <Row type="flex" justify="center" style={{ marginTop: "25px" }}>
          <Col span={22}>
            <Dropdown overlay={languageMenu}>
              <Button style={{ color: "red", width: "100%" }}>
                {general_texts.languageName} <Icon type="down" />
              </Button>
            </Dropdown>
          </Col>
        </Row>

        <Row type="flex" justify="center" style={{ marginTop: "25px" }}>
          <Col span={22}>
            <Dropdown overlay={sexMenu}>
              <Button style={{ color: "red", width: "100%" }}>
                {current_sex_name}
                <Icon type="down" />
              </Button>
            </Dropdown>
            {this.state.enterSexError ? (
              <p style={{ ...{ color: "#ffffff" }, ...rtl_support }}>
                {page_texts.enterSexErrorTxt}
              </p>
            ) : (
              ""
            )}
          </Col>
        </Row>
        <Row type="flex" justify="center" style={{ marginTop: "25px" }}>
          <Col span={22}>
            <Input.Password
              style={{ ...errorStyle, ...rtl_support }}
              id="passwordInput"
              placeholder={page_texts.enterYourPassword}
            />
            {this.state.enterPasswordError ? (
              <p style={{ ...{ color: "#ffffff" }, ...rtl_support }}>
                {page_texts.enterPasswordErrorTxt}
              </p>
            ) : (
              ""
            )}
          </Col>
        </Row>
        <Row style={{ marginTop: "50px" }} type="flex" justify="center">
          <Col span={22}>
            <Button
              type="primary"
              style={{ width: "100%" }}
              size={size}
              onClick={this.handleStartBtn}
            >
              <Icon
                type="heart"
                theme="filled"
                style={{
                  color: "#eb2f96",
                  marginRight: "5px",
                  marginLeft: "5px"
                }}
              />{" "}
              {page_texts.start}
            </Button>
          </Col>
        </Row>

        <Row style={{ marginTop: "10px" }} type="flex" justify="center">
          <Col span={22}>
            <Link
              to={{
                pathname: "/recovery",
                state: { suId: "" }
              }}
            >
              <Button type="primary" style={{ width: "100%" }} size={size}>
                {page_texts.recovery}
              </Button>
            </Link>
          </Col>
        </Row>
      </Hoc>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.survey.loading,
    serverError: state.survey.error,
    language: state.general.language
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getQuestions: (name, sex, lang, password) =>
      dispatch(surveyGetQuestions(name, sex, lang, password)),
    setLanguage: language => dispatch(setLanguage(language))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PreCreate)
);
