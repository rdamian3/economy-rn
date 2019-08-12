import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { user } from '../../store/actions/index';

import './Signin.scss';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordError: false,
      email: '',
      emailError: false,
    };
  }

  doSignin = () => {
    const {
      email, emailError, password, passwordError,
    } = this.state;
    const { doSignin } = this.props;
    if (!emailError && !passwordError) {
      doSignin({
        email,
        password,
      });
    }
  };

  handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.doSignin();
    }
  };

  handleOnEmailChange = (event) => {
    const email = event.target.value.trim();
    const regEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const emailError = regEx.test(String(email).toLowerCase());
    this.setState({ email, emailError: !emailError });
  };

  handleOnPasswordChange = (event) => {
    const password = event.target.value.trim();
    const passwordError = password.length < 8;
    this.setState({ password, passwordError });
  };

  render() {
    const { emailError, passwordError } = this.state;
    const { isFetching } = this.props;

    return (
      <div className="signin">
        <div className="card">
          <div className="body">
            <Typography variant="body1" component="span">
              Iniciar sesión
            </Typography>
            <TextField
              error={emailError}
              helperText={emailError ? 'El email es inválido' : null}
              id="email"
              label="Email"
              margin="normal"
              onChange={this.handleOnEmailChange}
            />
            <TextField
              error={passwordError}
              helperText={passwordError ? 'El password es incorrecto' : null}
              id="password"
              label="Contraseña"
              margin="normal"
              onChange={this.handleOnPasswordChange}
              onKeyPress={this.handleEnterKeyPress}
              type="password"
            />
            <div className="forgot">
              <Link to="/forgot">Olvidé mi contraseña</Link>
            </div>
            <Button
              color="primary"
              onClick={this.doSignin}
              variant="contained"
              className="btn-login"
            >
              {isFetching ? (
                <CircularProgress className="progress" size={24} />
              ) : (
                <span>Ingresar</span>
              )}
            </Button>
          </div>
          <div className="footer">
            <span>Nuevo aquí?</span>
            <Link to="/signup">Crea tu cuenta!</Link>
          </div>
        </div>
      </div>
    );
  }
}

Signin.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  doSignin: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ isFetching: state.isFetching });

const mapDispatchToProps = dispatch => ({
  doSignin: data => dispatch(user.doSignin(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Signin);
