import React, {useEffect} from 'react';
import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

import BootstrapTable from "react-bootstrap-table-next";
import {Note} from "./notes/Note";

import AddModal from "./notes/AddModal";
import {FetchThunk, State, store} from "./notes/State";
import {ThunkDispatch} from "redux-thunk";
import {connect, Provider} from 'react-redux';
import {makeNotesDisplayable} from "./notes/Api";

interface StateProps {
    notes: Note[],
}

interface DispatchProps {
    fetch: () => Promise<void>,
}

function StatelessApp({notes, fetch}: StateProps & DispatchProps) {
    useEffect(() => {
        fetch();
    }, []);
    const notesToDisplay = makeNotesDisplayable(notes);
    //const notesToDisplay = notes;

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
                  <BootstrapTable keyField='id' data={ notesToDisplay } columns={ tableColumns } />
              </Col>
          </Row>
      </Container>
    );
}

const tableColumns = [
    {
        dataField: "id",
        text: "Note ID",
        sort: true,
    },
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

const mapStateToProps = (state: State): StateProps => {
    return {
        notes: state.notes,
    };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>): DispatchProps => {
    return {
        fetch: async () => {
            await dispatch(FetchThunk());
        }
    }
}

const StatefulApp = connect(mapStateToProps, mapDispatchToProps)(StatelessApp);

function App() {
    return (<Provider store={store}><StatefulApp/></Provider>);
}

export default App;
