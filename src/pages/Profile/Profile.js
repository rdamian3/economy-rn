import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { user, comunication } from '../../store/actions/index';
import './Profile.scss';

const defaultAvatar = require('../../assets/avatar-placeholder.png');

class Profile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      avatar: '',
      email: '',
      emailError: false,
      displayName: '',
      displayNameError: false,
      passwordError: false,
      passwordRepeatError: false,
    };
  }

  componentDidMount() {
    const { userData } = this.props;
    const { email, displayName } = userData;
    let { avatar } = userData;
    if (!avatar) {
      avatar = '';
    }
    this.setState({ avatar, email, displayName });
  }

  componentDidUpdate(prevProps) {
    const { userData } = this.props;
    if (prevProps.userData !== userData) {
      const { email, displayName } = userData;
      let { avatar } = userData;
      if (!avatar) {
        avatar = '';
      }
      this.setState({ avatar, email, displayName });
    }
  }

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

  doUpload = (evt) => {
    const img = evt.target.files[0];
    const { setMessage, doUpload } = this.props;

    if (!img) {
      return;
    }
    if (img.type !== 'image/jpeg' && img.type !== 'image/png') {
      setMessage({
        message: 'Sólo se admiten imágenes',
        type: 'error',
        kind: '',
      });
    }
    if (img.size > 1000000) {
      setMessage({
        message: 'El tamaño máximo es de 1MB',
        type: 'error',
        kind: '',
      });
    }

    doUpload(img);
  };

  doUpdate = () => {
    const { setMessage, doUpdate } = this.props;
    const {
      emailError,
      passwordError,
      displayNameError,
      passwordRepeatError,
      email,
      displayName,
    } = this.state;

    if (!emailError && !passwordError && !displayNameError && !passwordRepeatError) {
      const data = {
        email,
        displayName,
      };

      doUpdate(data);
    } else {
      setMessage({
        message: 'Verifique los campos',
        type: 'error',
        kind: 'category',
      });
    }
  };

  doDelete = () => {
    if (window.confirm('Quieres eliminar tu cuenta?')) {
      const { doDelete } = this.props;
      doDelete();
    }
  };

  render() {
    const {
      avatar, displayName, displayNameError, email, emailError,
    } = this.state;
    const { userData, isFetching } = this.props;

    return (
      <div className="Profile">
        <div className="card">
          <div className="container">
            <div className="sidebar">
              <Typography variant="body1" component="span" className="title">
                Tu perfil
              </Typography>
              <div className="member-since">
                <span>Miembro desde:</span>
                <span>
                  {moment(userData.signupDate)
                    .locale('es')
                    .utc()
                    .format('DD/MM/YYYY')}
                </span>
              </div>
              <div className="image-container">
                <img className="image" src={avatar !== '' ? avatar : defaultAvatar} alt="" />
                <Button variant="contained" component="label">
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    name="avatar"
                    onChange={this.doUpload}
                  />
                  {isFetching ? (
                    <CircularProgress className="progress" size={24} />
                  ) : (
                    <span>Cambiar foto</span>
                  )}
                </Button>
              </div>
            </div>
            <div className="body">
              <TextField
                error={emailError}
                helperText={emailError ? 'El email es inválido' : null}
                id="email"
                label="Email"
                margin="normal"
                onChange={this.handleOnEmailChange}
                inputProps={{
                  autoComplete: 'new-password',
                  maxLength: 50,
                  form: {
                    autoComplete: 'off',
                  },
                }}
                value={email}
              />
              <TextField
                error={displayNameError}
                helperText={displayNameError ? 'Ingrese un nombre' : null}
                id="name"
                label="Nombre"
                margin="normal"
                onChange={this.handleOnDisplayNameChange}
                inputProps={{
                  maxLength: 20,
                  autoComplete: 'new-password',
                  form: {
                    autoComplete: 'off',
                  },
                }}
                value={displayName}
              />
            </div>
          </div>
          <div className="footer">
            <Button onClick={this.doDelete}>
              <span>Eliminar mi cuenta</span>
            </Button>
            <Button color="primary" onClick={this.doUpdate} variant="contained">
              {isFetching ? (
                <CircularProgress className="progress" size={24} />
              ) : (
                <span>Actualizar</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  userData: PropTypes.shape({
    signupDate: PropTypes.string,
    _id: PropTypes.string,
    email: PropTypes.string,
    displayName: PropTypes.string,
    avatar: PropTypes.string,
    bucket: PropTypes.string,
  }),
  setMessage: PropTypes.func.isRequired,
  doUpdate: PropTypes.func.isRequired,
  doDelete: PropTypes.func.isRequired,
  doUpload: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

Profile.defaultProps = {
  userData: {
    signupDate: '',
    _id: '',
    email: '',
    displayName: '',
    avatar: '',
    bucket: '',
  },
};

const mapStateToProps = (state) => ({ isFetching: state.isFetching, userData: state.userData });

const mapDispatchToProps = (dispatch) => ({
  doUpload: (data) => dispatch(user.doUpload(data)),
  doUpdate: (data) => dispatch(user.doUpdate(data)),
  doDelete: () => dispatch(user.doDelete()),
  setMessage: (data) => dispatch(comunication.setMessage(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
