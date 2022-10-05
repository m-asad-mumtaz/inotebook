import React, { useState } from 'react';
import NoteContext from './NoteContext';

const NoteState = (props) => {
    const notesInitial = [
        {
            "_id": "633c1c519f8a74edf78b6562",
            "user": "633bf4f4da93f79e404bd025",
            "title": "My Note",
            "description": "Hi, This is my first note.",
            "tag": "firstnote",
            "date": "2022-10-04T11:43:13.456Z",
            "__v": 0
        },
        {
            "_id": "633d36b81b782cdf6c835fe4",
            "user": "633bf4f4da93f79e404bd025",
            "title": "Poco X4",
            "description": "poco is the sub brand of xiaomi company.",
            "tag": "smartphone",
            "date": "2022-10-05T07:48:08.923Z",
            "__v": 0
        },
        {
            "_id": "633d36da1b782cdf6c835fe6",
            "user": "633bf4f4da93f79e404bd025",
            "title": "Poco X4",
            "description": "poco is the sub brand of xiaomi company.",
            "tag": "smartphone",
            "date": "2022-10-05T07:48:42.831Z",
            "__v": 0
        },
        {
            "_id": "633c1c519f8a74edf78b6562",
            "user": "633bf4f4da93f79e404bd025",
            "title": "My Note",
            "description": "Hi, This is my first note.",
            "tag": "firstnote",
            "date": "2022-10-04T11:43:13.456Z",
            "__v": 0
        },
        {
            "_id": "633d36b81b782cdf6c835fe4",
            "user": "633bf4f4da93f79e404bd025",
            "title": "Poco X4",
            "description": "poco is the sub brand of xiaomi company.",
            "tag": "smartphone",
            "date": "2022-10-05T07:48:08.923Z",
            "__v": 0
        },
        {
            "_id": "633d36da1b782cdf6c835fe6",
            "user": "633bf4f4da93f79e404bd025",
            "title": "Poco X4",
            "description": "poco is the sub brand of xiaomi company.",
            "tag": "smartphone",
            "date": "2022-10-05T07:48:42.831Z",
            "__v": 0
        }
    ]

    const [notes, setNotes] = useState(notesInitial)

    return (
        <NoteContext.Provider value={{ notes, setNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;