import React, {useState} from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ModalProps, Note, NoteType} from "./Note";
import {ThunkDispatch} from "redux-thunk";
import {DeleteThunk, FetchThunk, UpdateThunk} from "./State";
import {connect} from "react-redux";
import {text} from "@fortawesome/fontawesome-svg-core";
import {updateNote, uploadFile} from "./Api";

interface DispatchProps {
    updateNote: (note: Note) => Promise<void>,
}

function BaseEditModal({note, updateNote}: ModalProps & DispatchProps) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [type, setType] = useState(note.type);
    const selectRef = React.createRef<HTMLSelectElement>();
    const nameRef = React.createRef<HTMLInputElement>();
    const textRef = React.createRef<HTMLTextAreaElement>();
    const linkRef = React.createRef<HTMLInputElement>();
    const fileRef = React.createRef<HTMLInputElement>();

    function handleChange() {
        const element = selectRef.current;
        const value = element?.options[element?.selectedIndex].value;
        setType(parseInt(value as string) as NoteType);
    }

    function getNoteType() {
        const element = selectRef.current;
        const type = element?.options[element?.selectedIndex].value;
        return parseInt(type as string) as NoteType;
    }

    async function handleSubmit() {
        const type = getNoteType();
        const newNote = {
            id: note.id,
        } as Note;

        if (nameRef.current!.value !== "" && nameRef.current!.value !== undefined) {
            newNote.name = nameRef.current!.value;
        }
        if (note.type != type) {
            note.type = type;
        }

        switch (type) {
            case NoteType.TEXT:
                newNote.text = textRef.current!.value;
                break;
            case NoteType.LINK:
                newNote.link = linkRef.current!.value;
                break;
            case NoteType.FILE:
                if (fileRef.current!.files !== null && fileRef.current!.files.length >= 1) {
                    newNote.original_filename = fileRef.current!.files[0].name;
                }
                break;
        }
        await updateNote(newNote);
        if (newNote.type === NoteType.FILE && fileRef.current!.files !== null && fileRef.current!.files.length >= 1) {
            const toUpload = fileRef.current!.files[0];
            const formData = new FormData();
            formData.append('note', toUpload);
            await uploadFile(newNote, formData);
        }

        handleClose();
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
                            <Form.Control ref={nameRef} type="text" placeholder={note.name}/>
                        </Form.Group>
                    {
                        type === NoteType.TEXT ?
                            <Form.Group controlId="">
                                <Form.Label>Note content</Form.Label>
                                <Form.Control ref={textRef} as="textarea" rows={3} placeholder={note.text}/>
                            </Form.Group> : null
                    }
                    {
                        type === NoteType.LINK ?
                            <Form.Group controlId="">
                                <Form.Label>Link</Form.Label>
                                <Form.Control ref={linkRef} type="text" placeholder={note.link}/>
                            </Form.Group> : null
                    }
                    {
                        type === NoteType.FILE ?
                            <Form.Group controlId="">
                                <Form.File
                                    ref={fileRef}
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
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>): DispatchProps => {
    return {
        updateNote: async (note: Note) => {
            await dispatch(UpdateThunk(note));
            await dispatch(FetchThunk());
        }
    }
}

const EditModal = connect(null, mapDispatchToProps)(BaseEditModal);

export default EditModal;
