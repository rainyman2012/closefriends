import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { changeColor } from "../store/actions/general";
import { Layout, Row, Col, Icon, message, Button } from "antd";
import "../stylesheets/layout.css";
import { HOSTNAME } from "../static";
import { Lang as T } from "../languages";
import { logout } from "../store/actions/auth";
import gifLogo from "../heart.gif";
import picLogo from "../heart-pic.jpg";
import Cookies from "universal-cookie";
import axios from "axios";

const { Content, Footer } = Layout;

const myPadding = {
  padding: "0 50px"
};
class CustomLayout extends React.Component {
  state = {
    background_color: "#c64b76",
    heartType: "pic",
    serverError: false,
    likedNum: 0
  };
  changeColorHandler = (e, color) => {
    this.props.changeColor(color);
  };

  handleLogout = () => {
    this.props.logout();
    message.success("loged out");
    this.props.history.push("/");
  };

  heartClick = e => {
    const cookies = new Cookies();
    const current = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(current.getFullYear() + 1);
    axios({
      method: "post",
      data: {
        like: true
      },
      url: `${HOSTNAME}/survey/like`,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        const liked = res.data;
        this.setState({ likedNum: liked });
      })
      .catch(err => {
        this.setState({ serverError: true });
        console.log(err);
      });
    cookies.set("heart", "true", {
      path: "/",
      expires: nextYear
    });
    this.setState({ heartType: "gif" });
  };

  componentWillMount() {
    const cookies = new Cookies();
    if (cookies.get("heart") === "true") this.setState({ heartType: "gif" });
    document.body.style.backgroundColor = this.state.background_color;
    axios({
      method: "get",
      url: `${HOSTNAME}/survey/like`,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        const liked = res.data;
        this.setState({ likedNum: liked });
      })
      .catch(err => {
        this.setState({ serverError: true });
        console.log(err);
      });
  }
  componentDidMount() {
    document.body.style.fontFamily = "Amiri";
    let htmlElement = document.getElementsByTagName("html")[0];
    htmlElement.dir = "rtl";
  }

  render() {
    const general_texts = T[this.props.language];

    // const { authenticated } = this.props;
    // here is menu bar of layout
    // This is all content page
    // here is footer for layout
    let user_color_aqua = {
      border: "5px solid aqua",
      backgroundColor: "aqua"
    };
    let user_color_red = {
      border: "5px solid red",
      backgroundColor: "red"
    };
    let user_color_orange = {
      border: "5px solid orange",
      backgroundColor: "orange"
    };
    let user_color_green = {
      border: "5px solid green",
      backgroundColor: "green"
    };

    let user_color_gray = {
      border: "5px solid gray",
      backgroundColor: "gray"
    };

    if (this.state.serverError)
      return (
        <div style={{ textAlign: "center" }}>
          <p>{general_texts.serverError}... </p>
        </div>
      );
    const { background_color } = this.state;
    const borderWidth = "3px";
    let heart_type;
    if (this.state.heartType === "pic")
      heart_type = (
        <img
          src={picLogo}
          width="65px"
          height="60px"
          style={{ cursor: "pointer" }}
          alt="loading..."
          onClick={this.heartClick}
        />
      );
    else
      heart_type = (
        <img src={gifLogo} width="65px" height="60px" alt="loading..." />
      );
    return (
      <Layout
        style={{
          backgroundColor: background_color
        }}
        className="ehs-poll"
      >
        <Content
          className="content_basic"
          style={{
            backgroundColor: background_color,
            borderColor: this.props.color,
            borderWidth: borderWidth,
            paddingBottom: "10px",
            marginTop: "10px"
          }}
        >
          <Row
            type="flex"
            justify="center"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <Col
              xs={{ span: 23 }}
              sm={{ span: 8 }}
              className="content_basic"
              style={{
                borderColor: this.props.color,
                borderWidth: borderWidth,
                padding: "5px"
              }}
            >
              <div id="color_list">
                <span>
                  <a
                    class="my_btn"
                    style={user_color_aqua}
                    href="#"
                    onClick={event => {
                      this.changeColorHandler(event, "aqua");
                    }}
                  />
                </span>
                <span>
                  <a
                    class="my_btn"
                    style={user_color_red}
                    href="#"
                    onClick={event => {
                      this.changeColorHandler(event, "red");
                    }}
                  />
                </span>
                <span>
                  <a
                    class="my_btn"
                    style={user_color_orange}
                    href="#"
                    onClick={event => {
                      this.changeColorHandler(event, "orange");
                    }}
                  />
                </span>
                <span>
                  <a
                    class="my_btn"
                    style={user_color_green}
                    href="#"
                    onClick={event => {
                      this.changeColorHandler(event, "green");
                    }}
                  />
                </span>
                <span>
                  <a
                    class="my_btn"
                    style={user_color_gray}
                    href="#"
                    onClick={event => {
                      this.changeColorHandler(event, "gray");
                    }}
                  />
                </span>
              </div>
            </Col>
          </Row>
          <div style={{ marginBottom: "10px" }}>
            {!this.props.authenticated ? (
              <React.Fragment>
                <Row type="flex" justify="center">
                  <Col>
                    <Link to={{ pathname: "/signup" }}>
                      <Button
                        type="primary"
                        style={{ width: "100px", margin: "5px" }}
                        size="small"
                      >
                        signup
                      </Button>
                    </Link>
                  </Col>
                  <Col>
                    <Link to={{ pathname: "/login" }}>
                      <Button
                        type="primary"
                        style={{ width: "100px", margin: "5px" }}
                        size="small"
                      >
                        login
                      </Button>
                    </Link>
                  </Col>
                  <Col>
                    <Link to="/">
                      <Button
                        type="primary"
                        style={{ width: "100px", margin: "5px" }}
                        size="small"
                      >
                        Home
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </React.Fragment>
            ) : (
              <Row type="flex" justify="center" style={{ marginTop: "10px" }}>
                <Col>
                  <Button
                    type="primary"
                    style={{ width: "100px", margin: "5px" }}
                    size="small"
                    onClick={this.handleLogout}
                  >
                    logout
                  </Button>
                </Col>
                <Col>
                  <Link to="/">
                    <Button
                      type="primary"
                      style={{ width: "100px", margin: "5px" }}
                      size="small"
                    >
                      Home
                    </Button>
                  </Link>
                </Col>
              </Row>
            )}
          </div>
          {this.props.children}
        </Content>

        <Footer
          className="custom_footer"
          style={{
            padding: "24px 0px",
            textAlign: "center",
            backgroundColor: background_color,
            fontFamily: "sans-serif"
          }}
        >
          CopyRight ©2019 Created by Ehsan Ahmadi
          <p>
            <a
              style={{ fontSize: "20px" }}
              href="https://www.instagram.com/e.rainman/"
            >
              <Icon type="instagram" />
            </a>
            {" | "}
            <a style={{ fontSize: "20px" }} href="#">
              <i className="fa fa-whatsapp"></i>
            </a>
            {" | "}
            <a style={{ fontSize: "20px" }} href="#">
              <i className="fa fa-telegram"></i>
            </a>
          </p>
        </Footer>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    color: state.general.color,
    language: state.general.language,
    authenticated: !!state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeColor: color => dispatch(changeColor(color)),
    logout: () => dispatch(logout())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomLayout)
);
