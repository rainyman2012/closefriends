import React, { Component } from "react";
import "../stylesheets/thankfull.css";
import { connect } from "react-redux";
import { withRouter, Link, Redirect } from "react-router-dom";
import { Table, Progress, Row, Col, Modal, message, Spin } from "antd";
import { Lang as T } from "../languages";
import parse from "html-react-parser";
import Cookies from "universal-cookie";
import { getSimpleStatisticsData } from "../store/actions/statistics";

// function withAlert(Component) {
//   return function WrappedComponent(props) {
//     const alert = useAlert();

//     return <Component {...props} myAlert={alert} />;
//   };
// }

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
    }
  ];
  return columns;
}

class ThankFul extends Component {
  state = { visible: false };
  showModal = () => {
    console.log("show modal");
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
      redirect_to_whatsup: false
    });
  };

  // to avoid re-rendering
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.currentSurvey.uuid !== nextProps.currentSurvey.uuid) {
      if (this.props.userType == "admin") {
        const cookies = new Cookies();
        const current = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(current.getFullYear() + 1);

        cookies.set("assignments", `EHS_${nextProps.currentSurvey.uuid}`, {
          path: "/",
          expires: nextYear
        });
      }
      return true;
    }
    if (this.props.surveyLoading != nextProps.surveyLoading) {
      this.props.getSimpleStatistic(this.props.currentSurvey.uuid);
      return true;
    }
    if (
      this.state.visible != nextState.visible ||
      this.state.redirect_to_whatsup != nextState.redirect_to_whatsup ||
      this.props.color != nextProps.color ||
      this.props.loading != nextProps.loading ||
      this.props.statistics != nextProps.statistics
    )
      return true;

    return false;
  }
  handleOnload = e => {
    console.log("Everything is working");
  };
  redirectToWhatsApp = (name, link, statusText) => {
    const rendered_statusText = statusText
      .replace("{name}", name)
      .replace("{link}", link);
    if (this.state.redirect_to_whatsup) {
      window.location.href = rendered_statusText;
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

  setRedirectToWhatsUp = () => {
    this.setState({ redirect_to_whatsup: true });
  };

  render() {
    const localhost = window.location.hostname;
    const general_texts = T[this.props.language];
    const page_texts = T[this.props.language].thankful;
    let rtl_support = null;
    if (this.props.language === "fa") {
      rtl_support = {
        textAlign: "right",
        marginRight: "20px"
      };
    }
    if (this.props.surveyLoading)
      return (
        <div style={{ textAlign: "center" }}>
          <Spin />
          <p style={rtl_support}>{general_texts.loading}</p>
        </div>
      );
    if (this.props.userType == "admin")
      if (!this.props.currentSurvey.uuid || this.props.loading)
        return (
          <div style={{ textAlign: "center" }}>
            <Spin />
            <p style={rtl_support}>{general_texts.loading}</p>
          </div>
        );
    if (this.props.userType == "user") {
      if (!this.props.statistics || this.props.loading)
        return (
          <div style={{ textAlign: "center" }}>
            <Spin />
            <p style={rtl_support}>{general_texts.loading}</p>
          </div>
        );
    }
    let listWithLastElementOfAnswers = []; // This created to recognize the current user answer to show it in a separate table
    if (this.props.statistics) {
      const endElementNumber = this.props.statistics.answers.length - 1;
      listWithLastElementOfAnswers.push(
        this.props.statistics.answers[endElementNumber]
      );
    }
    return (
      <div>
        {this.props.currentSurvey.uuid ? (
          this.props.userType == "user" ? (
            <div style={{ textAlign: "center" }}>
              <p>{page_texts.thanks.replace("{}", this.props.thanksTo)}</p>
              <div
                style={{
                  borderTopStyle: "solid",
                  borderTopWidth: "2px",
                  borderTopColor: "yellow"
                }}
              >
                <p>
                  <h3>{page_texts.yourPercentage}</h3>
                </p>
                <Row>
                  <Col>
                    <div dir="LTR">
                      <Table
                        pagination={false}
                        dataSource={listWithLastElementOfAnswers}
                        columns={renderColumn(
                          page_texts,
                          this.props.statistics.uuid
                        )}
                      />
                    </div>
                  </Col>
                </Row>
                {this.props.currentSurvey.uuid !== "dG2b6rQsR3SoLANmeloVXA" ? (
                  <React.Fragment>
                    <div
                      style={{
                        borderTopStyle: "solid",
                        borderTopWidth: "2px",
                        borderTopColor: "yellow"
                      }}
                    >
                      <p>
                        <h3>
                          {page_texts.friendsPercentage.replace(
                            "{}",
                            this.props.currentSurvey.name
                          )}
                        </h3>
                      </p>
                    </div>

                    <Row>
                      <Col>
                        <div dir="LTR">
                          <Table
                            pagination={{ pageSize: 5 }}
                            dataSource={this.props.statistics.answers}
                            columns={renderColumn(
                              page_texts,
                              this.props.statistics.uuid
                            )}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row type="flex" justify="center">
                      <div>
                        <Link
                          className="popo createOwnSurveyBtn"
                          to="/precreate"
                        >
                          {page_texts.createYourSurveyBtn}
                        </Link>
                      </div>
                    </Row>
                  </React.Fragment>
                ) : (
                  <p>This survey is limited</p>
                )}
              </div>

              <p>
                {page_texts.footerNote.replace(
                  "{}",
                  this.props.currentSurvey.name
                )}
              </p>

              <div>
                <Row type="flex" justify="center">
                  <Col span={22}>
                    <Link className="popo createOwnSurveyBtn" to="/precreate">
                      {page_texts.createYourSurveyBtn}
                    </Link>
                  </Col>
                </Row>
              </div>
            </div>
          ) : (
            <div>
              {this.redirectToWhatsApp(
                this.props.currentSurvey.userName,
                `${localhost}/su/${this.props.currentSurvey.uuid}`,
                page_texts.whatsAppLink
              )}
              <div style={{ textAlign: "center" }}>
                <p>
                  {page_texts.thanks.replace(
                    "{}",
                    this.props.currentSurvey.userName
                  )}
                </p>
                <p style={rtl_support}>{page_texts.link} </p>
                <span>&#128071;</span>
                <span>&#128071;</span>
                <span>&#128071;</span>
                <span>&#128071;</span>
              </div>

              <Row type="flex" justify="center">
                <Col
                  span={23}
                  style={{
                    textAlign: "center",
                    border: `2px solid ${this.props.color}`
                  }}
                >
                  <textarea
                    style={{ width: "100%" }}
                    onClick={(e, msg = page_texts.copied) =>
                      this.copyToClipBoard(e, msg)
                    }
                  >{`http://${localhost}/su/${this.props.currentSurvey.uuid}`}</textarea>
                </Col>
              </Row>
              <Row style={{ marginTop: "10px" }}>
                <Col>
                  <p style={rtl_support}>{parse(page_texts.friends)}</p>
                </Col>
              </Row>
              <Row
                type="flex"
                justify="center"
                style={{ marginBottom: "10px", marginTop: "10px" }}
              >
                <Col span={11}>
                  <a
                    className="popo whatsApp"
                    onClick={this.setRedirectToWhatsUp}
                  >
                    {page_texts.whatsApp}
                  </a>
                </Col>
                <Col span={11}>
                  <a className="popo instagram" onClick={this.showModal}>
                    {page_texts.instagram}
                  </a>
                </Col>
              </Row>

              <Row type="flex" justify="center">
                <Col span={22}>
                  <Link
                    className="popo createOwnSurveyBtn"
                    to={`/result/${this.props.currentSurvey.uuid}`}
                  >
                    {page_texts.showResult}
                  </Link>
                </Col>
              </Row>
            </div>
          )
        ) : null}

        <Modal
          title={page_texts.instaModalText}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={page_texts.instaModalOk}
          cancelText={page_texts.instaModalClose}
        >
          <ul style={{ ...{ listStyle: "none" }, ...rtl_support }}>
            {parse(page_texts.instaModal)}
          </ul>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    color: state.general.color,
    currentSurvey: state.survey.currentSurvey,
    thanksTo: state.survey.userName,
    userType: state.survey.userType,
    loading: state.statistics.loading,
    language: state.general.language,
    statistics: state.statistics.statistics,
    surveyLoading: state.survey.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSimpleStatistic: uuid => dispatch(getSimpleStatisticsData(uuid))
  };
};
// const HOCThankFul = withAlert(ThankFul);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ThankFul)
);
