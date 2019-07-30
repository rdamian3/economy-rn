import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import Draggable from "react-draggable";
import "./Modal.scss";

class Modal extends Component {
  render() {
    let title,
      borders = null;

    if (this.props.typeOfMovement) {
      title =
        this.props.typeOfMovement === "income"
          ? "Nuevo ingreso"
          : "Nuevo egreso";
      borders =
        this.props.typeOfMovement === "income" ? " positive" : " negative";
    }

    return (
      <div className={"modal " + (this.props.isOpen ? "is-open" : "")}>
        <Draggable
          bounds="parent"
          onStart={() => this.props.isDraggable}
          defaultPosition={{ x: this.props.x, y: this.props.y }}
        >
          <div className={"modal-container " + (borders && borders)}>
            <div className="head">
              {this.props.title ? <span> {this.props.title} </span> : null}
              {title ? <span> {title} </span> : null}
              <CloseIcon onClick={this.props.toggleModal} className="close" />
            </div>
            <div
              className="body"
              onMouseDown={e => {
                e.stopPropagation();
              }}
            >
              {this.props.children}
            </div>
            <div
              className="footer"
              onMouseDown={e => {
                e.stopPropagation();
              }}
            >
              <Button onClick={this.props.toggleModal}>Cancelar</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={this.props.acceptAction}
              >
                {this.props.isFetching ? (
                  <CircularProgress className="progress" size={24} />
                ) : (
                  <span>Aceptar</span>
                )}
              </Button>
            </div>
          </div>
        </Draggable>
        <div className="background" onClick={this.props.toggleModal} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { isFetching: state.isFetching };
};

export default connect(mapStateToProps)(Modal);
