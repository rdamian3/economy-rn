import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

import './AddCategory.scss';
import 'moment/locale/es';

class AddCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameError: false
    };
  }

  handleCategoryName = evt => {
    const name = evt.target.value;
    this.setState({ nameError: name === '' });
    this.props.childCategoryName(name);
  };

  render() {
    return (
      <div className="Addcategory">
        <TextField
          error={this.state.nameError}
          label="Nombre"
          margin="normal"
          onChange={this.handleCategoryName}
        />
        <TextField
          label="Descripción"
          margin="normal"
          onChange={this.props.childCategoryDesc}
        />
      </div>
    );
  }
}

export default AddCategory;
