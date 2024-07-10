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
import { Button } from '@material-ui/core';
import Modal from '../../components/Modal/Modal';
import { category, comunication } from '../../store/actions/index';
import EditCategory from '../../components/EditCategory/EditCategory';
import AddCategory from '../../components/AddCategory/AddCategory';

import './Categories.scss';

class Categories extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      isAddModalOpen: false,
      categories: [],
      page: 0,
      rowsPerPage: 8,
      sortBy: { type: 'date', asc: true },
      categoryToEdit: { name: '', description: '' },
      childCategoryDesc: '',
      childCategoryName: '',
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
    const { updateCategory } = this.props;
    const { categoryToEdit } = this.state;
    updateCategory(categoryToEdit);
  };

  handleEditCategory = (event) => {
    const { name } = event.target;
    const { value } = event.target;
    this.setState((prevState) => {
      const categoryToEdit = { ...prevState.categoryToEdit };
      categoryToEdit[name] = value;
      return { categoryToEdit };
    });
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
    // TO-DO: Ask for confirmation
    const { deleteCategory } = this.props;
    deleteCategory(data);
  };

  toggleModal = () => {
    const { isModalOpen } = this.state;
    this.setState({ isModalOpen: !isModalOpen });
  };

  handleChildCategoryDesc = (event) => {
    const childCategoryDesc = event.target.value;
    this.setState({ childCategoryDesc });
  };

  handleChildCategoryName = (name) => {
    this.setState({ childCategoryName: name });
  };

  toggleAddModal = () => {
    const { isAddModalOpen } = this.state;
    this.setState({ isAddModalOpen: !isAddModalOpen });
  };

  addNewCategory = () => {
    const { childCategoryDesc: description, childCategoryName: name } =
      this.state;

    const { addCategory, setMessage } = this.props;

    if (name !== '') {
      addCategory({ name, description });
      this.toggleAddModal();
      this.setState({ childCategoryDesc: '', childCategoryName: '' });
    } else {
      setMessage({
        message: 'Verifique los campos',
        type: 'error',
        kind: 'category',
      });
    }
  };

  render() {
    const {
      categories,
      isModalOpen,
      page,
      rowsPerPage,
      sortBy,
      categoryToEdit,
      isAddModalOpen,
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
              {categories.length !== 0 &&
                categories
                  .sort((a, b) => this.doSort(a, b))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
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
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} de ${count}`
                  }
                />
              </TableRow>
            </TableFooter>
          </Table>
          <div className="card-footer">
            <Button
              className="btn-add"
              color="primary"
              onClick={this.toggleAddModal}
              variant="contained"
            >
              Agregar Categoría
            </Button>
          </div>
          <Modal
            acceptAction={this.doUpdateCategory}
            isDraggable
            isOpen={isModalOpen}
            title="Editar Categoría"
            toggleModal={this.toggleModal}
            x={-100}
            y={-220}
          >
            <EditCategory
              categoryToEdit={categoryToEdit}
              handleEditCategory={this.handleEditCategory}
            />
          </Modal>
          <Modal
            acceptAction={this.addNewCategory}
            isDraggable={false}
            isOpen={isAddModalOpen}
            title="Agregar Categoría"
            toggleModal={this.toggleAddModal}
          >
            <AddCategory
              childCategoryDesc={this.handleChildCategoryDesc}
              childCategoryName={this.handleChildCategoryName}
            />
          </Modal>
        </div>
      </div>
    );
  }
}

Categories.propTypes = {
  categories: PropTypes.array,
  deleteCategory: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
};

Categories.defaultProps = {
  categories: [],
};

const mapStateToProps = (state) => ({
  categories: state.categories,
  message: state.message,
});

const mapDispatchToProps = (dispatch) => ({
  updateCategory: (data) => dispatch(category.updateCategory(data)),
  deleteCategory: (data) => dispatch(category.deleteCategory(data)),
  addCategory: (data) => dispatch(category.addCategory(data)),
  setMessage: (data) => dispatch(comunication.setMessage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
