import React, {useState} from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {faEye} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ModalProps} from "./Note";

function ViewModal({note}: ModalProps) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <FontAwesomeIcon className="ml-2" icon={faEye} onClick={handleShow}/>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{note.name}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {
                        note.text === undefined ? null : note.text.split('\n').map((elem) => {
                            return <>{elem}<br/></>;
                        })
                    }
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ViewModal;
