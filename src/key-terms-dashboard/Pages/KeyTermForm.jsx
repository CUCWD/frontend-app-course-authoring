/* eslint-disable */

import React from 'react';
import { InputText, Form } from '@edx/paragon';

const emptyForm = {
  keyTerm: '',
  definition: '',
};

class KeyTermForm extends React.Component {
  state = {};

  componentDidMount() {
    this.setState(emptyForm);
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    return (
      <div>
        <p>
          Please only add one definition at a time. You can change or add new
          definitions after the key term is created.
        </p>
        <InputText
          id='keyTerm'
          name='keyTerm'
          label='Key Term'
          onChange={(input) => {
            this.value = input;
            this.props.setTermValue(this.value);
            this.props.setSaveValue('default');
            this.props.setInputError((prevState) => ({
              ...prevState,
              keyTerm: false,
            }));
          }}
        />
        {this.props.inputError.keyTerm ? (
          <Form.Control.Feedback type='invalid'>
            Key Term cannot be blank
            <br />
            &nbsp;
          </Form.Control.Feedback>
        ) : null}

        <InputText
          id='definition'
          name='definition'
          label='Definition'
          //   value={this.state.definition}
          onChange={(input) => {
            this.value = input;
            this.props.setDefValue(this.value);
            this.props.setSaveValue('default');
            this.props.setInputError((prevState) => ({
              ...prevState,
              definition: false,
            }));
          }}
        />
        {this.props.inputError.definition ? (
          <Form.Control.Feedback type='invalid'>
            Definition cannot be blank
          </Form.Control.Feedback>
        ) : null}
      </div>
    );
  }
}

export default KeyTermForm;
