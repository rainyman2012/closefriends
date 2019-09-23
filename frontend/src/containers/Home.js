import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { surveyGetData, surveySetData } from "../store/actions/survey";

import {
  Button,
  // Container,
  // Divider,
  Grid,
  // Header,
  // Icon,
  // Image,
  // List,
  // Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility
} from "semantic-ui-react";

const getWidth = () => {
  const isSSR = typeof window === "undefined";
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

class DesktopContainer extends Component {
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { children } = this.props;
    // const { fixed } = this.state;

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        />
        {children}
      </Responsive>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node
};

class MobileContainer extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    const { children } = this.props;
    // const { sidebarOpened } = this.state;
    console.log("mobilam");
    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        {children}
      </Responsive>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node
};

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node
};

class HomepageLayout extends Component {
  handleGetSurvey = e => {
    this.props.getSurvey();
  };

  handlePostSurvey = e => {
    this.props.setSurvey("Ehsan");
  };

  render() {
    return (
      <ResponsiveContainer>
        <Segment style={{ padding: "8em 0em" }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column textAlign="center">
                <Button onClick={this.handleGetSurvey} size="huge">
                  Get All Servey
                </Button>
                <Button onClick={this.handlePostSurvey} size="huge">
                  post Servey
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </ResponsiveContainer>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     authenticated: state.auth.token !== null
//   };
// };

const mapDispatchToProps = dispatch => {
  return {
    getSurvey: () => dispatch(surveyGetData()),
    setSurvey: name => dispatch(surveySetData(name))
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(HomepageLayout)
);
