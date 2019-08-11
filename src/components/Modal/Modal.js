import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import Draggable from 'react-draggable';
import './Modal.scss';

const Modal = (props) => {
  let componentTitle;
  let borders = null;
  const {
    typeOfMovement,
    isOpen,
    isDraggable,
    x,
    y,
    title,
    toggleModal,
    children,
    acceptAction,
    isFetching,
  } = props;

  if (typeOfMovement) {
    componentTitle = typeOfMovement === 'income' ? 'Nuevo ingreso' : 'Nuevo egreso';
    borders = typeOfMovement === 'income' ? ' positive' : ' negative';
  }

  return (
    <div className={`modal ${isOpen ? 'is-open' : ''}`}>
      <Draggable bounds="parent" onStart={() => isDraggable} defaultPosition={{ x, y }}>
        <div className={`modal-container ${borders && borders}`}>
          <div className="head">
            {title ? <span>{title}</span> : null}
            {componentTitle ? <span>{componentTitle}</span> : null}
            <CloseIcon onClick={toggleModal} className="close" />
          </div>
          <div
            className="body"
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
          >
            {children}
          </div>
          <div
            className="footer"
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
          >
            <Button onClick={toggleModal}>Cancelar</Button>
            <Button variant="contained" color="primary" onClick={acceptAction}>
              {isFetching ? (
                <CircularProgress className="progress" size={24} />
              ) : (
                <span>Aceptar</span>
              )}
            </Button>
          </div>
        </div>
      </Draggable>
      <div className="background" onClick={toggleModal} />
    </div>
  );
};

Modal.propTypes = {
  typeOfMovement: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isDraggable: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  acceptAction: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  title: PropTypes.string,
  children: PropTypes.element.isRequired,
};

Modal.defaultProps = {
  typeOfMovement: 'income',
  x: 0,
  y: 0,
  title: '',
};

const mapStateToProps = state => ({ isFetching: state.isFetching });

export default connect(mapStateToProps)(Modal);
