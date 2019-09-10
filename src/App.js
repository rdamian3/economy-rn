import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { session } from './store/actions/index';

import Categories from './pages/Categories/Categories';
import Dashboard from './pages/Dashboard/Dashboard';
import Forgot from './pages/Forgot/Forgot';
import Header from './components/Header/Header';
import MovementList from './pages/MovementList/MovementList';
import Profile from './pages/Profile/Profile';
import Signin from './pages/Signin/Signin';
import Signup from './pages/Signup/Signup';
import Snack from './components/Snack/Snack';

import './App.scss';
import Reports from './pages/Reports/Reports';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const { sessionHandler } = this.props;
    sessionHandler(null, null, () => {
      this.setState({ loaded: true });
    });
  }

  componentDidUpdate(prevProps) {
    const { userToken, sessionHandler, reload } = this.props;
    if (prevProps.userToken !== userToken) {
      sessionHandler(null, null, () => {
        reload();
        this.setState({ loaded: true });
      });
    }
  }

  render() {
    const { loaded } = this.state;
    const { userToken } = this.props;

    return loaded ? (
      <BrowserRouter>
        <div className={`App ${userToken ? 'logged' : ''}`}>
          {userToken ? <Header /> : null}
          <Route exact path={['/', '/home']} component={userToken ? Dashboard : Signin} />
          <Route path="/signin" component={userToken ? Dashboard : Signin} />
          <Route path="/signup" component={userToken ? Dashboard : Signup} />
          <Route path="/forgot" component={userToken ? Dashboard : Forgot} />
          <Route path="/list" component={userToken ? MovementList : Signin} />
          <Route path="/profile" component={userToken ? Profile : Signin} />
          <Route path="/report" component={userToken ? Reports : Signin} />
          <Route path="/categories" component={userToken ? Categories : Signin} />
        </div>
        <Snack />
      </BrowserRouter>
    ) : null;
  }
}

App.propTypes = {
  sessionHandler: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
  userToken: PropTypes.string,
};

App.defaultProps = {
  userToken: '',
};

const mapStateToProps = state => ({ userToken: state.userToken });

const mapDispatchToProps = dispatch => ({
  sessionHandler: (param, param2, param3) => {
    dispatch(session.sessionHandler(param, param2, param3));
  },
  reload: () => {
    dispatch(session.reload());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
