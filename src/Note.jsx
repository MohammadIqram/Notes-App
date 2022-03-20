import React, {useState, useEffect} from 'react';
import './Note.css';
import PaletteOutlinedIcon from '@material-ui/icons/PaletteOutlined';
import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

function Note({noteId, title, body, deleteNote}){

    return (
        <>
            <div className="note-box">
                <p className="note-box-title">{title}</p>
                <p className="note-box-body">{body}</p>
                <div className="note-menu-panel">
                <CheckCircleIcon className="note-check" />
                    <ul>
                        <li><a><PaletteOutlinedIcon className="note-panel-icon" /></a></li>
                        <li><a><ArchiveOutlinedIcon className="note-panel-icon" /></a></li>
                        <li value={noteId} onClick={deleteNote}><a><DeleteOutlinedIcon className="note-panel-icon" /></a></li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Note;