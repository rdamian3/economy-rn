import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { category, comunication } from './../../store/actions/index';

import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import AddCategory from './../AddCategory/AddCategory';
import AddIcon from '@material-ui/icons/Add';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Description from '@material-ui/icons/Description';
import Button from '@material-ui/core/Button';
import DateRange from '@material-ui/icons/DateRange';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from './../Modal/Modal';
import MomentUtils from '@date-io/moment';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import './AddMovement.scss';
import 'moment/locale/es';

class AddMovement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      childCategoryDesc: '',
      childCategoryName: '',
      amountError: false,
      categoryError: false,
      isModalOpen: false
    };
  }

  addNewCategory = () => {
    const name = this.state.childCategoryName;
    const description = this.state.childCategoryDesc;
    if (name !== '') {
      this.props.addCategory({ name, description });
      this.toggleModal();
    } else {
      this.props.setMessage({
        message: 'Verifique los campos',
        type: 'error',
        kind: 'category'
      });
    }
  };

  handleAmountChange = event => {
    this.setState({ amountError: event.target.value === 0 });
    this.props.handleNewMovement(event);
  };

  handleCategoryChange = event => {
    const name = event.currentTarget.innerText;
    const _id = event.target.value !== undefined ? event.target.value : '';

    this.props.handleNewMovement({
      target: {
        name: 'category',
        value: { name, _id }
      }
    });
  };

  handleDateChange = date => {
    const utcDate = moment.utc(date).format();
    const event = { target: { name: 'date', value: utcDate } };
    this.props.handleNewMovement(event);
  };

  handleChildCategoryDesc = event => {
    const childCategoryDesc = event.target.value;
    if (childCategoryDesc === '') {
    }
    this.setState({ childCategoryDesc });
  };

  handleChildCategoryName = name => {
    this.setState({ childCategoryName: name });
  };

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  render() {
    const {
      categories,
      typeOfMovement,
      newMovement,
      handleNewMovement,
      categoryError
    } = this.props;

    const cat = categories ? categories : [];

    return (
      <div className="Addmovement">
        <h1
          className={
            'title ' + (typeOfMovement === 'income' ? 'positive' : 'negative')
          }
        >
          {typeOfMovement === 'income' ? 'Ingreso' : 'Egreso'}
        </h1>
        <MuiPickersUtilsProvider utils={MomentUtils} locale="es">
          <DatePicker
            format="DD/MM/YYYY"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DateRange />
                </InputAdornment>
              )
            }}
            name="date"
            onChange={date => this.handleDateChange(date)}
            value={newMovement.date}
          />
        </MuiPickersUtilsProvider>
        <TextField
          error={this.state.amountError}
          InputProps={{
            inputProps: { min: 0 },
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
                {typeOfMovement === 'income' ? null : '-'}
              </InputAdornment>
            )
          }}
          label="Monto"
          margin="normal"
          name="amount"
          onChange={this.handleAmountChange}
          type="number"
          value={newMovement.amount}
        />
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Description />
              </InputAdornment>
            )
          }}
          label="Descripción"
          margin="normal"
          name="description"
          onChange={handleNewMovement}
          value={newMovement.description}
        />
        <FormControl className="category">
          <InputLabel htmlFor="cat" error={this.state.categoryError}>
            Categoría
          </InputLabel>
          <Select
            className="select"
            error={categoryError}
            inputProps={{
              name: 'category',
              id: 'cat'
            }}
            onChange={this.handleCategoryChange}
            value={newMovement.category._id}
          >
            {cat.length > 0 ? (
              cat.map((item, index) => {
                return (
                  <MenuItem key={item._id + index} value={item._id}>
                    {item.name}
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem value="">No hay cateogrías</MenuItem>
            )}
          </Select>
          <Button
            className="btn-add"
            color="primary"
            onClick={this.toggleModal}
            size="small"
            variant="contained"
          >
            <AddIcon />
          </Button>
          <Modal
            acceptAction={this.addNewCategory}
            isDraggable={false}
            isOpen={this.state.isModalOpen}
            title="Agregar Categoría"
            toggleModal={this.toggleModal}
          >
            <AddCategory
              childCategoryDesc={this.handleChildCategoryDesc}
              childCategoryName={this.handleChildCategoryName}
            />
          </Modal>
        </FormControl>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { categories: state.categories };
};

const mapDispatchToProps = dispatch => ({
  addCategory: data => dispatch(category.addCategory(data)),
  setMessage: data => dispatch(comunication.setMessage(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMovement);
