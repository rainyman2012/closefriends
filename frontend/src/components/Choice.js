import React, { Component } from "react";
import "../stylesheets/choice_flex_box.css";
import { Row, Col, Spin } from "antd";
import "../static";
import { HOSTNAME } from "../static";
import "../stylesheets/choice.css";
class Choice extends Component {
  state = {
    loading: true,
    counter: 0
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.counter != this.state.counter) return false;
    return true;
  }

  imageLoaded = () => {
    this.state.counter += 1;
    if (this.state.counter >= this.props.choices.length) {
      this.setState({ loading: false });
    }
  };
  render() {
    let choice_dict = {};
    let row_count = -1;
    // Create a dictionary whith appropriate row and col which is a list
    // {RowNumber : [ ColNumber : choice ] ... }
    this.props.choices.map((choice, index) => {
      if (index % 2 == 0) {
        row_count += 1;
        choice_dict[row_count] = [];
      }
      choice_dict[row_count].push(choice);
    });

    return (
      <React.Fragment>
        {Object.keys(choice_dict).map((value, index) => {
          const render_col = choice_dict[value].map((choice, index) => {
            return (
              <Col span={11}>
                <div style={{ textAlign: "center" }}>
                  <Spin size="large" spinning={this.state.loading} />
                </div>

                <div
                  key={choice.id}
                  style={{ display: this.state.loading ? "none" : "block" }}
                >
                  <img
                    alt=""
                    className={
                      this.props.currentChoice !== undefined &&
                      this.props.currentChoice.choice === choice.id
                        ? "selected"
                        : "unseleted"
                    }
                    src={HOSTNAME + choice.image}
                    width="100%"
                    height="150px"
                    onClick={e => {
                      this.props.onAnswer(choice, e);
                    }}
                    onLoad={this.imageLoaded}
                  />
                </div>
              </Col>
            );
          });
          const render_row = (
            <Row type="flex" className="mobDesk" style={{ marginTop: "8px" }}>
              {render_col}
            </Row>
          );
          return render_row;
        })}
      </React.Fragment>
    );
  }
}

export default Choice;
