import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'moment/locale/es';
import Button from '@material-ui/core/Button';
import DateRange from '@material-ui/icons/DateRange';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MomentUtils from '@date-io/moment';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import MovementsTable from '../../components/MovementsTable/MovementsTable';
import { comunication } from '../../store/actions/index';

import './Reports.scss';

class Reports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateFrom: moment.utc(),
      dateTo: moment.utc(),
      category: { name: '', _id: '' },
      movements: [],
      categories: [],
      filteredMovements: [],
      itemCount: 0,
      filterTotal: 0,
    };
  }

  componentDidMount() {
    const { movements, categories } = this.props;
    const all = { name: 'Todas las categorías', _id: 'all' };
    this.setState({ movements, categories: [all, ...categories] });
  }

  componentDidUpdate(prevProps) {
    const { movements, categories } = this.props;
    const all = { name: 'Todas las categorías', _id: 'all' };

    if (prevProps.movements !== movements) {
      this.setState({ movements });
    }
    if (prevProps.categories !== categories) {
      this.setState({ categories: [all, ...categories] });
    }
  }

  doFilterMovements = () => {
    const {
      dateFrom, dateTo, category, movements,
    } = this.state;
    const { setMessage } = this.props;
    if (movements.length === 0) {
      setMessage({
        message: 'No hay movimientos para filtrar',
        type: 'error',
        kind: 'category',
      });
    } else {
      let itemCount = 0;
      let filterTotal = 0;
      const filteredMovements = movements
        .filter((el) => {
          if (
            moment(el.date).isSameOrAfter(dateFrom, 'day')
            && moment(el.date).isSameOrBefore(dateTo, 'day')
          ) {
            itemCount += itemCount + 1;
            filterTotal += el.amount;
            return true;
          }
          return false;
        })
        .filter((el) => {
          if (category.name !== '' && category._id !== 'all') {
            return category._id === el.category._id;
          }
          return true;
        });
      if (filteredMovements) {
        this.setState({ filteredMovements, itemCount, filterTotal });
      }
    }
  };

  handleCategoryChange = (event) => {
    const name = event.currentTarget.innerText;
    const _id = event.target.value !== undefined ? event.target.value : '';
    this.setState({ category: { name, _id } });
  };

  handleDateFromChange = (date) => {
    const dateFrom = moment.utc(date);
    this.setState({ dateFrom });
  };

  handleDateToChange = (date) => {
    const dateTo = moment.utc(date);
    this.setState({ dateTo });
  };

  render() {
    const {
      dateFrom,
      dateTo,
      categories,
      category,
      filteredMovements,
      itemCount,
      filterTotal,
    } = this.state;

    return (
      <div className="Reports">
        <div className="card">
          <Typography variant="body1" component="span" className="title">
            Generar reportes
          </Typography>
          <div className="body">
            <div className="container">
              <div className="date-from">
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
                    name="date-from"
                    onChange={date => this.handleDateFromChange(date)}
                    value={dateFrom}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <div className="date-to">
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
                    name="date-to"
                    onChange={date => this.handleDateToChange(date)}
                    value={dateTo}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <FormControl className="category">
                <InputLabel htmlFor="cat">Categoría</InputLabel>
                <Select
                  className="select"
                  inputProps={{
                    name: 'category',
                    id: 'cat',
                  }}
                  onChange={this.handleCategoryChange}
                  value={category._id}
                >
                  {categories.length > 0 ? (
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

              <Button
                className="btn-add"
                color="primary"
                size="small"
                variant="contained"
                onClick={this.doFilterMovements}
              >
                Filtrar
              </Button>
            </div>
          </div>
          <MovementsTable movements={filteredMovements} />
          {filteredMovements.length !== 0 ? (
            <div className="footer">
              <span className="count">
                Cantidad de movimientos:
                <span className="number">{itemCount}</span>
              </span>
              <span className="total">
                Total:
                <span className="number">
$
                  {filterTotal}
                </span>
              </span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

Reports.propTypes = {
  movements: PropTypes.array,
  categories: PropTypes.array,
  setMessage: PropTypes.func.isRequired,
};

Reports.defaultProps = {
  movements: PropTypes.array,
  categories: [],
};

const mapStateToProps = state => ({ movements: state.movements, categories: state.categories });

const mapDispatchToProps = dispatch => ({
  setMessage: data => dispatch(comunication.setMessage(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reports);
