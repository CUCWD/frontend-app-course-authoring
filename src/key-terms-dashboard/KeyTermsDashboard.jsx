/* eslint-disable */

import React, { createContext, useState, useEffect, useContext } from 'react';
import './KeyTermsDashboard.scss';

import {
  Collapsible,
  Button,
  Container,
  Icon,
  ActionRow,
  SearchField,
  IconButton,
  Pagination,
} from '@edx/paragon';

import { Delete, Edit, ExpandLess, ExpandMore } from '@edx/paragon/icons';

import { injectIntl } from '@edx/frontend-platform/i18n';

import EditKeyTerm from './Pages/EditKeyTerm';
import Sidebar from './Sidebar';

export const CourseContext = createContext();
export const KeyTermContext = createContext();
const ListViewContext = createContext();

function ResourceList() {
  const { resources } = useContext(KeyTermContext);
  return (
    <div className='ref-container flex-col'>
      <b>References:</b>
      {resources.map(function (resource) {
        return (
          <p>
            <a href={resource.resource_link}>{resource.friendly_name}</a>
          </p>
        );
      })}
    </div>
  );
}

function Lessons() {
  return (
    <div className='lessons-container flex-col'>
      <b>Lessons</b>
    </div>
  );
}

function Textbook({ textbook }) {
  const [variant, setVariant] = useState('primary');
  const [buttonText, setButtonText] = useState('Copy Link');

  const { courseId } = useContext(CourseContext);
  const assetId = courseId.replace('course', 'asset');

  const lmsTextbookLink = `localhost:18000/${assetId}+type@asset+block@${textbook.textbook_link}#page=${textbook.page_num}`;

  return (
    <p>
      {textbook.chapter} pg. {textbook.page_num} &nbsp; &nbsp;
      <Button
        variant={variant}
        size='inline'
        title='Copy Link'
        onClick={() => {
          navigator.clipboard.writeText(lmsTextbookLink);
          setVariant('light');
          setButtonText('Copied');
        }}
      >
        {' '}
        {buttonText}{' '}
      </Button>
    </p>
  );
}

function TextbookList() {
  const { textbooks } = useContext(KeyTermContext);
  return (
    <div className='textbook-container flex-col'>
      <b>Textbooks</b>
      {textbooks.map(function (textbook) {
        return <Textbook key={textbook.id} textbook={textbook} />;
      })}
    </div>
  );
}

function DefinitionsList() {
  const { definitions } = useContext(KeyTermContext);
  return (
    <div className='definitions-container flex-col'>
      <b>Definitions</b>
      {definitions.map(function (descr) {
        return (
          <div className='definition'>
            <p>{descr.description}</p>
          </div>
        );
      })}
    </div>
  );
}

function KeyTermData() {
  return (
    <div className='key-term-info'>
      <DefinitionsList />
      <TextbookList />
      <Lessons />
      <ResourceList />
    </div>
  );
}

