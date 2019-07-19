import React, { Component } from 'react';
import { connect } from 'react-redux';
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
  handleDateChange = date => {
    const utcDate = moment.utc(date).format();
    const event = { target: { name: 'date', value: utcDate } };
    this.props.handleEditMovement(event);
  };

  handleCategoryChange = event => {
    this.props.handleEditMovement({
      target: {
        name: 'category',
        value: { name: event.currentTarget.innerText, _id: event.target.value }
      }
    });
  };

  render() {
    const cat = this.props.categories;
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
              )
            }}
            name="date"
            onChange={date => this.handleDateChange(date)}
            value={this.props.movementToEdit.date}
          />
        </MuiPickersUtilsProvider>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            )
          }}
          label="Monto"
          type="number"
          margin="normal"
          name="amount"
          value={this.props.movementToEdit.amount}
          onChange={this.props.handleEditMovement}
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
          onChange={this.props.handleEditMovement}
          value={this.props.movementToEdit.description}
        />
        <FormControl className="category">
          <InputLabel htmlFor="editCat">Categoría</InputLabel>
          <Select
            className="select"
            inputProps={{
              name: 'category',
              id: 'editCat'
            }}
            ref="categoryValue"
            value={this.props.movementToEdit.category._id}
            onChange={this.handleCategoryChange}
          >
            {cat ? (
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
        </FormControl>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { categories: state.categories };
};

export default connect(mapStateToProps)(EditMovement);
