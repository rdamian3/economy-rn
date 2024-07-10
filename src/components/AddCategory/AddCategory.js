import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import './AddCategory.scss';
import 'moment/locale/es';

class AddCategory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nameError: false,
    };
  }

  handleCategoryName = (evt) => {
    const name = evt.target.value;
    this.setState({ nameError: name === '' });
    const { childCategoryName } = this.props;
    childCategoryName(name);
  };

  render() {
    const { nameError } = this.state;
    const { childCategoryDesc } = this.props;

    return (
      <div className="Addcategory">
        <TextField
          error={nameError}
          label="Nombre"
          margin="normal"
          onChange={this.handleCategoryName}
        />
        <TextField
          label="Descripción"
          margin="normal"
          onChange={childCategoryDesc}
        />
      </div>
    );
  }
}

AddCategory.propTypes = {
  childCategoryName: PropTypes.func.isRequired,
  childCategoryDesc: PropTypes.func.isRequired,
};

export default AddCategory;
