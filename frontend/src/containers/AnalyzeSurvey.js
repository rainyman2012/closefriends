import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Hoc from "../hoc/hoc";
import { getStatisticsData } from "../store/actions/statistics";
import { Collapse, message, Row, Col, Spin } from "antd";
import Cookies from "universal-cookie";
import "../stylesheets/DetailResult.css";
import { Lang as T } from "../languages";

const { Panel } = Collapse;

class AnalyzeSurvey extends Component {
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
    let expandIconPosition = "left";
    if (this.props.language === "fa") {
      expandIconPosition = "right";
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
      const temp = this.props.statistics.questions[
        cur.questionIndex
      ].analyze.replace(/'/g, '"');

      const parsedAnalyzeField = JSON.parse(temp)[0];
      prev.push({
        key: cur.questionIndex,
        question: this.props.statistics.questions[cur.questionIndex].name,
        shortDescAnalyze: parsedAnalyzeField.short,
        longDescAnalyze: parsedAnalyzeField.long,
        correct: cur.correct
      });
      return prev;
    }, []);

    console.log("dataSource", dataSource);

    return (
      <Hoc>
        <div>
          Ehsan
          <h4 align="center">{detailAnswer.name}</h4>
          <hr />
          <Row>
            <Col>
              <Collapse accordion expandIconPosition={expandIconPosition}>
                {dataSource.map(data => {
                  return (
                    <Panel
                      key={data.key}
                      header={React.createElement(
                        "p",
                        { style: rtl_support },
                        data.shortDescAnalyze
                      )}
                    >
                      <p style={rtl_support}>{data.longDescAnalyze}</p>
                    </Panel>
                  );
                })}
              </Collapse>
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
  )(AnalyzeSurvey)
);
