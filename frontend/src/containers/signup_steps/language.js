import React from "react";
import { Row, Col, Menu, Select, Icon, Steps, Button, message } from "antd";
import { Lang as T } from "../../languages";

const { Option } = Select;
// import { authSignup } from "../../store/actions/auth";

class LanguageForm extends React.Component {
  continue = e => {
    e.preventDefault();
    this.props.next();
  };

  handleSelectChange = e => {
    if (e === "en") {
      this.props.handleChange("language", "en");
      document.body.style.fontFamily = "Indie Flower";
      let htmlElement = document.getElementsByTagName("html")[0];
      htmlElement.dir = "ltr";
    } else {
      this.props.handleChange("language", "fa");
      document.body.style.fontFamily = "Amiri";
      let htmlElement = document.getElementsByTagName("html")[0];
      htmlElement.dir = "rtl";
    }
  };
  render() {
    const general_texts = T[this.props.values["language"]];
    return (
      <div style={{ marginTop: "20px" }}>
        <Row type="flex" justify="center">
          <Col span="12">
            <Select
              placeholder="Select your language"
              onChange={this.handleSelectChange}
              style={{ width: "100%" }}
            >
              <Option value="fa">فارسی</Option>
              <Option value="en">English</Option>
            </Select>
          </Col>
        </Row>

        <Row type="flex" justify="center" style={{ marginTop: "10px" }}>
          <Col span="12">
            <Button
              type="primary"
              style={{ width: "100%" }}
              size="medium"
              onClick={this.continue}
            >
              Continue
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default LanguageForm;
