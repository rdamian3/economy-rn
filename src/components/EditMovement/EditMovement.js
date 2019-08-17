import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import AttachMoney from '@material-ui/icons/AttachMoney';
import Description from '@material-ui/icons/Description';
import DateRange from '@material-ui/icons/DateRange';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import MomentUtils from '@date-io/moment';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import './EditMovement.scss';
import 'moment/locale/es';

class EditMovement extends Component {
  handleDateChange = (date) => {
    const utcDate = moment.utc(date).format();
    const event = { target: { name: 'date', value: utcDate } };
    const { handleEditMovement } = this.props;
    handleEditMovement(event);
  };

  handleCategoryChange = (event) => {
    const { handleEditMovement } = this.props;
    handleEditMovement({
      target: {
        name: 'category',
        value: { name: event.currentTarget.innerText, _id: event.target.value },
      },
    });
  };

  render() {
    const { categories, movementToEdit, handleEditMovement } = this.props;
    return (
      <div className="EditMovement">
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
            value={movementToEdit.date}
          />
        </MuiPickersUtilsProvider>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
          label="Monto"
          type="number"
          margin="normal"
          name="amount"
          value={movementToEdit.amount}
          onChange={handleEditMovement}
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
          onChange={handleEditMovement}
          value={movementToEdit.description}
        />
        <FormControl className="category">
          <InputLabel htmlFor="editCat">Categoría</InputLabel>
          <Select
            className="select"
            inputProps={{
              name: 'category',
              id: 'editCat',
            }}
            ref="categoryValue"
            value={movementToEdit.category._id}
            onChange={this.handleCategoryChange}
          >
            {categories ? (
              categories.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">No hay cateogrías</MenuItem>
            )}
          </Select>
        </FormControl>
      </div>
    );
  }
}

EditMovement.propTypes = {
  handleEditMovement: PropTypes.func.isRequired,
  movementToEdit: PropTypes.object.isRequired,
  categories: PropTypes.array,
};

EditMovement.defaultProps = {
  categories: [],
};

const mapStateToProps = state => ({ categories: state.categories });

export default connect(mapStateToProps)(EditMovement);
