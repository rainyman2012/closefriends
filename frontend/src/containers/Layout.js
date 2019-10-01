import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { changeColor } from "../store/actions/general";
import { Layout, Row, Col, Icon } from "antd";
import "../stylesheets/layout.css";

const { Content, Footer } = Layout;

const myPadding = {
  padding: "0 50px"
};
class CustomLayout extends React.Component {
  state = {
    background_color: "#c64b76"
  };
  changeColorHandler = (e, color) => {
    this.props.changeColor(color);
  };

  componentWillMount() {
    document.body.style.backgroundColor = this.state.background_color;
  }
  render() {
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
    const { background_color } = this.state;
    const borderWidth = "3px";

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
              span={14}
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
            <p style={{ marginTop: "5px" }}>
              If you like to be a contributor to this project you can checkout
              this github
            </p>
            <a style={{ fontSize: "20px" }} href="https://github.com">
              <div>
                <i className="fa fa-github"></i>
              </div>
            </a>
          </p>
        </Footer>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    color: state.general.color
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeColor: color => dispatch(changeColor(color))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomLayout)
);
