import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { comunication } from '../../store/actions/index';

import './Snack.scss';

const Snack = (props) => {
  const { messageMessage, clearMessages, messageType } = props;
  return (
    <div className="Snack">
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={messageMessage !== ''}
        onClose={clearMessages}
        autoHideDuration={3000}
      >
        <SnackbarContent
          className={messageType}
          aria-describedby="client-snackbar"
          message={<span id="client-snackbar">{messageMessage}</span>}
          action={[
            <IconButton key="close" aria-label="Close" color="inherit" onClick={clearMessages}>
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>
    </div>
  );
};

Snack.propTypes = {
  messageMessage: PropTypes.string.isRequired,
  clearMessages: PropTypes.func.isRequired,
  messageType: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  messageMessage: state.message.message,
  messageType: state.message.type,
});

const mapDispatchToProps = dispatch => ({
  clearMessages: () => dispatch(comunication.clearMessage()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Snack);
