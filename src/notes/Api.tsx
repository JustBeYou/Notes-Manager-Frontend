import React from "react";
import {Note, noteActions, NoteType} from "./Note";
import axios from "axios";

const apiURL = 'http://localhost:8080/api';

export async function fetchNotes() {
    return (await axios.get(`${apiURL}/notes`)).data as Note[];
}

export async function createNote(note: Note) {
    await axios.post(`${apiURL}/notes`, note);
}

export function makeNotesDisplayable(notes: Note[]) {
    return notes.map((note: Note) => {
        const newNote = {
            ...note,
            actionsButtons: noteActions(note),
        };

        switch (note.type) {
            case NoteType.FILE:
                newNote.displayLink = <p>{note.filename}</p>;
                break;
            case NoteType.TEXT:
                newNote.displayLink = <p>{note.text === undefined ? "" : note.text!.slice(0, 100)}</p>;
                break;
            case NoteType.LINK:
                const link = note.link === undefined ? "" : note.link;
                newNote.displayLink = <a href={link}>{link}</a>;
                break;
        }

        return newNote;
    });
}