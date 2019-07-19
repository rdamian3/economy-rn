import React, { Component } from 'react';
import { connect } from 'react-redux';
import { user, comunication } from './../../store/actions/index';
import { Link } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import './Signup.scss';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailError: true,
      displayName: '',
      displayNameError: false,
      password: '',
      passwordError: false,
      passwordRepeat: '',
      passwordRepeatError: false
    };
  }

  handleEnterKeyPress = event => {
    if (event.key === 'Enter') {
      this.doSignup();
    }
  };

  handleOnEmailChange = event => {
    const email = event.target.value;
    const regEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const emailError = regEx.test(String(email).toLowerCase());
    this.setState({ email, emailError: !emailError });
  };

  handleOnDisplayNameChange = event => {
    const name = event.target.value;
    const displayNameError = name.length < 2;
    this.setState({ name, displayNameError });
  };

  handleOnPasswordChange = event => {
    const password = event.target.value;
    const passwordError = password.length < 8;
    this.setState({ password, passwordError });
  };

  handleOnPasswordRepeatChange = event => {
    const passwordRepeat = event.target.value;
    const passwordRepeatError = passwordRepeat !== this.state.password;
    this.setState({ passwordRepeat, passwordRepeatError });
  };

  doSignup = () => {
    const {
      email,
      password,
      emailError,
      displayName,
      passwordError,
      displayNameError,
      passwordRepeatError
    } = this.state;

    if (
      !emailError &&
      !passwordError &&
      !displayNameError &&
      !passwordRepeatError
    ) {
      const data = {
        email,
        password,
        displayName
      };
      this.props.doSignup(data);
    } else {
      this.props.setMessage({
        message: 'Verifique los campos',
        type: 'error',
        kind: 'category'
      });
    }
  };

  componentDidUpdate(prevProps) {}

  render() {
    const {
      emailError,
      displayNameError,
      passwordError,
      passwordRepeatError
    } = this.state;

    return (
      <div className="signup">
        <div className="card">
          <div className="body">
            <Typography variant="body1" component="span">
              Registro
            </Typography>
            <TextField
              error={emailError}
              helperText={emailError ? 'El email es inválido' : null}
              id="email"
              label="Email"
              margin="normal"
              onChange={this.handleOnEmailChange}
              onFocus={this.handleOnEmailChange}
              inputProps={{
                autoComplete: 'new-password',
                form: {
                  autoComplete: 'off'
                }
              }}
            />
            <TextField
              error={displayNameError}
              helperText={displayNameError ? 'Ingrese un nombre' : null}
              id="name"
              label="Nombre"
              margin="normal"
              onChange={this.handleOnDisplayNameChange}
              onFocus={this.handleOnDisplayNameChange}
              inputProps={{
                autoComplete: 'new-password',
                form: {
                  autoComplete: 'off'
                }
              }}
            />
            <TextField
              error={passwordError}
              helperText={passwordError ? 'La contraseña es incorrecta' : null}
              id="password"
              label="Contraseña"
              margin="normal"
              onChange={this.handleOnPasswordChange}
              onFocus={this.handleOnPasswordChange}
              type="password"
              inputProps={{
                autoComplete: 'new-password',
                form: {
                  autoComplete: 'off'
                }
              }}
            />
            <TextField
              error={passwordRepeatError}
              helperText={
                passwordRepeatError ? 'Las contraseñas no coinciden' : null
              }
              id="password-repeat"
              label="Repita su contraseña"
              margin="normal"
              onChange={this.handleOnPasswordRepeatChange}
              onFocus={this.handleOnPasswordRepeatChange}
              onKeyPress={this.handleEnterKeyPress}
              type="password"
              inputProps={{
                autoComplete: 'new-password',
                form: {
                  autoComplete: 'off'
                }
              }}
            />
            <Button color="primary" onClick={this.doSignup} variant="contained">
              {this.props.isFetching ? (
                <CircularProgress className="progress" size={24} />
              ) : (
                <span>Registrarme</span>
              )}
            </Button>
          </div>
          <div className="footer">
            <span>Ya tengo una cuenta,</span>
            <Link to={'/signin'}>ingresar</Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { isFetching: state.isFetching, message: state.message };
};

const mapDispatchToProps = dispatch => ({
  doSignup: data => dispatch(user.doSignup(data)),
  setMessage: data => dispatch(comunication.setMessage(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup);
