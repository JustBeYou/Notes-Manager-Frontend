import React, {useState} from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Note, NoteType} from "./Note";

function EditModal(note: Note) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [type, setType] = useState(note.type);
    const selectRef = React.createRef<HTMLSelectElement>();

    function handleChange() {
        const element = selectRef.current;
        const value = element?.options[element?.selectedIndex].value;
        setType(parseInt(value as string) as NoteType);
    }

    return (
        <>
            <FontAwesomeIcon className="ml-2" icon={faEdit} onClick={handleShow}/>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editing note {note.id}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group controlId="">
                            <Form.Label>Note type</Form.Label>
                            <Form.Control ref={selectRef} as="select" defaultValue={note.type} onChange={handleChange}>
                                <option value={NoteType.FILE}>FILE</option>
                                <option value={NoteType.LINK}>LINK</option>
                                <option value={NoteType.TEXT}>TEXT</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>

                    <Form>
                        <Form.Group controlId="">
                            <Form.Label>Note name</Form.Label>
                            <Form.Control type="text" placeholder={note.name}/>
                        </Form.Group>
                    {
                        type === NoteType.TEXT ?
                            <Form.Group controlId="">
                                <Form.Label>Note content</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder={note.text}/>
                            </Form.Group> : null
                    }
                    {
                        type === NoteType.LINK ?
                            <Form.Group controlId="">
                                <Form.Label>Link</Form.Label>
                                <Form.Control type="text" placeholder={note.link}/>
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
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditModal;
