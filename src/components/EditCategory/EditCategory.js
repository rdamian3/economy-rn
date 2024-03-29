import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Description from '@material-ui/icons/Description';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

import './EditCategory.scss';

class EditCategory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      categoryToEdit: {
        name: '',
        description: '',
      },
    };
  }

  handleCategoryChange = (event) => {
    const { name } = event.target;
    const { value } = event.target;
    const { handleEditCategory } = this.props;
    this.setState((prevState) => {
      const categoryToEdit = { ...prevState.categoryToEdit };
      categoryToEdit[name] = value;
      return { categoryToEdit };
    });
    handleEditCategory(event);
  };

  render() {
    const { categoryToEdit } = this.props;
    return (
      <div className="EditCategory">
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Description />
              </InputAdornment>
            ),
          }}
          label="Nombre"
          margin="normal"
          name="name"
          onChange={this.handleCategoryChange}
          value={categoryToEdit.name}
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
          onChange={this.handleCategoryChange}
          value={categoryToEdit.description}
        />
      </div>
    );
  }
}

EditCategory.propTypes = {
  categoryToEdit: PropTypes.object.isRequired,
  handleEditCategory: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ categories: state.categories });

export default connect(mapStateToProps)(EditCategory);
