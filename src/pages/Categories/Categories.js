import React, { PureComponent } from 'react';
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
import Modal from '../../components/Modal/Modal';
import { category } from '../../store/actions/index';
import EditCategory from '../../components/EditCategory/EditCategory';

import './Categories.scss';

class Categories extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      categories: [],
      page: 0,
      rowsPerPage: 8,
      sortBy: { type: 'date', asc: true },
      categoryToEdit: { name: '', description: '' },
    };
  }

  componentDidMount() {
    const { categories } = this.props;
    this.setState({ categories });
  }

  componentDidUpdate(prevState) {
    const { categories } = this.props;

    if (prevState.categories !== categories) {
      this.setState({ categories });
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
      return a[sortBy.type] > b[sortBy.type] ? 1 : -1;
    }
    return a[sortBy.type] > b[sortBy.type] ? -1 : 1;
  };

  doUpdateCategory = () => {
    const { categoryToEdit } = this.state;
    const { updateCategory } = this.props;
    updateCategory(categoryToEdit);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    const rowsPerPage = parseInt(event.target.value, 5);
    this.setState({ rowsPerPage });
  };

  handleUpdateCategory = (data) => {
    this.setState({ categoryToEdit: data });
    this.toggleModal();
  };

  handleDeleteCategory = (data) => {
    const { deleteCategory } = this.props;
    deleteCategory(data);
  };

  toggleModal = () => {
    const { isModalOpen } = this.state;
    this.setState({ isModalOpen: !isModalOpen });
  };

  render() {
    const {
      categories, isModalOpen, page, rowsPerPage, sortBy, categoryToEdit,
    } = this.state;
    if (categories.length === 0) {
      return (
        <div className="Categories">
          <div className="card no-category">
            <span>Aún no hay categorías para mostrar!</span>
          </div>
        </div>
      );
    }

    return (
      <div className="Categories">
        <div className="card">
          <Table className="table-container">
            <TableHead className="table-head">
              <TableRow>
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
              {categories.length !== 0
                && categories
                  .sort((a, b) => this.doSort(a, b))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => (
                    <TableRow key={row._id}>
                      <TableCell align="left" className="category-cell">
                        {row.name}
                      </TableCell>
                      <TableCell align="left" className="description-cell">
                        {row.description}
                      </TableCell>
                      <TableCell align="right" className="option-cell">
                        <IconButton
                          aria-label="Edit"
                          onClick={() => this.handleUpdateCategory(row)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right" className="option-cell">
                        <IconButton
                          aria-label="Delete"
                          onClick={() => this.handleDeleteCategory(row)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[]}
                  onChangePage={this.handleChangePage}
                  page={page}
                  count={categories.length}
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
            acceptAction={this.doUpdateCategory}
            categoryToEdit={categoryToEdit}
            isDraggable
            handleUpdateCategory={this.handleUpdateCategory}
            isOpen={isModalOpen}
            title="Editar Movimiento"
            toggleModal={this.toggleModal}
            x={-100}
            y={-220}
          >
            <EditCategory />
          </Modal>
        </div>
      </div>
    );
  }
}

Categories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.array),
  deleteCategory: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
};

Categories.defaultProps = {
  categories: PropTypes.array,
};

const mapStateToProps = state => ({ categories: state.categories, message: state.message });

const mapDispatchToProps = dispatch => ({
  updateCategory: data => dispatch(category.updateCategory(data)),
  deleteCategory: data => dispatch(category.deleteCategory(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Categories);
