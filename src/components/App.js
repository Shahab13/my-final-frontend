import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";

// Helpers
import * as auth from "../api/auth";

import * as token from "../helpers/local-storage";

// Components
import Header from "./shared/Header";
import Navigation from "./shared/Navigation/Navigation";
import Login from "./auth/Login.Form";
import Signup from "./auth/Signup.Form";
import UsersContainer from "./users/Container";

import Students from "./Admin/Students";
import Assignments from "./Admin/Assignments";
import Admin from "./Admin/Admin";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUserId: null,
      currentUsername: null,
      ungraded: [],
      graded: [],
      isAdmin: false,
      loading: true,

      displayError: false
    };

    this.loginUser = this.loginUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.signupUser = this.signupUser.bind(this);
  }

  async componentDidMount() {
    if (token.getToken()) {
      const { user } = await auth.profile();

      this.setState({
        isAdmin: user.isAdmin,
        currentUserId: user._id,
        currentUsername: user.username,

        loading: false
      });
    } else {
      this.setState({ loading: false });
    }
  }

  async loginUser(user) {
    const response = await auth.login(user);
    if (response.status === 401) {
      this.setState({ displayError: true });
      return;
    } else {
      this.setState({ displayError: false });
      await token.setToken(response);

      const profile = await auth.profile();
      this.setState({
        currentUsername: profile.user.username,
        currentUserId: profile.user._id,
        isAdmin: profile.user.isAdmin
      });
    }
  }

  logoutUser() {
    token.clearToken();
    this.setState({
      currentUserId: null,
      currentUsername: null,
      isAdmin: false
    });
  }

  async signupUser(user) {
    const response = await auth.signup(user);
    if (response.status === 401) {
      this.setState({ displayError: true });
      return;
    } else {
      this.setState({ displayError: false });
      await token.setToken(response);

      const profile = await auth.profile();
      this.setState({
        currentUsername: profile.user.username,
        currentUserId: profile.user._id
      });
    }
  }

  render() {
    const {
      currentUsername,
      currentUserId,
      isAdmin,
      loading,
      displayError,
      ungraded,
      graded
    } = this.state;

    const assignment = `/users/${currentUserId}/posts`;

    if (loading) return <span>Loading...</span>;

    return (
      <Router>
        <Header />
        <Navigation
          currentUserId={currentUserId}
          currentUsername={currentUsername}
          logoutUser={this.logoutUser}
        />
        <Switch>
          <Route
            path="/login"
            component={() => {
              if (isAdmin && currentUserId) {
                return <Redirect to="/admin/users" />;
              } else {
                return currentUserId ? (
                  <Redirect to={assignment} />
                ) : (
                  <Login
                    onSubmit={this.loginUser}
                    displayError={displayError}
                  />
                );
              }
            }}
          />
          <Route
            path="/signup"
            component={() => {
              if (isAdmin && currentUserId) {
                return <Redirect to="/admin/users" />;
              } else {
                return currentUserId ? (
                  <Redirect to={assignment} />
                ) : (
                  <Signup
                    onSubmit={this.signupUser}
                    displayError={displayError}
                  />
                );
              }
            }}
          />
          />
          <Route
            path="/admin/users"
            component={() => {
              return isAdmin && currentUserId ? (
                <Students />
              ) : currentUserId ? (
                <Redirect to={assignment} />
              ) : (
                <Login onSubmit={this.loginUser} displayError={displayError} />
              );
            }}
          />
          <Route
            path="/admin/ungraded"
            render={() => {
              return isAdmin ? <Admin /> : <Redirect to="/login" />;
            }}
          />
          <Route
            path="/admin/graded"
            render={() => {
              return isAdmin ? (
                <Assignments filter={true} />
              ) : (
                <Redirect to="/login" />
              );
            }}
          />
          <Route
            path="/users"
            render={() => {
              return currentUserId ? (
                <UsersContainer currentUserId={currentUserId} />
              ) : (
                <Redirect to="/login" />
              );
            }}
          />
          <Route
            path="/assignments"
            exact
            render={() => {
              return currentUserId ? (
                <Redirect to={assignment} />
              ) : (
                <Redirect to="/login" />
              );
            }}
          />
          <Redirect to="/login" />
        </Switch>
      </Router>
    );
  }
}

export default App;
