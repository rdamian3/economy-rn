import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { user, comunication } from '../../store/actions/index';

import './Signup.scss';

class Signup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailError: true,
      displayName: '',
      displayNameError: false,
      password: '',
      passwordError: false,
      passwordRepeatError: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { message, history } = this.props;
    if (prevProps.message !== message && message.kind === 'user' && message.type === 'success') {
      history.push('/home');
    }
  }

  handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.doSignup();
    }
  };

  handleOnEmailChange = (event) => {
    const email = event.target.value;
    const regEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const emailError = regEx.test(String(email).toLowerCase());
    this.setState({ email, emailError: !emailError });
  };

  handleOnDisplayNameChange = (event) => {
    const displayName = event.target.value;
    const displayNameError = displayName.length < 2;
    this.setState({ displayName, displayNameError });
  };

  handleOnPasswordChange = (event) => {
    const password = event.target.value;
    const passwordError = password.length < 8;
    this.setState({ password, passwordError });
  };

  handleOnPasswordRepeatChange = (event) => {
    const { password } = this.state;
    const passwordRepeat = event.target.value;
    const passwordRepeatError = passwordRepeat !== password;
    this.setState({ passwordRepeatError });
  };

  doSignup = () => {
    const {
      email,
      password,
      emailError,
      displayName,
      passwordError,
      displayNameError,
      passwordRepeatError,
    } = this.state;

    const { doSignup, setMessage } = this.props;

    if (!emailError && !passwordError && !displayNameError && !passwordRepeatError) {
      const data = {
        email,
        password,
        displayName,
      };
      doSignup(data);
    } else {
      setMessage({
        message: 'Verifique los campos',
        type: 'error',
        kind: 'category',
      });
    }
  };

  render() {
    const {
      emailError, displayNameError, passwordError, passwordRepeatError,
    } = this.state;
    const { isFetching } = this.props;

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
                maxLength: 50,
                form: {
                  autoComplete: 'off',
                },
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
                maxLength: 20,
                form: {
                  autoComplete: 'off',
                },
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
                maxLength: 50,
                form: {
                  autoComplete: 'off',
                },
              }}
            />
            <TextField
              error={passwordRepeatError}
              helperText={passwordRepeatError ? 'Las contraseñas no coinciden' : null}
              id="password-repeat"
              label="Repita su contraseña"
              margin="normal"
              onChange={this.handleOnPasswordRepeatChange}
              onFocus={this.handleOnPasswordRepeatChange}
              onKeyPress={this.handleEnterKeyPress}
              type="password"
              inputProps={{
                autoComplete: 'new-password',
                maxLength: 50,
                form: {
                  autoComplete: 'off',
                },
              }}
            />
            <Button color="primary" onClick={this.doSignup} variant="contained">
              {isFetching ? (
                <CircularProgress className="progress" size={24} />
              ) : (
                <span>Registrarme</span>
              )}
            </Button>
          </div>
          <div className="footer">
            <span>Ya tengo una cuenta,</span>
            <Link to="/signin">ingresar</Link>
          </div>
        </div>
      </div>
    );
  }
}

Signup.propTypes = {
  setMessage: PropTypes.func.isRequired,
  message: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  history: PropTypes.object,
  doSignup: PropTypes.func.isRequired,
};

Signup.defaultProps = {
  message: {},
  history: null,
};

const mapStateToProps = (state) => ({ isFetching: state.isFetching, message: state.message });

const mapDispatchToProps = (dispatch) => ({
  doSignup: (data) => dispatch(user.doSignup(data)),
  setMessage: (data) => dispatch(comunication.setMessage(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Signup);
