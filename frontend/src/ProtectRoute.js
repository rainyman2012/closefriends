import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

import { withRouter, Link } from "react-router-dom";

class ProtectedRoute extends Component {
  render() {
    const { component: Component, ...props } = this.props;

    return (
      <Route
        {...props}
        render={props =>
          this.props.authenticated ? (
            <Component {...props} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    authenticated: !!state.auth.token
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     login: (username, password) => dispatch(authLogin(username, password))
//   };
// };
export default connect(
  mapStateToProps,
  null
)(ProtectedRoute);
