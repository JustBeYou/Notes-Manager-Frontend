import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import ViewModal from "./ViewModal";
import {apiURL} from "./Api";

export interface ModalProps {
    note: Note,
}

export interface Note {
    id: number;
    name: string;
    updated_at: string;
    type: NoteType;

    actionsButtons: JSX.Element[];
    text?: string;
    filename?: string;
    original_filename?: string;
    link?: string;
    displayLink?: JSX.Element;
}

export enum NoteType {
    LINK = 0,
    TEXT = 1,
    FILE = 2,
}

export function noteActions(note: Note) {
    const actions: JSX.Element[] = [editAction(note), deleteAction(note)];

    switch (note.type) {
        case NoteType.FILE:
            actions.push(downloadAction(note));
            break;

        case NoteType.LINK:
            break;

        case NoteType.TEXT:
            actions.push(viewAction(note));
            break;
    }

    return actions;
}

function deleteAction(note: Note) {
    return <DeleteModal note={note}/>;
}

function downloadAction(note: Note) {
    return <a href={`${apiURL}/notes/${note.id}/download`}><FontAwesomeIcon icon={faDownload} className="ml-2"/></a>;
}

function viewAction(note: Note) {
    return <ViewModal note={note}/>;
}

function editAction(note: Note) {
    return <EditModal note={note}/>;
}

