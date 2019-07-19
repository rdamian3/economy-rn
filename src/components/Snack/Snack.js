import React, { Component } from 'react';
import { connect } from 'react-redux';
import { comunication } from './../../store/actions/index';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import './Snack.scss';

class Snack extends Component {
  render() {
    return (
      <div className="Snack">
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open={this.props.messageMessage !== ''}
          onClose={this.props.clearMessages}
          autoHideDuration={3000}
        >
          <SnackbarContent
            className={this.props.messageType}
            aria-describedby="client-snackbar"
            message={
              <span id="client-snackbar">{this.props.messageMessage}</span>
            }
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.props.clearMessages}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        </Snackbar>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    messageMessage: state.message.message,
    messageType: state.message.type
  };
};

const mapDispatchToProps = dispatch => ({
  clearMessages: () => dispatch(comunication.clearMessage())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Snack);
