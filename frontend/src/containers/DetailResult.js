import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import Hoc from "../hoc/hoc";
import { getStatisticsData } from "../store/actions/statistics";
import { Button, Row, Col, Spin } from "antd";
import { Table, Progress, message } from "antd";
import Cookies from "universal-cookie";
import "../stylesheets/DetailResult.css";
import { Lang as T } from "../languages";

import { HOSTNAME } from "../static";

function renderColumn(page_texts, name, lang) {
  console.log("lang", lang);
  let align = "left";
  if (lang === "fa") align = "right";
  const columns = [
    {
      title: page_texts.question,
      dataIndex: "question",
      key: "question",
      width: "50%",
      align: align,
      sorter: (a, b) => a.question.length - b.question.length,
      sortDirections: ["descend"]
    },
    {
      title: page_texts.userAnswer.replace("{}", name),
      dataIndex: "choiceImage",
      key: "choiceImage",
      className: "antColor",
      sorter: (a, b) => a.choiceImage - b.choiceImage,
      align: "center",
      render: (choiceImage, record) => {
        let backColor = "red";
        if (record.correct) backColor = "green";
        return (
          <div className="answerImage" style={{ backgroundColor: backColor }}>
            <img
              className="detailSurveyImage"
              alt=""
              src={HOSTNAME + choiceImage}
            />
          </div>
        );
      }
    }
  ];
  return columns;
}
class DetailResult extends Component {
  state = {
    access: false
  };

  componentWillMount() {
    const cookies = new Cookies();
    const assignments = cookies.get("assignments");
    if (assignments && assignments === `EHS_${this.props.match.params.uuid}`)
      this.setState({ access: true });
    // get data from server ...
    this.props.getStatistics(this.props.match.params.uuid);
  }

  copyToClipBoard = (e, msg) => {
    /* Select the text field */
    e.target.select();
    /* Copy the text inside the text field */
    document.execCommand("copy");
    // I prefer to not show the the whole text area selected.
    e.target.blur();
    message.success(msg);
  };

  createDataSource = id => {
    console.log(id);
  };

  render() {
    const localhost = window.location.hostname;
    const general_texts = T[this.props.language];
    const page_texts = T[this.props.language].detailResult;

    let rtl_support = null;
    if (this.props.language === "fa") {
      rtl_support = {
        textAlign: "right"
      };
    }
    if (!this.state.access) {
      return (
        <div style={{ textAlign: "center" }}>
          <p>{general_texts.accessError}</p>
        </div>
      );
    }

    if (this.props.serverError)
      return (
        <div style={{ textAlign: "center" }}>
          <p>{general_texts.notFoundError}</p>
        </div>
      );

    if (this.props.loading || !this.props.statistics)
      return (
        <div style={{ textAlign: "center" }}>
          <Spin />
          <p>{general_texts.loading} ...</p>
        </div>
      );

    console.log("allStatistics", this.props.statistics);
    if (this.props.statistics.answers.length <= 0)
      return <p> There is no answerer</p>;

    const detailAnswer = this.props.statistics.answers.filter(answer => {
      return answer.id == this.props.match.params.pk;
    })[0];
    console.log("detailAnswer", detailAnswer);
    const answers = JSON.parse(detailAnswer.answers);

    // This reduce create a list of objects that include questionText and correspond user answer image for example:
    // [{question: "TEXT", choiceImage: "IMAGE ADDRESS"}, ...]

    const dataSource = answers.reduce((prev, cur) => {
      const questionChoices = this.props.statistics.questions[cur.questionIndex]
        .choices;

      console.log("quesitonChoices", questionChoices);
      const userChoice = questionChoices.filter(
        choice => choice.id === cur.choice
      )[0];

      console.log("userChoice", userChoice);

      prev.push({
        question: this.props.statistics.questions[cur.questionIndex].name,
        choiceImage: userChoice.image,
        correct: cur.correct
      });
      return prev;
    }, []);

    return (
      <Hoc>
        <div>
          <h4 align="center">{detailAnswer.name}</h4>
          <hr />
          <Row>
            <Col>
              <Table
                pagination={{ pageSize: 5 }}
                dataSource={dataSource}
                columns={renderColumn(
                  page_texts,
                  detailAnswer.name,
                  this.props.statistics.lang
                )}
              />
            </Col>
          </Row>
          <Row type="flex" justify="center" style={{ marginTop: "10px" }}>
            <Col span={23}>
              <hr />
              <div style={{ textAlign: "center" }}>
                <span>&#128071;</span>
                <span>&#128071;</span>
                <span>&#128071;</span>
                <span>&#128071;</span>
              </div>

              <p style={rtl_support}>{page_texts.toResult}</p>
              <textarea
                style={{ width: "100%" }}
                onClick={(e, msg = page_texts.copied) =>
                  this.copyToClipBoard(e, msg)
                }
              >{`http://${localhost}/su/${this.props.statistics.uuid}`}</textarea>
              <hr />
              <div align="center">
                {this.props.statistics.is_paid ? (
                  <Link
                    to={`/analyze/${this.props.statistics.uuid}/${this.props.match.params.pk}`}
                  >
                    <Button>{page_texts.analyze}</Button>
                  </Link>
                ) : (
                  <React.Fragment>
                    <p style={{ align: "center" }}>
                      {page_texts.adv_to_payment}
                    </p>
                    <button>{page_texts.payment}</button>
                  </React.Fragment>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Hoc>
    );
  }
}

const mapStateToProps = state => {
  return {
    statistics: state.statistics.statistics,
    serverError: state.statistics.error,
    userType: state.statistics.userType,
    loading: state.statistics.loading,
    language: state.general.language
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getStatistics: uuid => dispatch(getStatisticsData(uuid))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailResult)
);
