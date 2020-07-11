import React from "react";
import {Note, noteActions, NoteType} from "./Note";
import axios from "axios";

export const apiURL = 'http://localhost:8080/api';

export async function fetchNotes() {
    return (await axios.get(`${apiURL}/notes`)).data as Note[];
}

export async function createNote(note: Note) {
    return (await axios.post(`${apiURL}/notes`, note)).data as Note;
}

export async function uploadFile(note: Note, formData: FormData) {
    console.log(formData);
    await axios.post(`${apiURL}/notes/${note.id}/upload`, formData);
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
            updated_at: new Date(note.updated_at).toLocaleString('en-GB'),
        };

        switch (note.type) {
            case NoteType.FILE:
                newNote.displayLink = <p>{note.original_filename}</p>;
                break;
            case NoteType.TEXT:
                if (note.text !== undefined && (note.text.length > 70 || note.text.includes("\n"))) {
                    newNote.displayLink = <p>{note.text.split("\n")[0].slice(0, 70) + " ... "}</p>;
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