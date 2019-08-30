import React, { Component } from "react";
import * as users from "../../api/users";

import { withRouter } from "react-router-dom";
class Students extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      above: 0,
      below: 100
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }
  async componentDidMount() {
    this.refreshUsers().then(() => this.setState({ loading: false }));
  }

  // Internal
  async refreshUsers() {
    const { response } = await users.fetchUsers();
    this.setState({ users: response });
  }

  render() {
    const { users } = this.state;
    const filteredData = users.filter(user => {
      if (user.grade) {
        return user.grade >= this.state.above && user.grade <= this.state.below;
      }
      return user;
    });
    return (
      <div>
        <form className="form-inline m-5">
          <div className="form-group">
            <label className="pr-3">Score is Above: </label>
            <input
              type="text"
              className="form-control p-2"
              name="above"
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <label className="pr-3">Score is below: </label>
            <input
              type="text"
              className="form-control p2"
              name="below"
              onChange={this.onChange}
            />
          </div>
        </form>
        <ul className="list-group list-group-flush">
          {filteredData.map(user => (
            <li
              className="list-group-item col"
              style={{
                background: "#F8F9FA",
                marginTop: "10px",
                marginBottom: "10px"
              }}
              key={user._id}
            >
              {
                <div>
                  {user.fname} {user.lname} <a href="#"> {user.username}</a>
                  <span style={{ marginLeft: "10px", color: "green" }}>
                    {user.grade === undefined ? (
                      "TBD"
                    ) : (
                      <div>{user.grade} / 100</div>
                    )}
                  </span>
                </div>
              }
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
export default withRouter(Students);
