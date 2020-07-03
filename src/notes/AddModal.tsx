import React, {useState} from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Note, NoteType} from "./Note";
import {ThunkDispatch} from "redux-thunk";
import {CreateThunk, FetchThunk} from "./State";
import {connect} from "react-redux";

interface DispatchProps {
    create: (note: Note) => Promise<void>,
}

function StatelessAddModal({create}: DispatchProps) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [type, setType] = useState(NoteType.TEXT);

    const selectRef = React.createRef<HTMLSelectElement>();
    const nameRef = React.createRef<HTMLInputElement>();
    const textRef = React.createRef<HTMLTextAreaElement>();
    const linkRef = React.createRef<HTMLInputElement>();
    const fileRef = null;

    async function handleSubmit() {
        const newNote = {
            name: nameRef.current!.value,
            type: getNoteType(),
        } as Note;

        switch (newNote.type) {
            case NoteType.TEXT:
                newNote.text = textRef.current!.value;
                break;
            case NoteType.LINK:
                newNote.link = linkRef.current!.value;
                break;
            case NoteType.FILE:
                break;
        }
        await create(newNote);
        handleClose()
    }

    function getNoteType() {
        const element = selectRef.current;
        const type = element?.options[element?.selectedIndex].value;
        return parseInt(type as string) as NoteType;
    }

    function handleChange() {
        setType(getNoteType());
    }

    return (
        <>
            <Button className="ml-3" onClick={handleShow}><FontAwesomeIcon className="mr-2" icon={faPlus}/> Add</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add new note</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group controlId="">
                            <Form.Label>Note type</Form.Label>
                            <Form.Control ref={selectRef} as="select" defaultValue={NoteType.TEXT} onChange={handleChange}>
                                <option value={NoteType.FILE}>FILE</option>
                                <option value={NoteType.LINK}>LINK</option>
                                <option value={NoteType.TEXT}>TEXT</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>

                    <Form>
                        <Form.Group controlId="">
                            <Form.Label>Note name</Form.Label>
                            <Form.Control ref={nameRef} type="text"/>
                        </Form.Group>
                        {
                            type === NoteType.TEXT ?
                                <Form.Group controlId="">
                                    <Form.Label>Note content</Form.Label>
                                    <Form.Control ref={textRef} as="textarea" rows={3}/>
                                </Form.Group> : null
                        }
                        {
                            type === NoteType.LINK ?
                                <Form.Group controlId="">
                                    <Form.Label>Link</Form.Label>
                                    <Form.Control ref={linkRef} type="text"/>
                                </Form.Group> : null
                        }
                        {
                            type === NoteType.FILE ?
                                <Form.Group controlId="">
                                    <Form.File
                                        label="File upload"
                                    />
                                </Form.Group> : null
                        }
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>): DispatchProps => {
    return {
        create: async (note: Note) => {
            await dispatch(CreateThunk(note));
            console.log('Created!');
            await dispatch(FetchThunk());
        }
    }
}

const AddModal = connect(null, mapDispatchToProps)(StatelessAddModal);

export default AddModal;
