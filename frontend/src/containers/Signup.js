import React from "react";
import { Row, Col, Slider, Icon, Spin } from "antd";
import { Steps, Button, message } from "antd";
import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import AuthForm from "./signup_steps/auth";
import PersonalForm from "./signup_steps/personal";
import LanguageForm from "./signup_steps/language";
import { authSignup, authProfile } from "../store/actions/auth";
import { HOSTNAME } from "../static";
import axios from "axios";

const { Step } = Steps;

class SignUpForm extends React.Component {
  state = {
    language: "English",
    username: "",
    password: "",
    email: "",
    realName: "",
    gender: "",
    image: null,
    loading: "",
    serverError: "",
    age: 10,
    step: 1
  };

  nextStep = () => {
    const step = this.state.step + 1;
    this.setState({ step });
  };

  prevStep = () => {
    const step = this.state.step - 1;
    this.setState({ step });
  };

  handleSubmit = () => {
    const { username, password } = this.state;
    this.props.create(username, password);
  };

  componentWillUpdate(nextProps, nextState) {
    if (this.props.signUpCompleted != nextProps.signUpCompleted) {
      // gender, lang, age, image, key;
      this.props.create_profile(
        this.state.gender,
        this.state.language,
        this.state.age,
        this.state.image,
        nextProps.token
      );
      message.success(
        "Your account successfully created. redirecting to your dashboard",
        () => {
          this.props.history.push("/dashboard");
        }
      );
    }
  }

  handleChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  render() {
    if (this.props.loading) return <Spin>Loading</Spin>;

    const { step } = this.state;
    const {
      language,
      username,
      password,
      email,
      realName,
      gender,
      image
    } = this.state;
    const values = {
      language,
      username,
      password,
      email,
      realName,
      gender,
      image
    };
    let evaluateForms = "";
    if (!this.state.completed)
      switch (step) {
        case 1:
          evaluateForms = (
            <LanguageForm
              next={this.nextStep}
              handleChange={this.handleChange}
              values={values}
            />
          );

          break;
        case 2:
          evaluateForms = (
            <AuthForm
              next={this.nextStep}
              handleChange={this.handleChange}
              values={values}
            />
          );
          break;
        case 3:
          evaluateForms = (
            <PersonalForm
              submit={this.handleSubmit}
              handleChange={this.handleChange}
              values={values}
            />
          );
          break;
        default:
          evaluateForms = (
            <LanguageForm
              next={this.nextStep}
              handleChange={this.handleChange}
              values={values}
            />
          );
      }

    return (
      <React.Fragment>
        {evaluateForms}
        <p>{this.props.token}</p>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token,
    signUpCompleted: state.auth.signUpCompleted
  };
};

const mapDispatchToProps = dispatch => {
  return {
    create: (name, password1) => dispatch(authSignup(name, password1)),
    create_profile: (gender, lang, age, image, key) =>
      dispatch(authProfile(gender, lang, age, image, key))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpForm);
