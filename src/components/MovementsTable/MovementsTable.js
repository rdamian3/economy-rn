import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Modal from '../Modal/Modal';
import EditMovement from '../EditMovement/EditMovement';
import { movement } from '../../store/actions/index';
import './MovementsTable.scss';

class MovementsTable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      page: 0,
      rowsPerPage: 8,
      sortBy: { type: 'date', asc: true },
      movementToEdit: {
        amount: 0,
        category: { name: '', _id: '' },
        date: '',
        description: '',
        _id: '',
      },
    };
  }

  componentDidUpdate(prevProps) {
    const { message } = this.props;
    if (
      prevProps.message !== message
      && message.kind === 'movement_update'
      && message.type === 'success'
    ) {
      this.toggleModal();
    }
  }

  setSort = (type) => {
    const { sortBy } = this.state;
    const sort = { type, asc: !sortBy.asc };
    this.setState({ sortBy: sort });
  };

  doSort = (a, b) => {
    const { sortBy } = this.state;
    if (!sortBy.asc) {
      if (sortBy.type === 'date') {
        return a[sortBy.type] > b[sortBy.type] ? 1 : -1;
      }
      if (sortBy.type === 'category') {
        return a[sortBy.type].name > b[sortBy.type].name ? 1 : -1;
      }
      if (sortBy.type === 'amount') {
        return a[sortBy.type] - b[sortBy.type];
      }
    } else if (sortBy.asc) {
      if (sortBy.type === 'date') {
        return a[sortBy.type] > b[sortBy.type] ? -1 : 1;
      }
      if (sortBy.type === 'category') {
        return a[sortBy.type].name > b[sortBy.type].name ? -1 : 1;
      }
      if (sortBy.type === 'amount') {
        return b[sortBy.type] - a[sortBy.type];
      }
    }
    return 1;
  };

  doUpdateMovement = () => {
    const { updateMovement } = this.props;
    const { movementToEdit } = this.state;
    updateMovement(movementToEdit);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    const rowsPerPage = parseInt(event.target.value, 5);
    this.setState({ rowsPerPage });
  };

  handleEditMovement = (event) => {
    const { name } = event.target;
    const { value } = event.target;
    this.setState((prevState) => {
      const movementToEdit = Object.assign({}, prevState.movementToEdit);
      movementToEdit[name] = value;
      return { movementToEdit };
    });
  };

  handleUpdateMovement = (data) => {
    this.setState({ movementToEdit: data });
    this.toggleModal();
  };

  handleDeleteMovement = (data) => {
    const { deleteMovement } = this.props;
    deleteMovement(data);
  };

  toggleModal = () => {
    const { isModalOpen } = this.state;
    this.setState({ isModalOpen: !isModalOpen });
  };

  render() {
    const { movements, total } = this.props;
    if (movements.length === 0) {
      return null;
    }
    const {
      page, rowsPerPage, sortBy, isModalOpen, movementToEdit,
    } = this.state;
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
            {movements.length !== 0
              && movements
                .sort((a, b) => this.doSort(a, b))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
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
                    <TableRow key={row.date} className={separator ? 'date-separator' : null}>
                      <TableCell align="left" className="date-cell">
                        {formattedDate}
                      </TableCell>
                      <TableCell align="left" className="amount-cell">
                        $
                        {row.amount}
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
                <span className={total > 0 ? 'positive' : 'negative'}>
$
                  {total}
                </span>
              </TableCell>

              <TablePagination
                rowsPerPageOptions={[]}
                onChangePage={this.handleChangePage}
                colSpan={4}
                page={page}
                count={movements.length}
                rowsPerPage={rowsPerPage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                SelectProps={{
                  native: true,
                }}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              />
            </TableRow>
          </TableFooter>
        </Table>
        <Modal
          acceptAction={this.doUpdateMovement}
          isDraggable
          isOpen={isModalOpen}
          title="Editar Movimiento"
          toggleModal={this.toggleModal}
          x={-100}
          y={-220}
        >
          <EditMovement
            movementToEdit={movementToEdit}
            handleEditMovement={this.handleEditMovement}
          />
        </Modal>
      </div>
    );
  }
}

MovementsTable.propTypes = {
  updateMovement: PropTypes.func.isRequired,
  deleteMovement: PropTypes.func.isRequired,
  movements: PropTypes.array,
  total: PropTypes.number,
  message: PropTypes.object,
};

MovementsTable.defaultProps = {
  movements: [],
  total: PropTypes.number,
  message: {},
};

const mapStateToProps = state => ({ total: state.total, message: state.message });

const mapDispatchToProps = dispatch => ({
  updateMovement: data => dispatch(movement.updateMovement(data)),
  deleteMovement: data => dispatch(movement.deleteMovement(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MovementsTable);
