import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { movement } from './../../store/actions/index';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import EditMovement from '../EditMovement/EditMovement';
import IconButton from '@material-ui/core/IconButton';
import Modal from '../Modal/Modal';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import './MovementsTable.scss';

class MovementsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { title: 'Fecha', field: 'date' },
        { title: 'Monto', field: 'amount' },
        { title: 'Descripción', field: 'description' }
      ],
      isModalOpen: false,
      movs: [],
      page: 0,
      rowsPerPage: 8,
      sortBy: { type: 'date', asc: true },
      movementToEdit: {
        amount: 0,
        category: { name: '', _id: '' },
        date: '',
        description: '',
        _id: ''
      }
    };
  }

  setSort = type => {
    const sortBy = { type, asc: !this.state.sortBy.asc };
    this.setState({ sortBy });
  };

  doSort = (a, b) => {
    const { sortBy } = this.state;
    if (!sortBy.asc) {
      if (sortBy.type === 'date') {
        return a[sortBy.type] > b[sortBy.type] ? 1 : -1;
      } else if (sortBy.type === 'category') {
        return a[sortBy.type].name > b[sortBy.type].name ? 1 : -1;
      } else if (sortBy.type === 'amount') {
        return a[sortBy.type] - b[sortBy.type];
      }
    }

    if (sortBy.asc) {
      if (sortBy.type === 'date') {
        return a[sortBy.type] > b[sortBy.type] ? -1 : 1;
      } else if (sortBy.type === 'category') {
        return a[sortBy.type].name > b[sortBy.type].name ? -1 : 1;
      } else if (sortBy.type === 'amount') {
        return b[sortBy.type] - a[sortBy.type];
      }
    }
  };

  doUpdateMovement = () => {
    this.props.updateMovement(this.state.movementToEdit);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    const rowsPerPage = parseInt(event.target.value, 5);
    this.setState({ rowsPerPage });
  };

  handleEditMovement = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(prevState => {
      let movementToEdit = Object.assign({}, prevState.movementToEdit);
      movementToEdit[name] = value;
      return { movementToEdit };
    });
  };

  handleUpdateMovement = data => {
    this.setState({ movementToEdit: data });
    this.toggleModal();
  };

  handleDeleteMovement = data => {
    this.props.deleteMovement(data);
  };

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.message !== this.props.message &&
      this.props.message.kind === 'movement_update'
    ) {
      this.props.message.type === 'success' && this.toggleModal();
    }
  }

  render() {
    const movs = this.props.movements;
    if (movs.length === 0) {
      return null;
    }
    const { page, rowsPerPage, sortBy } = this.state;
    let currentDate = null;

    return (
      <div style={{ width: '100%' }}>
        <Table className="table-container">
          <TableHead className="table-head">
            <TableRow>
              <TableCell
                align="left"
                className="head-cell date-cell"
                onClick={() => this.setSort('date')}
              >
                Fecha
                <TableSortLabel
                  className="sort-label"
                  active={sortBy.type === 'date'}
                  direction={sortBy.asc ? 'asc' : 'desc'}
                />
              </TableCell>
              <TableCell
                align="left"
                className="head-cell amount-cell"
                onClick={() => this.setSort('amount')}
              >
                Monto
                <TableSortLabel
                  className="sort-label"
                  active={sortBy.type === 'amount'}
                  direction={sortBy.asc ? 'asc' : 'desc'}
                />
              </TableCell>
              <TableCell
                align="left"
                className="head-cell category-cell"
                onClick={() => this.setSort('category')}
              >
                Categoría
                <TableSortLabel
                  className="sort-label"
                  active={sortBy.type === 'category'}
                  direction={sortBy.asc ? 'asc' : 'desc'}
                />
              </TableCell>
              <TableCell align="left" className="description-cell">
                Descripción
              </TableCell>
              <TableCell className="option-cell" />
              <TableCell className="option-cell" />
            </TableRow>
          </TableHead>
          <TableBody>
            {movs.length !== 0 &&
              movs
                .sort((a, b) => this.doSort(a, b))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  let separator = false;
                  const formattedDate = moment(row.date)
                    .locale('es')
                    .utc()
                    .format('DD/MM/YYYY');

                  if (currentDate === null) {
                    currentDate = formattedDate;
                  }

                  if (currentDate === formattedDate) {
                    separator = false;
                  } else {
                    currentDate = formattedDate;
                    separator = true;
                  }

                  return (
                    <TableRow
                      key={row.date + index}
                      className={separator ? 'date-separator' : null}
                    >
                      <TableCell align="left" className="date-cell">
                        {formattedDate}
                      </TableCell>
                      <TableCell align="left" className="amount-cell">
                        ${row.amount}
                      </TableCell>
                      <TableCell align="left" className="category-cell">
                        {row.category.name}
                      </TableCell>
                      <TableCell align="left" className="description-cell">
                        {row.description}
                      </TableCell>

                      <TableCell align="right" className="option-cell">
                        <IconButton
                          aria-label="Edit"
                          onClick={() => this.handleUpdateMovement(row)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right" className="option-cell">
                        <IconButton
                          aria-label="Delete"
                          onClick={() => this.handleDeleteMovement(row)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell align="right" className="foot-cell">
                <span>BALANCE:</span>
              </TableCell>
              <TableCell align="left" className="foot-cell">
                <span
                  className={this.props.total > 0 ? 'positive' : 'negative'}
                >
                  ${this.props.total}
                </span>
              </TableCell>

              <TablePagination
                rowsPerPageOptions={[]}
                onChangePage={this.handleChangePage}
                colSpan={4}
                page={page}
                count={movs.length}
                rowsPerPage={this.state.rowsPerPage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                SelectProps={{
                  native: true
                }}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${count}`
                }
              />
            </TableRow>
          </TableFooter>
        </Table>
        <Modal
          acceptAction={this.doUpdateMovement}
          isDraggable
          isOpen={this.state.isModalOpen}
          title="Editar Movimiento"
          toggleModal={this.toggleModal}
          x={-100}
          y={-220}
        >
          <EditMovement
            movementToEdit={this.state.movementToEdit}
            handleEditMovement={this.handleEditMovement}
          />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { total: state.total, message: state.message };
};

const mapDispatchToProps = dispatch => ({
  updateMovement: data => dispatch(movement.updateMovement(data)),
  deleteMovement: data => dispatch(movement.deleteMovement(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MovementsTable);
