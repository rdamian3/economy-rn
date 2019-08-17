import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { user } from '../../store/actions/index';

import './Forgot.scss';

class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailError: false,
    };
  }

  componentWillUpdate(prevProps) {
    const { message, history } = this.props;
    if (prevProps.message !== message && message.kind === 'user' && message.type === 'success') {
      history.push('/signin');
    }
  }

  handleOnEmailChange = (event) => {
    const email = event.target.value;
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const emailError = re.test(String(email).toLowerCase());
    this.setState({ email, emailError: !emailError });
  };

  doForgot = () => {
    const { email, emailError } = this.state;
    if (!emailError && email !== '') {
      this.setState({ emailError: false });
    } else {
      this.setState({ emailError: true });
    }
  };

  handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.doForgot();
    }
  };

  render() {
    const { emailError } = this.state;
    const { isFetching } = this.props;
    return (
      <div className="Forgot">
        <div className="card">
          <div className="body">
            <Typography variant="body1" component="span">
              Recuperar mi contraseña
            </Typography>
            <TextField
              error={emailError}
              id="email"
              label="Email"
              margin="normal"
              onChange={this.handleOnEmailChange}
              onKeyPress={this.handleEnterKeyPress}
              helperText={emailError ? 'Ingrese un email válido' : null}
            />
            <Button color="primary" onClick={this.doForgot} variant="contained">
              {isFetching ? (
                <CircularProgress className="progress" size={24} />
              ) : (
                <span>Recuperar</span>
              )}
            </Button>
          </div>
          <div className="footer">
            <span>Tienes un cuenta?</span>
            <Link to="/signin">Ingresa!</Link>
          </div>
        </div>
      </div>
    );
  }
}

Forgot.propTypes = {
  message: PropTypes.string.isRequired,
  history: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
};

Forgot.defaultProps = {
  history: null,
};

const mapStateToProps = state => ({ isFetching: state.isFetching });

const mapDispatchToProps = dispatch => ({
  doForgot: data => dispatch(user.doForgot(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Forgot);
