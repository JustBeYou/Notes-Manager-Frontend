import React from 'react';
import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

import BootstrapTable from "react-bootstrap-table-next";
import {Note, noteActions, NoteType} from "./notes/Note";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import AddModal from "./notes/AddModal";

function App() {
    const mockNotes = [
        {"id": 1, "name": "Test note 1", "updated": (new Date()).toLocaleString(), "type": NoteType.LINK, "link": "https://example.com"},
        {"id": 2, "name": "Test note 2", "updated": (new Date()).toLocaleString(), "type": NoteType.LINK, "link": "https://google.com"},
        {"id": 3, "name": "Test note 3", "updated": (new Date()).toLocaleString(), "type": NoteType.TEXT, "text": "This is a sample note"},
        {"id": 4, "name": "Test note 4", "updated": (new Date()).toLocaleString(), "type": NoteType.FILE},
        {"id": 5, "name": "Test note 5", "updated": (new Date()).toLocaleString(), "type": NoteType.FILE},
    ] as Note[];

    const notesToDisplay: Note[] = mockNotes.map((note: Note) => {
        return {
            ...note,
            actionsButtons: noteActions(note),
            displayLink: note.link !== undefined ? <a href={note.link as string}>{note.link}</a> : undefined,
        };
    });

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
        dataField: "updated",
        text: "Updated",
        sort: true,
    },
    {
        dataField: "actionsButtons",
        text: "Actions",
    },
];
Object.freeze(tableColumns);

export default App;
