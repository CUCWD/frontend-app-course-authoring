import React from 'react';
import { Input, Form } from '@edx/paragon';

class BulkImportForm extends React.Component {
  state = {};

  render() {
    return (
      <div>
        <p>
          Please upload file. Make sure you've formatted your excel file
          according to the TEMPLATE provided.
        </p>
        <Input
          type='file'
          onChange={(e) => {
            if (
              e.target.files[0].type ===
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            ) {
              if (e.target.files[0].size < 10000000) {
                this.props.setIsFilePicked(true);
                this.props.setExcelFile(e.target.files[0]);
                this.props.setFileError('');
                this.props.setSaveValue('default');
              } else {
                this.props.setFileError('File size cannot exceed 10MB');
                this.props.setSaveValue('error');
              }
            } else {
              this.props.setFileError('File must be .xlsx format');
              this.props.setSaveValue('error');
            }
            console.log(e.target.files[0]);
          }}
        />

        {this.props.fileError ? (
          <Form.Control.Feedback type='invalid'>
            <p>{this.props.fileError}</p>
          </Form.Control.Feedback>
        ) : null}
      </div>
    );
  }
}

export default BulkImportForm;
