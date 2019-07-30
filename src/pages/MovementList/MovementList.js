import React, { Component } from "react";
import { connect } from "react-redux";

import { movement, comunication } from "../../store/actions/index";
import Modal from "../../components/Modal/Modal";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import AddMovement from "../../components/AddMovement/AddMovement";
import MovementsTable from "../../components/MovementsTable/MovementsTable";

import "./MovementList.scss";

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
        category: { name: "", _id: "" },
        date: new Date(),
        description: ""
      },
      typeOfMovement: "income"
    };

    this.getMovementsOnStartUp();
  }

  addNewMovement = () => {
    let { newMovement, typeOfMovement } = this.state;
    this.setState({ categoryError: newMovement.category.name === "" });
    this.setState({
      amountError: newMovement.amount === 0 || newMovement.amount === "0"
    });
    if (
      newMovement.amount !== 0 &&
      newMovement.amount !== "0" &&
      newMovement.category.name !== ""
    ) {
      if (typeOfMovement !== "income") {
        newMovement.amount = -Math.abs(newMovement.amount);
      }
      this.props.addMovement(newMovement);
      this.clearNewMovementState();
      this.toggleModal();
    } else {
      this.props.setMessage({
        message: "Verifique los campos",
        type: "error",
        kind: "category"
      });
    }
  };

  clearNewMovementState = () => {
    const newMovement = {
      amount: 0,
      category: { name: "", _id: "" },
      date: new Date(),
      description: ""
    };
    this.setState({ newMovement });
  };

  dynamicStateChanger = (name, value) => {
    this.setState(prevState => {
      let newMovement = Object.assign({}, prevState.newMovement);
      newMovement[name] = value;
      return { newMovement };
    });
  };

  getMovementsOnStartUp = () => {
    this.props.getMovements();
  };

  handleNewMovement = event => {
    const { name, value } = event.target;
    const { amountError, categoryError } = this.state;

    if (name === "amount") {
      this.setState({ amountError: value === 0 || value === "0" });
      if (!amountError) {
        return this.dynamicStateChanger(name, value);
      }
    }

    if (name === "category") {
      this.setState({ categoryError: value._id === "" });
      if (!categoryError) {
        return this.dynamicStateChanger(name, value);
      }
    }

    this.dynamicStateChanger(name, value);
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
          onClick={() => this.toggleTypeOfMovement("income")}
        >
          <AddIcon />
        </Fab>
        <Fab
          aria-label="Remove"
          className="remove"
          disableFocusRipple
          disableRipple
          onClick={() => this.toggleTypeOfMovement("expense")}
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
