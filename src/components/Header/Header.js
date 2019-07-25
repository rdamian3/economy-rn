import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import "./Header.scss";

import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListIcon from "@material-ui/icons/List";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import PrintIcon from "@material-ui/icons/Print";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import CloseIcon from "@material-ui/icons/Close";
import Divider from "@material-ui/core/Divider";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: "",
      displayName: "",
      isOpen: false,
      links: [
        {
          text: "Principal",
          link: "/home",
          icon: <HomeIcon color={"primary"} />
        },
        {
          text: "Listado",
          link: "/list",
          icon: <ListIcon color={"primary"} />
        },
        {
          text: "Reportes",
          link: "/report",
          icon: <PrintIcon color={"primary"} />
        }
      ]
    };
  }

  toggleOpenDrawer = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  navigateTo = () => {
    this.props.history.push("/profile");
  };

  componentDidUpdate(prevProps) {
    if (prevProps.userData !== this.props.userData) {
      const { avatar, displayName } = this.props.userData;
      this.setState({ avatar, displayName });
    }
  }

  componentDidMount() {
    if (this.props.userData !== null) {
      const { avatar, displayName } = this.props.userData;
      this.setState({ avatar, displayName });
    }
  }

  render() {
    const { avatar, displayName } = this.state;

    return (
      <div className="Header">
        <Hidden smUp implementation="js">
          <Drawer open={this.state.isOpen} className="drawer">
            <List style={{ width: 300 }}>
              <ListItem
                button
                onClick={this.toggleOpenDrawer}
                style={{ justifyContent: "flex-end" }}
              >
                <CloseIcon />
              </ListItem>
              <Divider />
              {this.state.links.map((item, index) => (
                <Link to={item.link} key={item.text + index}>
                  <ListItem button onClick={this.toggleOpenDrawer}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                </Link>
              ))}
            </List>
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="js">
          <Drawer open={true} className="drawer" variant="permanent">
            <List style={{ width: 300 }}>
              {this.state.links.map((item, index) => (
                <Link to={item.link} key={item.text + index}>
                  <ListItem button>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                </Link>
              ))}
            </List>
          </Drawer>
        </Hidden>
        <div className="icon">
          <MenuIcon htmlColor="#FFFFFF" onClick={this.toggleOpenDrawer} />
        </div>
        <div className="title" />
        <div className="user-info">
          <span>{displayName}</span>
          <img
            className="user-img"
            src={
              avatar !== ""
                ? avatar
                : require("./../../assets/avatar-placeholder.png")
            }
            alt=""
          />
          <ul className="user-menu">
            <li onClick={this.navigateTo}>
              <PersonIcon />
              <span>Tu perfil</span>
            </li>
            <li>
              <ExitToAppIcon />
              <span>Salir</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { userData: state.userData };
};

export default withRouter(connect(mapStateToProps)(Header));
