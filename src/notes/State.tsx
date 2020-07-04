import {Action, ActionCreator, AnyAction, applyMiddleware, createStore, Reducer} from "redux";
import {Note} from "./Note";
import thunk, {ThunkAction} from "redux-thunk";
import {createNote, deleteNote, fetchNotes, makeNotesDisplayable, updateNote} from "./Api";

export interface State {
    notes: Note[],
    isFetching: boolean,
}
const defaultState = {notes: [], isFetching: false} as State;

export interface FetchAction extends Action {
    type: string,
}

export const Fetch: ActionCreator<FetchAction> = () => ({
    type: 'FETCH',
});

export interface ReceivedAction extends Action {
    type: string,
    data: Note[],
}

export const Received: ActionCreator<ReceivedAction> = (data: Note[]) => ({
    type: 'RECEIVED',
    data,
});

export const reducer: Reducer<State> = (state, action) => {
    if (state === undefined) return defaultState;

    switch (action.type) {
        case 'FETCH':
            if (!state.isFetching) {
                return {...state, isFetching: true};
            }
            return state;
        case 'RECEIVED':
            return {
              isFetching: false,
              notes: (action as ReceivedAction).data,
            };
        default:
            return state;
    }
}

export const FetchThunk = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch) => {
        dispatch(Fetch());
        const notes = await fetchNotes();
        dispatch(Received(notes));
    }
};

export const CreateThunk = (note: Note): ThunkAction<Promise<Note>, {}, {}, AnyAction> => {
    return async () => {
        return await createNote(note);
    }
};

export const DeleteThunk = (note: Note): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async () => {
        await deleteNote(note);
    }
};

export const UpdateThunk = (note: Note): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async () => {
        await updateNote(note);
    }
};

export const store = createStore(reducer, applyMiddleware(thunk));