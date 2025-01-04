import React from "react";
import './writeReply.css';
import DraftEditor from "../../../../utils/editor/editor";
import { EditorState } from "draft-js";
import { stateToHTML } from 'draft-js-export-html';

const WriteReply = ({ title, placeholder, showEditor, onContentChange, onSubmit }) => {
    return (
        <div className={`entry-reply ${showEditor ? 'open': ''}`}>
            <div className="entry-reply-comment-title">
                <h3>{title}</h3>
            </div>
            <div className="entry-reply-comment-textarea">
                <DraftEditor
                    placeholder={placeholder}
                    onContentChange={onContentChange}
                    showToolbar={true}
                />
            </div>
            <div className="entry-reply-comment-submit">
                <button onClick={() => onSubmit()}>Reply</button>
            </div>
        </div>
    );
}

export default WriteReply;