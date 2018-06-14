import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { isEmpty } from 'ramda';

import Settings from './Settings';
import { addNewslettersToLabel } from '../../../actions/labels/unsaved';
import { getAdditionalNewsletters, getEmailAddresses } from '../../../reducers/labels/unsaved';

class SettingsContainer extends Component {
  state = {
    checkboxOne: true,
    checkboxTwo: true,
    isInputError: false,
    isCheckboxError: false,
    labelName: ''
  };

  handleFormSubmit = () => {
    const { labelName } = this.state;

    if (isEmpty(labelName)) {
      this.setState({ isInputError: true });
      return;
    }

    this.checkboxesAreEmpty()
      ? this.setState({ isCheckboxError: true })
      : this.handleAddNewslettersToLabel(labelName);
  };

  handleAddNewslettersToLabel = (labelName) => {
    const { checkboxOne, checkboxTwo } = this.state;
    const { additionalNewsletters, emailAddresses, addNewslettersToLabel } = this.props;

    addNewslettersToLabel({
      labelName,
      additionalNewsletters,
      emailAddresses,
      checkboxOne,
      checkboxTwo
    });

    this.setState({ labelName: '' });
  };

  isUndefined = (val) => val === undefined;

  checkboxesAreEmpty = () => this.state.checkboxOne === false && this.state.checkboxTwo === false;

  handleInputChange = (e) => {
    this.setState({ labelName: e.target.value }, () => {
      const { labelName, isInputError } = this.state;

      // reset error if it's true and the input isn't empty
      if (isInputError && labelName) {
        this.setState({ isInputError: false });
      }
    });
  };

  updateCheck = (prop) => () => {
    this.setState({ [prop]: !this.state[prop] });
  };

  render() {
    return (
      <Settings
        updateCheck={this.updateCheck}
        handleFormSubmit={this.handleFormSubmit}
        handleInputChange={this.handleInputChange}
        {...this.props}
        {...this.state}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  emailAddresses: getEmailAddresses(state),
  additionalNewsletters: getAdditionalNewsletters(state)
});

export default connect(mapStateToProps, { addNewslettersToLabel })(
  reduxForm({
    form: 'setitngs',
    fields: ['name']
  })(SettingsContainer)
);
