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

export async function deleteNote(note: Note) {
    await axios.delete(`${apiURL}/notes/${note.id}`);
}

export async function updateNote(note: Note) {
    await axios.put(`${apiURL}/notes/${note.id}`, note);
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
                if (note.text !== undefined && note.text.length > 70) {
                    newNote.displayLink = <p>{note.text.slice(0, 70) + " ... "}</p>;
                } else if (note.text !== undefined) {
                    newNote.displayLink = <p>{note.text}</p>;
                }
                break;
            case NoteType.LINK:
                const link = note.link === undefined ? "" : note.link;
                newNote.displayLink = <a href={link}>{link}</a>;
                break;
        }

        return newNote;
    });
}