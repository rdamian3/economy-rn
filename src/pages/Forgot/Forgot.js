import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { user } from '../../store/actions/index';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import './Forgot.scss';

class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailError: false
    };
  }

  handleOnEmailChange = event => {
    const email = event.target.value;
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const emailError = re.test(String(email).toLowerCase());
    this.setState({ email, emailError: !emailError });
  };

  doForgot = () => {
    const { email, emailError } = this.state;
    if (!emailError && email !== '') {
      alert('entra');
    } else {
      this.setState({ emailError: true });
    }
  };

  componentWillUpdate(prevProps) {
    if (
      prevProps.message !== this.props.message &&
      this.props.message.kind === 'user'
    ) {
      this.props.message.type === 'success' &&
        this.props.history.push('/signin');
    }
  }

  handleEnterKeyPress = event => {
    if (event.key === 'Enter') {
      this.doForgot();
    }
  };

  render() {
    return (
      <div className="Forgot">
        <div className="card">
          <div className="body">
            <Typography variant="body1" component="span">
              Recuperar mi contraseña
            </Typography>
            <TextField
              error={this.state.emailError}
              id="email"
              label="Email"
              margin="normal"
              onChange={this.handleOnEmailChange}
              onKeyPress={this.handleEnterKeyPress}
              helperText={
                this.state.emailError ? 'Ingrese un email válido' : null
              }
            />
            <Button color="primary" onClick={this.doForgot} variant="contained">
              {this.props.isFetching ? (
                <CircularProgress className="progress" size={24} />
              ) : (
                <span>Recuperar</span>
              )}
            </Button>
          </div>
          <div className="footer">
            <span>Tienes un cuenta?</span>
            <Link to={'/signin'}>Ingresa!</Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { isFetching: state.isFetching };
};

const mapDispatchToProps = dispatch => ({
  doForgot: data => dispatch(user.doForgot(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Forgot);
