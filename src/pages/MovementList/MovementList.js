import React, { Component } from 'react';
import { connect } from 'react-redux';

import { movement, comunication } from '../../store/actions/index';
import Modal from '../../components/Modal/Modal';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import AddMovement from '../../components/AddMovement/AddMovement';
import MovementsTable from '../../components/MovementsTable/MovementsTable';

import './MovementList.scss';

class MovementList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movs: [],
      isModalOpen: false,
      amountError: false,
      categoryError: false,
      newMovement: {
        amount: 0,
        category: { name: '', _id: '' },
        date: new Date(),
        description: ''
      },
      typeOfMovement: 'income'
    };

    this.getMovementsOnStartUp();
  }

  handleNewMovement = event => {
    const name = event.target.name;
    const value = event.target.value;
    const { amountError, categoryError } = this.state;

    if (name === 'amount') {
      this.setState({ amountError: value === '' });
    }

    if (name === 'category') {
      this.setState({ categoryError: value === '' });
    }

    if (!amountError && !categoryError) {
      this.setState(prevState => {
        let newMovement = Object.assign({}, prevState.newMovement);
        newMovement[name] = value;
        return { newMovement };
      });
    }
  };

  addNewMovement = () => {
    let { newMovement, typeOfMovement } = this.state;
    if (newMovement.amount !== '' && newMovement.category.name !== '') {
      if (typeOfMovement !== 'income') {
        newMovement.amount = -Math.abs(newMovement.amount);
      }
      this.props.addMovement(newMovement);
      this.toggleModal();
      this.clearNewMovementState();
    } else {
      this.props.setMessage({
        message: 'Verifique los campos',
        type: 'error',
        kind: 'category'
      });
    }
  };

  getMovementsOnStartUp = () => {
    this.props.getMovements();
  };

  clearNewMovementState = () => {
    const newMovement = {
      amount: 0,
      category: { name: '', _id: '' },
      date: new Date(),
      description: ''
    };
    this.setState({ newMovement });
  };

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  toggleTypeOfMovement = typeOfMovement => {
    this.setState({ typeOfMovement });
    this.toggleModal();
  };

  componentDidUpdate(prevProps) {
    if (prevProps.movements !== this.props.movements) {
      const movs = this.props.movements.map(el => {
        return {
          _id: el._id,
          amount: el.amount,
          category: { name: el.category.name, _id: el.category._id },
          date: el.date,
          description: el.description
        };
      });
      this.setState({ movs });
    }
  }

  render() {
    const {
      movs,
      isModalOpen,
      typeOfMovement,
      amountError,
      categoryError,
      newMovement
    } = this.state;
    return (
      <div className="MovementList">
        <Fab
          aria-label="Add"
          color="primary"
          disableFocusRipple
          disableRipple
          onClick={() => this.toggleTypeOfMovement('income')}
        >
          <AddIcon />
        </Fab>
        <Fab
          aria-label="Remove"
          className="remove"
          disableFocusRipple
          disableRipple
          onClick={() => this.toggleTypeOfMovement('expense')}
        >
          <RemoveIcon />
        </Fab>
        {movs.length > 0 ? (
          <MovementsTable movements={movs} />
        ) : (
          <div className="no-movements">
            <span>No hay movimientos...</span>
          </div>
        )}
        <Modal
          acceptAction={this.addNewMovement}
          isDraggable
          isOpen={isModalOpen}
          typeOfMovement={typeOfMovement}
          toggleModal={this.toggleModal}
          x={-100}
          y={-220}
        >
          <AddMovement
            amountError={amountError}
            categoryError={categoryError}
            handleNewMovement={this.handleNewMovement}
            newMovement={newMovement}
            typeOfMovement={typeOfMovement}
          />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { movements: state.movements };
};

const mapDispatchToProps = dispatch => ({
  addMovement: data => dispatch(movement.addMovement(data)),
  getMovements: () => dispatch(movement.getMovements()),
  setMessage: data => dispatch(comunication.setMessage(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MovementList);
