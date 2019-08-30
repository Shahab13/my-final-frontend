import React, { Component } from "react";
import Error from "../shared/Error";
class Form extends Component {
  constructor(props) {
    super(props);
    const { assign = {} } = this.props;
    const errors = [];

    const { userId } = this.props;
    const { _id, title = "", desc = "", proLink = "", got, total } = assign;
    this.state = { _id, title, desc, proLink, got, total, userId, errors };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }
  onSubmit(e) {
    e.preventDefault();
    let arr = [];
    if (this.state.got === undefined) {
      arr.push("got is required");
    }
    if (this.state.total === undefined) {
      arr.push("Total is required");
    }

    this.setState({ errors: arr });

    if (arr.length === 0) {
      this.props.onSubmit(this.state);
    }
  }
  render() {
    return (
      <div>
        {this.state.errors.length !== 0 ? (
          <Error error={this.state.errors} />
        ) : (
          ""
        )}
        <form onSubmit={this.onSubmit}>
          <div className="row">
            <div className="col-md-1">
              <input
                type="text"
                className="form-control"
                name="got"
                onChange={this.onChange}
                value={this.state.got !== undefined ? this.state.got : ""}
              />
            </div>
            out of
            <div className="col-md-1">
              <input
                type="text"
                className="form-control"
                name="total"
                onChange={this.onChange}
                value={this.state.total !== undefined ? this.state.total : ""}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-secondary"
            style={{ marginTop: "20px" }}
          >
            Save
          </button>
        </form>
      </div>
    );
  }
}
export default Form;
