import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import AddIcon from '@material-ui/icons/Add';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Description from '@material-ui/icons/Description';
import Button from '@material-ui/core/Button';
import DateRange from '@material-ui/icons/DateRange';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MomentUtils from '@date-io/moment';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Modal from '../Modal/Modal';
import AddCategory from '../AddCategory/AddCategory';
import { category, comunication } from '../../store/actions/index';

import './AddMovement.scss';
import 'moment/locale/es';

class AddMovement extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      childCategoryDesc: '',
      childCategoryName: '',
      isModalOpen: false,
    };
  }

  addNewCategory = () => {
    const { childCategoryDesc: description, childCategoryName: name } = this.state;
    const { addCategory, setMessage } = this.props;

    if (name !== '') {
      addCategory({ name, description });
      this.toggleModal();
    } else {
      setMessage({
        message: 'Verifique los campos',
        type: 'error',
        kind: 'category',
      });
    }
  };

  handleAmountChange = (event) => {
    const { handleNewMovement } = this.props;
    handleNewMovement(event);
  };

  handleCategoryChange = (event) => {
    const name = event.currentTarget.innerText !== 'No hay cateogrías' ? event.currentTarget.innerText : '';
    const _id = event.target.value !== undefined ? event.target.value : '';
    const { handleNewMovement } = this.props;

    handleNewMovement({
      target: {
        name: 'category',
        value: { name, _id },
      },
    });
  };

  handleDateChange = (date) => {
    const utcDate = moment.utc(date).format();
    const event = { target: { name: 'date', value: utcDate } };
    const { handleNewMovement } = this.props;
    handleNewMovement(event);
  };

  handleChildCategoryDesc = (event) => {
    const childCategoryDesc = event.target.value;
    this.setState({ childCategoryDesc });
  };

  handleChildCategoryName = (name) => {
    this.setState({ childCategoryName: name });
  };

  toggleModal = () => {
    const { isModalOpen } = this.state;
    this.setState({ isModalOpen: !isModalOpen });
  };

  render() {
    const {
      amountError,
      categoryError,
      categories,
      typeOfMovement,
      newMovement,
      handleNewMovement,
    } = this.props;
    const { isModalOpen } = this.state;
    const cat = categories || [];

    const startX = document.getElementsByClassName('modal-container').offsetWidth / 2;


    return (
      <div className="Addmovement">
        <h1 className={`title ${typeOfMovement === 'income' ? 'positive' : 'negative'}`}>
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
              ),
            }}
            name="date"
            onChange={date => this.handleDateChange(date)}
            value={newMovement.date}
          />
        </MuiPickersUtilsProvider>
        <TextField
          error={amountError}
          InputProps={{
            inputProps: { min: 0 },
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
                {typeOfMovement === 'income' ? null : '-'}
              </InputAdornment>
            ),
          }}
          label="Monto"
          margin="normal"
          name="amount"
          onChange={this.handleAmountChange}
          type="number"
        />
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Description />
              </InputAdornment>
            ),
          }}
          label="Descripción"
          margin="normal"
          name="description"
          onChange={handleNewMovement}
          value={newMovement.description}
        />
        <FormControl className="category">
          <InputLabel htmlFor="cat" error={categoryError}>
            Categoría
          </InputLabel>
          <Select
            className="select"
            error={categoryError}
            inputProps={{
              name: 'category',
              id: 'cat',
            }}
            onChange={this.handleCategoryChange}
            value={newMovement.category._id}
          >
            {cat.length > 0 ? (
              cat.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))
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
            isOpen={isModalOpen}
            title="Agregar Categoría"
            toggleModal={this.toggleModal}
            x={startX}
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

AddMovement.propTypes = {
  addCategory: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  handleNewMovement: PropTypes.func.isRequired,
  amountError: PropTypes.bool,
  categoryError: PropTypes.bool,
  categories: PropTypes.array,
  typeOfMovement: PropTypes.string,
  newMovement: PropTypes.shape(PropTypes.shape),
};

AddMovement.defaultProps = {
  amountError: false,
  categoryError: false,
  categories: [],
  typeOfMovement: 'income',
  newMovement: {},
};

const mapStateToProps = state => ({ categories: state.categories });

const mapDispatchToProps = dispatch => ({
  addCategory: data => dispatch(category.addCategory(data)),
  setMessage: data => dispatch(comunication.setMessage(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddMovement);
