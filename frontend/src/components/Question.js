import React, { Component } from "react";
import Choice from "./Choice";

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let rtl_support = null;

    if (this.props.language === "fa")
      rtl_support = {
        textAlign: "right"
      };
    return (
      <React.Fragment>
        {this.props.userType === "admin" ? (
          <p style={rtl_support}> {this.props.question.name} </p>
        ) : (
          <p style={rtl_support}>
            {this.props.question.ask.replace("{}", this.props.survey.name)}
          </p>
        )}

        <Choice
          choices={this.props.question.choices}
          onAnswer={this.props.onAnswer}
          currentChoice={this.props.currentChoice}
          question={this.props.question.id}
        />
      </React.Fragment>
    );
  }
}

export default Question;
