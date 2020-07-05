import React from 'react';
import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

import BootstrapTable, {SortOrder} from "react-bootstrap-table-next";
import paginationFactory from 'react-bootstrap-table2-paginator';
import {Note} from "./notes/Note";

import AddModal from "./notes/AddModal";
import {State, store} from "./notes/State";
import {connect, Provider} from 'react-redux';
import {makeNotesDisplayable} from "./notes/Api";

interface StateProps {
    notes: Note[],
}

function StatelessApp({notes}: StateProps) {
    const notesToDisplay = makeNotesDisplayable(notes);

    return (
      <Container className="ml-5 mt-5">
          <Row>
              <Col>
                  <h2>
                      Client Files & Links
                      <AddModal />
                  </h2>

              </Col>
          </Row>
          <Row>
              <Col>
                  <BootstrapTable
                      keyField='id'
                      data={ notesToDisplay }
                      columns={ tableColumns }
                      defaultSorted = { defaultSorted }
                      pagination= { paginationFactory({}) }/>
              </Col>
          </Row>
      </Container>
    );
}

const tableColumns = [
    {
        dataField: "name",
        text: "Name",
        sort: true,
    },
    {
        dataField: "displayLink",
        text: "Link",
        sort: true,
    },
    {
        dataField: "updated_at",
        text: "Updated",
        sort: true,
    },
    {
        dataField: "actionsButtons",
        text: "Actions",
    },
];
Object.freeze(tableColumns);

const defaultSorted = [
    {
        dataField: 'updated_at',
        order: 'desc' as SortOrder,
    },
    {
    dataField: 'name',
    order: 'asc' as SortOrder,
    }
] as any;
Object.freeze(defaultSorted);

const mapStateToProps = (state: State): StateProps => {
    return {
        notes: state.notes,
    };
}

const StatefulApp = connect(mapStateToProps)(StatelessApp);

function App() {
    return (<Provider store={store}><StatefulApp/></Provider>);
}

export default App;
