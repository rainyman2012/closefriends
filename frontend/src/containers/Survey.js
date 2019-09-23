import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  surveyUpdateUserAnswerData,
  surveyUpdateRealAnswerData
} from "../store/actions/survey";

import Hoc from "../hoc/hoc";
import Question from "../components/Question";
import "../stylesheets/index.css";
import { Button, Row, Col, Slider, Icon, Spin } from "antd";

import Cookies from "universal-cookie";
import { Lang as T } from "../languages";

class Survey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      currentQuestion: 0,
      disabled: true,
      answers: [],
      size: "large"
    };
  }

  componentDidUpdate(preProps, preState) {
    if (
      this.props.currentSurvey !== preProps.currentSurvey ||
      this.props.userType !== preProps.userType
    ) {
      if (this.props.userType == "admin") {
        const cookies = new Cookies();
        cookies.set("assignments", `EHS_${this.props.currentSurvey.uuid}`, {
          path: "/"
        });
      }
    }
  }

  arrayItemRemove(arr, cindex) {
    return arr.filter(function(ele, index) {
      return index !== cindex;
    });
  }

  onChange = checked => {
    this.setState({ loading: !checked });
  };

  onNext = () => {
    const currentQuestion = this.state.currentQuestion + 1;
    let isDisable = false;
    const findAssociateAnswer = this.state.answers.findIndex(
      question => question.questionIndex === currentQuestion
    );
    if (findAssociateAnswer < 0) isDisable = true;
    this.setState({ currentQuestion, disabled: isDisable });
  };

  onPrev = () => {
    const currentQuestion = this.state.currentQuestion - 1;
    this.setState({ currentQuestion });
  };

  onDone = () => {
    if (this.props.userType != "admin") {
      this.props.setUserAnswerSurvey(
        this.props.currentSurvey.uuid,
        this.state.answers,
        this.props.userName
      );

      const cookies = new Cookies();
      let expired = cookies.get("expired");
      if (expired) expired = `${expired},${this.props.currentSurvey.uuid}`;
      else expired = this.props.currentSurvey.uuid;

      cookies.set("expired", expired, {
        path: "/"
      });
    } else {
      this.props.setRealAnswerSurvey(
        this.props.currentSurvey.uuid,
        this.state.answers
      );
    }

    this.props.history.push(`/thankful`);

    // this.props.history.push("/thankful");
  };

  onQuestionChange = currentQuestion => {
    this.setState({ currentQuestion });
  };

  onAnswerSelected = choice => {
    const questionIndex = this.state.currentQuestion;

    const findQuestionIndex = this.state.answers.findIndex(
      question => question.questionIndex === questionIndex
    );

    const findChoiceIndex = this.state.answers.findIndex(
      question =>
        question.questionIndex === questionIndex &&
        question.choice.id === choice.id
    );

    let isDisable = true;

    if (findQuestionIndex < 0 && findChoiceIndex < 0) {
      this.state.answers.push({
        questionIndex: questionIndex,
        questionId: this.props.currentSurvey.questions[questionIndex].id,
        choice: choice.id
      });

      isDisable = false;
    } else if (findQuestionIndex >= 0 && findChoiceIndex < 0) {
      this.state.answers.splice(findQuestionIndex, 1);

      this.state.answers.push({
        questionIndex: questionIndex,
        questionId: this.props.currentSurvey.questions[questionIndex].id,
        choice: choice.id
      });

      isDisable = false;
    } else this.state.answers.splice(findQuestionIndex, 1);

    this.setState({
      answers: this.state.answers,
      disabled: isDisable
    });
  };

  render() {
    const { currentSurvey } = this.props;
    const { currentQuestion } = this.state;
    const { size } = this.state;
    // Get the proper language setting by T object
    const general_texts = T[this.props.language];
    const page_texts = T[this.props.language].survey;

    if (this.props.serverError)
      return (
        <div style={{ textAlign: "center" }}>
          <p>{general_texts.serverError}</p>
        </div>
      );

    if (this.props.loading)
      return (
        <div style={{ textAlign: "center" }}>
          <Spin />
          <p>{general_texts.loading} ...</p>
        </div>
      );

    let rtl_support = null;

    if (this.props.language === "fa")
      rtl_support = {
        textAlign: "right"
      };
    if (!currentSurvey)
      return (
        <div style={{ textAlign: "center" }}>
          <p>{general_texts.nothingError}...</p>
        </div>
      );

    const { questions } = currentSurvey;
    if (!questions) return null;

    const markers = questions.reduce((previous, current, index) => {
      previous[index] = index + 1;
      return previous;
    }, {});

    return (
      <Hoc>
        <p style={{ textAlign: "center" }}>
          {page_texts.hi} {this.props.userName}
        </p>
        <p style={rtl_support}>{page_texts.fillout}</p>
        {this.props.userType == "user" ? (
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
        ) : null}
        <Row gutter={16}>
          <Col>
            <Slider
              disabled
              min={0}
              max={questions.length - 1}
              value={currentQuestion}
              onChange={this.onQuestionChange}
              marks={markers}
              step={null}
            />
          </Col>
        </Row>

        <Question
          userType={this.props.userType}
          survey={this.props.currentSurvey}
          language={this.props.language}
          key={currentQuestion}
          question={questions[currentQuestion]}
          onAnswer={this.onAnswerSelected}
          currentChoice={this.state.answers.find(
            answer => answer.questionIndex === currentQuestion
          )}
        />

        <Row
          type="flex"
          gutter={16}
          justify="center"
          style={{ marginTop: "50px" }}
        >
          {currentQuestion > 0 && (
            <Col>
              <Button type="primary" onClick={this.onPrev}>
                {page_texts.prev}
              </Button>
            </Col>
          )}

          {currentQuestion === questions.length - 1 && (
            <Col>
              <Button
                type="primary"
                onClick={this.onDone}
                disabled={this.state.disabled}
              >
                {page_texts.done}
              </Button>
            </Col>
          )}
          {currentQuestion < questions.length - 1 && (
            <Col>
              <Button
                type="primary"
                onClick={this.onNext}
                disabled={this.state.disabled}
              >
                {page_texts.next}
              </Button>
            </Col>
          )}
        </Row>
      </Hoc>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.survey.loading,
    currentSurvey: state.survey.currentSurvey,
    userName: state.survey.userName,
    serverError: state.survey.error,
    error: state.survey.error,
    userType: state.survey.userType,
    language: state.general.language
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUserAnswerSurvey: (uuid, answers, name) =>
      dispatch(surveyUpdateUserAnswerData(uuid, answers, name)),
    setRealAnswerSurvey: (uuid, answers) =>
      dispatch(surveyUpdateRealAnswerData(uuid, answers))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Survey)
);

// <p>{cookies.get("assignment")}</p>

// this.history.pushState(null, 'login');
//    this.props.history.push(`/target`)
