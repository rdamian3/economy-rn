import React, { Component } from "react";
import { connect } from "react-redux";
import { category } from "./../../store/actions/index";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Modal from "./../../components/Modal/Modal";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import "./Categories.scss";

class Categories extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { title: "Fecha", field: "date" },
        { title: "Monto", field: "amount" },
        { title: "Descripción", field: "description" }
      ],
      isModalOpen: false,
      categories: [],
      page: 0,
      rowsPerPage: 8,
      sortBy: { type: "date", asc: true },
      movementToEdit: {
        amount: 0,
        category: { name: "", _id: "" },
        date: "",
        description: "",
        _id: ""
      }
    };
  }

  setSort = type => {
    const sortBy = { type, asc: !this.state.sortBy.asc };
    this.setState({ sortBy });
  };

  doSort = (a, b) => {
    const { sortBy } = this.state;
    debugger;
    if (!sortBy.asc) {
      return a[sortBy.type] > b[sortBy.type] ? 1 : -1;
    } else {
      return a[sortBy.type] > b[sortBy.type] ? -1 : 1;
    }
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    const rowsPerPage = parseInt(event.target.value, 5);
    this.setState({ rowsPerPage });
  };

  handleUpdateCategory = data => {
    this.setState({ movementToEdit: data });
    this.toggleModal();
  };

  handleDeleteCategory = data => {
    this.props.deleteCategory(data);
  };

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  render() {
    const categories = this.props.categories;
    if (categories.length === 0) {
      return null;
    }
    const { page, rowsPerPage, sortBy } = this.state;

    return (
      <div className="Categories">
        <div className="card">
          <Table className="table-container">
            <TableHead className="table-head">
              <TableRow>
                <TableCell
                  align="left"
                  className="head-cell category-cell"
                  onClick={() => this.setSort("category")}
                >
                  Categoría
                  <TableSortLabel
                    className="sort-label"
                    active={sortBy.type === "category"}
                    direction={sortBy.asc ? "asc" : "desc"}
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
                  .map((row, index) => {
                    return (
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
                    );
                  })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[]}
                  onChangePage={this.handleChangePage}
                  page={page}
                  count={categories.length}
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
            acceptAction={this.doUpdateCategory}
            isDraggable
            isOpen={this.state.isModalOpen}
            title="Editar Movimiento"
            toggleModal={this.toggleModal}
            x={-100}
            y={-220}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { categories: state.categories, message: state.message };
};

const mapDispatchToProps = dispatch => ({
  updateCategory: data => dispatch(category.updateCategory(data)),
  deleteCategory: data => dispatch(category.deleteCategory(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Categories);
