import React from "react";
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete
} from "antd";

import { PasswordInput } from "antd-password-input-strength";
import { connect } from "react-redux";
import { HOSTNAME } from "../../static";
import { NavLink, Redirect } from "react-router-dom";
import axios from "axios";

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

// import { authSignup } from "../../store/actions/auth";

class RegisterForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    existUserError: "",
    serverError: false,
    confirmPassError: false,
    loading: false,
    passwordLength: 6
  };

  continue = () => {
    var event = new Event("blur", {
      bubbles: true,
      cancelable: true
    });

    const element1 = document.getElementById("conf-password");
    const element2 = document.getElementById("username");

    element2.dispatchEvent(event);
    element1.dispatchEvent(event);

    if (
      !this.state.confirmPassError &&
      this.state.existUserError == "USER_NOT_EXISTED"
    )
      this.props.next();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleChange("username", values.username);
        this.props.handleChange("password", values.password);
        this.props.next();
      }
    });
  };
  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    console.log("validateToNextPassword", "a");

    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };
  passwordPolicy = (rule, value, callback) => {
    if (value.length < this.state.passwordLength)
      callback(
        this.custommessage(
          "Your password must be greater than " + this.state.passwordLength
        )
      );
    else callback();
  };
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback(
        this.custommessage("Two passwords that you enter is inconsistent!")
      );
    } else {
      callback();
    }
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    // If there is a value in Input so we can find out there is tampered in confirm input
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  custommessage(message, color = "white", tag = "p") {
    return React.createElement(tag, { style: { color: color } }, message);
  }

  checkValidUsername = (rule, value, callback) => {
    const { form } = this.props;

    if (value) {
      this.setState({ loading: true });
      axios({
        method: "post",
        data: {
          username: value
        },
        url: `${HOSTNAME}/api/checkExistUser`,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.data["msg"] == "USER_EXISTED")
            callback(
              this.custommessage("This username was assigned to another one")
            );
          else callback();
          this.setState({ loading: false });
        })
        .catch(err => {
          callback("Server Error");
          this.setState({ loading: false });

          console.log(err);
        });
    } else callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 23,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 0
        }
      }
    };
    let tooltip = null;
    if (this.state.existUserError == "USER_NOT_EXISTED")
      tooltip = (
        <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
      );
    else if (this.state.existUserError == "USER_EXISTED")
      tooltip = <Icon type="stop" theme="twoTone" twoToneColor="red" />;

    return (
      <div style={{ marginTop: "20px" }}>
        <Form
          {...formItemLayout}
          onSubmit={this.handleSubmit}
          style={{ padding: "10px" }}
        >
          <Form.Item
            hasFeedback
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            {getFieldDecorator("username", {
              rules: [
                {
                  required: true,
                  message: this.custommessage("this field is required")
                },
                {
                  validator: this.checkValidUsername
                }
              ]
            })(<Input placeholder="Username" />)}
          </Form.Item>

          <Form.Item
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: this.custommessage("Please input your password!")
                },
                {
                  validator: this.validateToNextPassword
                },
                {
                  validator: this.passwordPolicy
                }
              ]
            })(<PasswordInput placeholder="Password" inputProps={{}} />)}
          </Form.Item>

          <Form.Item
            hasFeedback
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            {getFieldDecorator("confirm", {
              rules: [
                {
                  required: true,
                  message: this.custommessage("Please confirm your password!")
                },
                {
                  validator: this.compareToFirstPassword
                }
              ]
            })(
              <Input.Password
                placeholder="Confirm Password"
                inputProps={{}}
                onBlur={this.handleConfirmBlur}
              />
            )}
          </Form.Item>

          <Form.Item
            {...tailFormItemLayout}
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center"
            }}
          >
            <Button type="primary" htmlType="submit">
              Continue
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: "register" })(RegisterForm);

// export default AuthForm;
const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     create: (name, password1) => dispatch(authSignup(name, password1))
//   };
// };

export default connect(
  mapStateToProps,
  null
)(WrappedRegistrationForm);
