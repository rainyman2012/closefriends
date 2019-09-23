import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createSurvey } from "../store/actions/survey";
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
    sex: ""
  };

  handleStartBtn = e => {
    const name = document.getElementById("nameInput").value;
    let state = { enterNameError: false, enterSexError: false };

    if (!name) state.enterNameError = true;

    if (!this.state.sex) state.enterSexError = true;

    this.setState(state);

    if (!state.enterNameError && !state.enterSexError) {
      this.props.createSurvey(name, this.props.language, this.state.sex);
      this.props.history.push("/polling");
    }
  };

  handleLangMenuClick = e => {
    this.props.setLanguage(e.key);
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
              <p style={{ ...{ color: "#f5222d" }, ...rtl_support }}>
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
              <p style={{ ...{ color: "#f5222d" }, ...rtl_support }}>
                {page_texts.enterSexErrorTxt}
              </p>
            ) : (
              ""
            )}
          </Col>
        </Row>

        <Row style={{ marginTop: "50px" }} type="flex" justify="center">
          <Col span={12}>
            <Button
              type="primary"
              style={{ width: "100%" }}
              size={size}
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
    loading: state.survey.loading,
    serverError: state.survey.error,
    language: state.general.language
  };
};
const mapDispatchToProps = dispatch => {
  return {
    createSurvey: (name, lang, sex) => dispatch(createSurvey(name, lang, sex)),
    setLanguage: language => dispatch(setLanguage(language))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PreCreate)
);
