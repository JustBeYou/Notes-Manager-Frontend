import React, {useState} from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ModalProps, Note} from "./Note";
import {ThunkDispatch} from "redux-thunk";
import {DeleteThunk, FetchThunk} from "./State";
import {connect} from "react-redux";

interface DispatchProps {
    deleteNote: (note: Note) => Promise<void>,
}

function BaseDeleteModal({note, deleteNote}: ModalProps & DispatchProps) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function handleSubmit() {
        await deleteNote(note);
        handleClose();
    }

    return (
        <>
            <FontAwesomeIcon className="ml-2" icon={faTrash} onClick={handleShow}/>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete confirmation for "{note.name}"</Modal.Title>
                </Modal.Header>

                <Modal.Body>Are you sure you want to delete this note?</Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="danger" onClick={handleSubmit}>
                        Yes, delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>): DispatchProps => {
    return {
        deleteNote: async (note: Note) => {
            await dispatch(DeleteThunk(note));
            await dispatch(FetchThunk());
        }
    }
}

const DeleteModal = connect(null, mapDispatchToProps)(BaseDeleteModal);

export default DeleteModal;
