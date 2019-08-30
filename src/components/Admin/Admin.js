import React, { Component } from "react";
import Form from "./Form";
import * as posts from "../../api/posts";
import { withRouter } from "react-router-dom";

class Assignments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assignments: []
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  async componentDidMount() {
    const { response } = await posts.unGradedAssignments().then(res => {
      return res;
    });
    this.setState({ assignments: response });
  }

  onChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }
  async onSubmit(st) {
    const post = {
      _id: st._id,
      title: st.title,
      desc: st.desc,
      proLink: st.proLink,
      got: st.got,
      total: st.total
    };

    const response = await posts.updatePost({
      user: { _id: st.userId },
      post
    });
    this.componentDidMount();
  }

  processData(user) {
    const id = user._id;

    return user.assignments.map(a => (
      <div key={a._id} className="card">
        <div className="card-body">
          <h5 className="card-title">{a.title}</h5>
          <p className="card-text">{a.desc}</p>
          <a className="card-link" href={a.proLink} target="_blank">
            Project Link
          </a>

          <Form onSubmit={this.onSubmit} userId={id} assign={a} />
        </div>
      </div>
    ));
  }

  render() {
    const { assignments } = this.state;

    const assign = assignments.map(user => this.processData(user));

    return (
      <div>
        <div>
          {assign === undefined || assign === null ? "Loading" : assign}
        </div>
      </div>
    );
  }
}

export default withRouter(Assignments);
