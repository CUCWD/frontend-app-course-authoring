/* eslint-disable */

import { ModalDialog, StatefulButton, ActionRow } from '@edx/paragon';
import { useContext, useState } from 'react';
import React from 'react';
import EditKeyTermForm from './EditKeyTermForm';

import { KeyTermContext } from '../KeyTermsDashboard';

function EditKeyTerm({ modalOpen, setModalOpen, courseId }) {
  const { key_name, definitions, resources } = useContext(KeyTermContext);
  const keyTerm = useContext(KeyTermContext);
  const [saveValue, setSaveValue] = useState('default');
  const [definitionList, setDefinitionList] = useState(definitions);
  const [resourceList, setResourceList] = useState(resources);

  const course = courseId.replaceAll('+', ' ');

  const props = {
    labels: {
      default: 'Save',
      pending: 'Saving',
      complete: 'Saved',
      error: 'Error',
    },
  };

  async function EditKeyTerm() {
    const restUrl = 'http://localhost:18500/api/v1/key_term/';
    const editTerm = {
      key_name: key_name,
      course_id: course,
      definitions: definitionList,
      textbooks: [],
      lessons: [],
      resources: resourceList,
    };

    console.log(resourceList);
    console.log(editTerm);

    const response = await fetch(restUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editTerm),
    })
      .then((data) => {
        console.log('Success:', data);
        console.log(JSON.stringify(editTerm));
        if (data.status === 200) {
          setSaveValue('complete');
        } else {
          setSaveValue('error');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setSaveValue('error');
      });

    return response;
  }

  return (
    <>
      <ModalDialog
        title='Edit Key Term'
        isOpen={modalOpen}
        size='xl'
        variant='default'
        hasCloseButton={!modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSaveValue('default');
        }}
        isFullscreenOnMobile
      >
        <ModalDialog.Header>
          <ModalDialog.Title>Edit Key Term</ModalDialog.Title>
        </ModalDialog.Header>

        <ModalDialog.Body>
          <EditKeyTermForm
            definitionList={definitionList}
            setDefinitionList={setDefinitionList}
            resourceList={resourceList}
            setResourceList={setResourceList}
            setSaveValue={setSaveValue}
            keyTerm={keyTerm}
          />
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton variant='tertiary'>
              Cancel
            </ModalDialog.CloseButton>
            <StatefulButton
              // variant='success'
              state={saveValue}
              {...props}
              // data-autofocus
              onClick={async () => {
                setSaveValue('pending');
                await EditKeyTerm();
                setModalOpen(false);
              }}
            />
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );

  // return (
  //   <div>
  //     <Modal
  //       open={modalOpen}
  //       title='Edit Key Term'
  //       size='fullscreen'
  //       body={
  //         <EditKeyTermForm
  //           definitionList={definitionList}
  //           setDefinitionList={setDefinitionList}
  //           setSaveValue={setSaveValue}
  //           keyTerm={keyTerm}
  //         />
  //       }
  //       onClose={() => {
  //         setModalOpen(false);
  //         setSaveValue('default');
  //       }}
  //       buttons={[
  //         <StatefulButton
  //           // variant='success'
  //           state={saveValue}
  //           {...props}
  //           // data-autofocus
  //           onClick={() => {
  //             EditKeyTerm();
  //             setSaveValue('pending');
  //             //   setModalOpen(false);
  //           }}
  //         />,
  //       ]}
  //     />
  //   </div>
  // );
}

export default EditKeyTerm;
