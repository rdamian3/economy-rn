import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { user, comunication } from "./../../store/actions/index";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import "./Profile.scss";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      emailError: false,
      displayName: "",
      displayNameError: false,
      password: "",
      passwordError: false,
      passwordRepeat: "",
      passwordRepeatError: false
    };
  }

  handleEnterKeyPress = event => {
    if (event.key === "Enter") {
      this.doUpdate();
    }
  };

  handleOnEmailChange = event => {
    const email = event.target.value;
    const regEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const emailError = regEx.test(String(email).toLowerCase());
    this.setState({ email, emailError: !emailError });
  };

  handleOnDisplayNameChange = event => {
    const displayName = event.target.value;
    const displayNameError = displayName.length < 2;
    this.setState({ displayName, displayNameError });
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

  doUpdate = () => {
    const {
      emailError,
      passwordError,
      displayNameError,
      passwordRepeatError,
      email,
      displayName
    } = this.state;

    if (
      !emailError &&
      !passwordError &&
      !displayNameError &&
      !passwordRepeatError
    ) {
      const data = {
        email,
        displayName
      };

      this.props.doUpdate(data);
    } else {
      this.props.setMessage({
        message: "Verifique los campos",
        type: "error",
        kind: "category"
      });
    }
  };

  doDelete = () => {
    if (window.confirm("Quieres eliminar tu cuenta?")) {
      this.props.doDelete();
    }
  };

  componentDidMount() {
    const { email, displayName } = this.props.userData;
    this.setState({ email, displayName });
  }

  render() {
    const { displayName, displayNameError, email, emailError } = this.state;

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
                  {moment(this.props.userData.signupDate)
                    .locale("es")
                    .utc()
                    .format("DD/MM/YYYY")}
                </span>
              </div>
              <div className="image-container">
                <img
                  className="image"
                  src={require("./../../assets/avatar-placeholder.png")}
                  alt=""
                />
                <Button
                  size="small"
                  onClick={this.doUpdate}
                  variant="contained"
                >
                  {this.props.isFetching ? (
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
                helperText={emailError ? "El email es inválido" : null}
                id="email"
                label="Email"
                margin="normal"
                onChange={this.handleOnEmailChange}
                inputProps={{
                  autoComplete: "new-password",
                  maxLength: 50,
                  form: {
                    autoComplete: "off"
                  }
                }}
                value={email}
              />
              <TextField
                error={displayNameError}
                helperText={displayNameError ? "Ingrese un nombre" : null}
                id="name"
                label="Nombre"
                margin="normal"
                onChange={this.handleOnDisplayNameChange}
                inputProps={{
                  maxLength: 20,
                  autoComplete: "new-password",
                  form: {
                    autoComplete: "off"
                  }
                }}
                value={displayName}
              />
            </div>
          </div>
          <div className="footer">
            <Link color="error" onClick={this.doDelete} className="delete">
              <span>Eliminar mi cuenta</span>
            </Link>
            <Button color="primary" onClick={this.doUpdate} variant="contained">
              {this.props.isFetching ? (
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

const mapStateToProps = state => {
  return { isFetching: state.isFetching, userData: state.userData };
};

const mapDispatchToProps = dispatch => ({
  doUpdate: data => dispatch(user.doUpdate(data)),
  doDelete: () => dispatch(user.doDelete()),
  setMessage: data => dispatch(comunication.setMessage(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
