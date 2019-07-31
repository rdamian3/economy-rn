import React, { Component } from "react";

import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import { user } from "./store/actions/index";

import Categories from "./pages/Categories/Categories";
import Dashboard from "./pages/Dashboard/Dashboard";
import Footer from "./components/Footer/Footer";
import Forgot from "./pages/Forgot/Forgot";
import Header from "./components/Header/Header";
import MovementList from "./pages/MovementList/MovementList";
import Profile from "./pages/Profile/Profile";
import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";
import Snack from "./components/Snack/Snack";

import "./App.scss";
import Reports from "./pages/Reports/Reports";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userToken !== this.props.userToken) {
      this.props.sessionHandler(null, null, () => {
        this.setState({ loaded: true });
      });
    }
  }

  componentDidMount() {
    this.props.sessionHandler(null, null, () => {
      this.setState({ loaded: true });
    });
  }

  render() {
    return this.state.loaded ? (
      <BrowserRouter>
        <div className={"App " + (this.props.userToken ? "logged" : "")}>
          {this.props.userToken ? <Header /> : null}
          <Route
            exact
            path={["/", "/home"]}
            component={this.props.userToken ? Dashboard : Signin}
          />
          <Route
            path="/signin"
            component={this.props.userToken ? Dashboard : Signin}
          />
          <Route
            path="/signup"
            component={this.props.userToken ? Dashboard : Signup}
          />
          <Route
            path="/forgot"
            component={this.props.userToken ? Dashboard : Forgot}
          />
          <Route
            path="/list"
            component={this.props.userToken ? MovementList : Signin}
          />
          <Route
            path="/profile"
            component={this.props.userToken ? Profile : Signin}
          />
          <Route
            path="/report"
            component={this.props.userToken ? Reports : Signin}
          />
          <Route
            path="/categories"
            component={this.props.userToken ? Categories : Signin}
          />
          {this.props.userToken ? <Footer /> : null}
        </div>
        <Snack />
      </BrowserRouter>
    ) : null;
  }
}

const mapStateToProps = state => {
  return { userToken: state.userToken };
};

const mapDispatchToProps = dispatch => ({
  sessionHandler: (param, param2, param3) =>
    dispatch(user.sessionHandler(param, param2, param3))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
