import React, { Component } from "react";
import "../stylesheets/thankfull.css";
import { connect } from "react-redux";
import { withRouter, Link, Redirect } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button, Row, Col, Modal, message } from "antd";
import { Lang as T } from "../languages";
import parse from "html-react-parser";

function withAlert(Component) {
  return function WrappedComponent(props) {
    const alert = useAlert();

    return <Component {...props} myAlert={alert} />;
  };
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
    if (
      this.state.visible != nextState.visible ||
      this.state.redirect_to_whatsup != nextState.redirect_to_whatsup ||
      this.props.color != nextProps.color
    )
      return true;
    return false;
  }
  handleOnload = e => {
    this.props.myAlert.show("Thankyou!");
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
    const textField = document.createElement("textarea");
    textField.innerText = e.target.innerText;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();

    /* Copy the text inside the text field */

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

    return (
      <div>
        {this.props.currentSurvey ? (
          this.props.userType == "user" ? (
            <div style={{ textAlign: "center" }}>
              <p style={rtl_support}>
                {page_texts.thanks.replace("{}", this.props.thanksTo)}
              </p>

              <Row type="flex" justify="center">
                <div>
                  <Link className="popo createOwnSurveyBtn" to="/precreate">
                    {page_texts.createYourSurveyBtn}
                  </Link>
                </div>
              </Row>
            </div>
          ) : (
            <div>
              {this.redirectToWhatsApp(
                this.props.thanksTo,
                `${localhost}/su/${this.props.currentSurvey.uuid}`,
                page_texts.whatsAppLink
              )}
              <div style={{ textAlign: "center" }}>
                <p style={rtl_support}>
                  {page_texts.thanks.replace("{}", this.props.thanksTo)}
                </p>

                <p style={rtl_support}>{page_texts.link}</p>
              </div>

              <Row type="flex" justify="center">
                <Col
                  span={23}
                  style={{
                    textAlign: "center",
                    border: `2px solid ${this.props.color}`
                  }}
                >
                  <p
                    onClick={(e, msg = page_texts.copied) =>
                      this.copyToClipBoard(e, msg)
                    }
                  >{`http://${localhost}/su/${this.props.currentSurvey.uuid}`}</p>
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
        ) : (
          <div>
            <Row type="flex" justify="center">
              <Col span={22}>
                <Link className="popo createOwnSurveyBtn" to="/precreate">
                  {page_texts.createYourSurveyBtn}
                </Link>
              </Col>
            </Row>
          </div>
        )}

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
    language: state.general.language
  };
};

const HOCThankFul = withAlert(ThankFul);

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(HOCThankFul)
);
