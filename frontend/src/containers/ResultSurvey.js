import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import Hoc from "../hoc/hoc";
import { getStatisticsData } from "../store/actions/statistics";
import { Button, Row, Col, Spin } from "antd";
import { Table, Progress, message } from "antd";
import Cookies from "universal-cookie";
import { Lang as T } from "../languages";

function renderColumn(page_texts, uuid) {
  const columns = [
    {
      title: page_texts.nameColumn,
      dataIndex: "name",
      key: "name",
      width: "25%",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"]
    },
    {
      title: page_texts.answerColumn,
      dataIndex: "total_correct",
      width: "15%",
      key: "total_correct",
      sorter: (a, b) => a.total_correct - b.total_correct,
      align: "center"
    },

    {
      title: page_texts.percentageColumn,
      dataIndex: "correct_percentage",
      width: "25%",
      key: "total_percentage",
      sorter: (a, b) => a.correct_percentage - b.correct_percentage,
      align: "left",
      render: correct_percentage => {
        let custom_color = "";
        if (correct_percentage >= 50) custom_color = "green";
        else custom_color = "red";

        return (
          <Progress
            type="circle"
            percent={correct_percentage}
            width={40}
            strokeColor={custom_color}
            format={percent => {
              return (
                <spam style={{ fontSize: "10px" }}>{Math.round(percent)}%</spam>
              );
            }}
          />
        );
      }
    },
    {
      title: page_texts.detail,
      width: "10%",
      align: "center",
      render: (text, record) => {
        return (
          <Link
            to={`/detailResult/${uuid}/${record.id}`}
            style={{
              backgroundColor: "green",
              color: "black",
              padding: "5px",
              borderRadius: "5px"
            }}
          >
            {page_texts.detail}
          </Link>
        );
      }
    }
  ];
  return columns;
}
class ResultSurvey extends Component {
  state = {
    access: false
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

  componentDidUpdate(prevProps, prevState) {
    if (this.props.language !== prevProps.language) {
      this.setLanguage();
    }
  }

  render() {
    const localhost = window.location.hostname;
    const general_texts = T[this.props.language];
    const page_texts = T[this.props.language].resultSurvey;

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

    return (
      <Hoc>
        <div>
          <Row>
            <Col>
              <Table
                pagination={{ pageSize: 5 }}
                dataSource={this.props.statistics.answers}
                columns={renderColumn(page_texts, this.props.statistics.uuid)}
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
                <p>
                  {page_texts.totalQuestionTxt} :{" "}
                  {this.props.statistics.total_questions}
                </p>
                <p>
                  {page_texts.totalParticipantsTxt}:{" "}
                  {this.props.statistics.participant_count}
                </p>
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
  )(ResultSurvey)
);
