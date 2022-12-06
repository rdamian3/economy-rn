import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Modal from '../../components/Modal/Modal';
import { movement, comunication } from '../../store/actions/index';
import AddMovement from '../../components/AddMovement/AddMovement';
import MovementsTable from '../../components/MovementsTable/MovementsTable';

import './MovementList.scss';

class MovementList extends PureComponent {
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
        description: '',
      },
      typeOfMovement: 'income',
    };
  }

  componentDidMount() {
    this.setMovementsToState();
  }

  componentDidUpdate(prevProps) {
    const { movements } = this.props;
    if (prevProps.movements !== movements) {
      this.setMovementsToState();
    }
  }

  setMovementsToState = () => {
    const { movements } = this.props;
    const movs = movements.map((el) => ({
      _id: el._id,
      amount: el.amount,
      category: { name: el.category.name, _id: el.category._id },
      date: el.date,
      description: el.description,
    }));
    this.setState({ movs });
  };

  addNewMovement = () => {
    const { newMovement, typeOfMovement } = this.state;
    const { addMovement, setMessage } = this.props;

    this.setState({ categoryError: newMovement.category.name === '' });
    this.setState({
      amountError: newMovement.amount === 0 || newMovement.amount === '0',
    });
    if (
      newMovement.amount !== 0
      && newMovement.amount !== '0'
      && newMovement.category.name !== ''
    ) {
      if (typeOfMovement !== 'income') {
        newMovement.amount = -Math.abs(newMovement.amount);
      }
      addMovement(newMovement);
      this.clearNewMovementState();
      this.toggleModal();
    } else {
      setMessage({
        message: 'Verifique los campos',
        type: 'error',
        kind: 'category',
      });
    }
  };

  clearNewMovementState = () => {
    const newMovement = {
      amount: 0,
      category: { name: '', _id: '' },
      date: new Date(),
      description: '',
    };
    this.setState({ newMovement });
  };

  dynamicStateChanger = (name, value) => {
    this.setState((prevState) => {
      const newMovement = { ...prevState.newMovement };
      newMovement[name] = value;
      return { newMovement };
    });
  };

  handleNewMovement = (event) => {
    const { name, value } = event.target;
    const { amountError, categoryError } = this.state;

    if (name === 'amount') {
      this.setState({ amountError: value === 0 || value === '0' });
      if (!amountError) {
        return this.dynamicStateChanger(name, value);
      }
    }

    if (name === 'category') {
      this.setState({ categoryError: value._id === '' });
      if (!categoryError) {
        return this.dynamicStateChanger(name, value);
      }
    }

    return this.dynamicStateChanger(name, value);
  };

  toggleModal = () => {
    const { isModalOpen } = this.state;
    this.setState({ isModalOpen: !isModalOpen });
  };

  toggleTypeOfMovement = (typeOfMovement) => {
    this.setState({ typeOfMovement });
    this.toggleModal();
  };

  render() {
    const {
      movs,
      isModalOpen,
      typeOfMovement,
      amountError,
      categoryError,
      newMovement,
    } = this.state;
    const startX = document.getElementsByClassName('modal-container').offsetWidth / 2;

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
          x={-startX}
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

MovementList.propTypes = {
  movements: PropTypes.array,
  addMovement: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};

MovementList.defaultProps = {
  movements: [],
};

const mapStateToProps = (state) => ({ movements: state.movements });

const mapDispatchToProps = (dispatch) => ({
  addMovement: (data) => dispatch(movement.addMovement(data)),
  setMessage: (data) => dispatch(comunication.setMessage(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MovementList);
