import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Hoc from "../hoc/hoc";
import { getStatisticsData } from "../store/actions/statistics";
import { Button, Row, Col, Spin } from "antd";
import { Table, Progress, Tag } from "antd";
import Cookies from "universal-cookie";
import { Lang as T } from "../languages";

function renderColumn(page_texts) {
  const columns = [
    {
      title: page_texts.nameColumn,
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"]
    },
    {
      title: page_texts.answerColumn,
      dataIndex: "total_correct",
      key: "total_correct",
      sorter: (a, b) => a.total_correct - b.total_correct,
      align: "center"
    },

    {
      title: page_texts.percentageColumn,
      dataIndex: "correct_percentage",
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
    }
  ];
  return columns;
}
class ResultSurvey extends Component {
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

  render() {
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
                columns={renderColumn(page_texts)}
              />
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col>
              <hr />
              <p style={rtl_support}>
                {page_texts.totalQuestionTxt} :{" "}
                {this.props.statistics.total_questions}
              </p>
              <p style={rtl_support}>
                {page_texts.totalParticipantsTxt}:{" "}
                {this.props.statistics.participant_count}
              </p>
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
    // userName: state.survey.userName,
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
