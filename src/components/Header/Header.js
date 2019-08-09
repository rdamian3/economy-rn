import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import './Header.scss';

import CategoryIcon from '@material-ui/icons/Category';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Hidden from '@material-ui/core/Hidden';
import HomeIcon from '@material-ui/icons/Home';
import List from '@material-ui/core/List';
import ListIcon from '@material-ui/icons/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import PrintIcon from '@material-ui/icons/Print';
import { user } from '../../store/actions/index';

const defaultAvatar = require('./../../assets/avatar-placeholder.png');

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: '',
      displayName: '',
      isOpen: false,
      links: [
        {
          text: 'Principal',
          link: '/home',
          icon: <HomeIcon color="primary" />,
        },
        {
          text: 'Listado',
          link: '/list',
          icon: <ListIcon color="primary" />,
        },
        {
          text: 'Reportes',
          link: '/report',
          icon: <PrintIcon color="primary" />,
        },
        {
          text: 'Categorías',
          link: '/categories',
          icon: <CategoryIcon color="primary" />,
        },
      ],
    };
  }

  componentDidMount() {
    const { userData } = this.props;
    if (userData !== null) {
      let { avatar } = userData;
      const { displayName } = userData;
      if (!avatar) {
        avatar = '';
      }
      this.setState({ avatar, displayName });
    }
  }

  componentDidUpdate(prevProps) {
    const { userData } = this.props;
    if (prevProps.userData !== userData) {
      let { avatar } = userData;
      const { displayName } = userData;

      if (!avatar) {
        avatar = '';
      }
      this.setState({ avatar, displayName });
    }
  }

  doLogout = () => {
    const { doLogout } = this.props;
    doLogout();
  };

  toggleOpenDrawer = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  navigateTo = () => {
    const { history } = this.props;
    history.push('/profile');
  };

  render() {
    const {
      avatar, displayName, isOpen, links,
    } = this.state;

    return (
      <div className="Header">
        <Hidden smUp implementation="js">
          <Drawer open={isOpen} className="drawer">
            <List style={{ width: 300 }}>
              <ListItem
                button
                onClick={this.toggleOpenDrawer}
                style={{ justifyContent: 'flex-end' }}
              >
                <CloseIcon />
              </ListItem>
              <Divider />
              {links.map(item => (
                <Link to={item.link} key={item.text + item.link}>
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
          <Drawer open className="drawer" variant="permanent">
            <List style={{ width: 300 }}>
              {links.map(item => (
                <Link to={item.link} key={item.text + item.link}>
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
          <img className="user-img" src={avatar !== '' ? avatar : defaultAvatar} alt="" />
          <ul className="user-menu">
            <li onClick={this.navigateTo}>
              <PersonIcon />
              <span>Tu perfil</span>
            </li>
            <li onClick={this.doLogout}>
              <ExitToAppIcon />
              <span>Salir</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  userData: PropTypes.objectOf,
  doLogout: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired,
};

Header.defaultProps = {
  userData: {},
};

const mapStateToProps = state => ({ userData: state.userData });

const mapDispatchToProps = dispatch => ({
  doLogout: () => dispatch(user.doLogout()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Header),
);