function KeyTerm() {
  const { keyName } = useContext(KeyTermContext);
  // const { expandAll, setExpandAll } = useContext(ListViewContext);
  const { courseId } = useContext(CourseContext);
  const [editTermModal, setEditTermModal] = useState(false);
  // const [isOpen, setIsOpen] = useState(expandAll);

  async function DeleteKeyTerm() {
    const restUrl = 'http://localhost:18500/api/v1/key_term/';
    const course = courseId.replaceAll('+', ' ');
    const termToDelete = {
      key_name: keyName,
      course_id: course,
    };

    if (
      confirm(
        `Are you sure you want to remove key term ${keyName} from this course?`
      )
    ) {
      const response = await fetch(restUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(termToDelete),
      })
        .then((data) => {
          console.log('Success:', data);
          console.log(JSON.stringify(termToDelete));
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      return response;
    }
  }

  return (
    <div className='key-term-container'>
      <Collapsible
        title={<b>{key_name}</b>}
        styling='card-lg'
        // open={isOpen}
        // onClick={() =>
        //   {setIsOpen(!isOpen);
        //   console.log(expandAll);}
        // }
        iconWhenOpen={<Icon src={ExpandLess} />}
        iconWhenClosed={<Icon src={ExpandMore} />}
        // if false, won't allow any individual collapsable to open
        // open={expandAll}
      >
        <span>
          <EditKeyTerm
            modalOpen={editTermModal}
            setModalOpen={setEditTermModal}
            courseId={courseId}
            // keyTerm={keyTerm}
          />
          <IconButton
            src={Edit}
            iconAs={Icon}
            alt='Edit'
            variant='secondary'
            size='sm'
            onClick={() => {
              setEditTermModal(true);
            }}
          />
          <IconButton
            src={Delete}
            iconAs={Icon}
            alt='Delete'
            variant='secondary'
            size='sm'
            onClick={() => {
              DeleteKeyTerm();
            }}
          />
        </span>
        <KeyTermData />
      </Collapsible>
    </div>
  );
}

function KeyTermList() {
  const { searchQuery, selectedPage, setPagination } =
    useContext(ListViewContext);
  const { courseId, termData, setTermData } = useContext(CourseContext);

  function paginate(termList, page_size, page_number) {
    return termList.slice(
      (page_number - 1) * page_size,
      page_number * page_size
    );
  }

  const restUrl = `http://localhost:18500/api/v1/course_terms?course_id=${courseId}`;

  useEffect(() => {
    fetch(restUrl)
      .then((response) => response.json())
      .then((jsonData) => {
        // jsonData is parsed json object received from url
        setTermData(jsonData);
      })
      .catch((error) => {
        // handle your errors here
        console.error(error);
      });
  }, []);

  const displayTerms = termData
    .filter(function (keyTerm) {
      return keyTerm.key_name
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    })
    .sort(function compare(a, b) {
      if (a.key_name < b.key_name) {
        return -1;
      }
      if (a.key_name > b.key_name) {
        return 1;
      }
      return 0;
    });

  if (displayTerms.length === 0) {
    setPagination(0);
  } else {
    setPagination(displayTerms.length / 50);
  }

  return (
    <div className='key-term_list'>
      {displayTerms.length === 0 ? (
        <h3 className='filter-container'>No Terms to Display...</h3>
      ) : null}
      {paginate(displayTerms, 50, selectedPage).map(function (keyTerm) {
        return (
          <KeyTermContext.Provider value={keyTerm}>
            <KeyTerm key={keyTerm.id} />
          </KeyTermContext.Provider>
        );
      })}
    </div>
  );
}

function KeyTermsDashboard({ courseId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [termData, setTermData] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [pagination, setPagination] = useState();
  const [expandAll, setExpandAll] = useState(false);

  return (
    <CourseContext.Provider value={{ courseId, termData, setTermData }}>
      <Container size='xl'>
        <div className='header'>
          <h2 className='mt-3 mb-2'>Studio: Key Term Dashboard</h2>
          <hr />
        </div>
        <div className='dashboard-container'>
          <Sidebar />
          <div className='key-term-list-container'>
            <div className='menu-bar'>
              <ActionRow>
                <p>
                  Displaying {pagination > 0 ? 1 + 50 * (selectedPage - 1) : 0}{' '}
                  -
                  {pagination * 50 < 50
                    ? parseInt(pagination * 50)
                    : 50 * selectedPage}{' '}
                  of {parseInt(pagination * 50)} items
                </p>
                {/* <p>
                <a
                  onClick={() => {
                  setExpandAll(!expandAll);
                  console.log(expandAll)}}
                >
                  {expandAll ? 'Collapse All' : 'Expand All'}
                </a>
                </p> */}
                <ActionRow.Spacer />
                <SearchField
                  onSubmit={(value) => {
                    console.log(`search submitted: ${value}`);
                    console.log(value);
                    setSearchQuery(value);
                  }}
                  onClear={() => setSearchQuery('')}
                  placeholder='Search'
                />
              </ActionRow>
            </div>
            <ListViewContext.Provider
              value={{
                searchQuery,
                selectedPage,
                setPagination,
                expandAll,
                setExpandAll,
              }}
            >
              <KeyTermList />
            </ListViewContext.Provider>
            <div className='footer-container'>
              {pagination === 0 ? null : (
                <Pagination
                  paginationLabel='pagination navigation'
                  pageCount={
                    pagination > parseInt(pagination)
                      ? parseInt(pagination) + 1
                      : pagination
                  }
                  onPageSelect={(value) => setSelectedPage(value)}
                />
              )}
            </div>
          </div>
        </div>
      </Container>
    </CourseContext.Provider>
  );
}

export default injectIntl(KeyTermsDashboard);
// export default KeyTermsDashboard;
