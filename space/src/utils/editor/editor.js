import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBold,
    faItalic,
    faUnderline,
    faCode,
    faHighlighter,
    faStrikethrough,
    faAlignLeft,
    faAlignCenter,
    faAlignRight,
    faAlignJustify,
    faListOl,
    faListUl,
    faQuoteRight,
    faRedo,
    faUndo,
} from '@fortawesome/free-solid-svg-icons';
import 'draft-js/dist/Draft.css';
import './editor.css'; // Import the CSS file

const DraftEditor = ({ placeholder, onContentChange }) => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const handleEditorChange = (state) => {
        setEditorState(state);
        const rawContent = convertToRaw(state.getCurrentContent());
        onContentChange && onContentChange(rawContent);
    };

    const toggleInlineStyle = (style) => {
        handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
    };

    const toggleBlockStyle = (blockType) => {
        handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
    };

    const currentInlineStyle = editorState.getCurrentInlineStyle();
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="editor-container">
            <div className="toolbar">
                {/* Inline Styles */}
                <button
                    className={`button ${currentInlineStyle.has('BOLD') ? 'active' : ''}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        toggleInlineStyle('BOLD');
                    }}
                >
                    <FontAwesomeIcon icon={faBold} />
                </button>
                <button
                    className={`button ${currentInlineStyle.has('ITALIC') ? 'active' : ''}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        toggleInlineStyle('ITALIC');
                    }}
                >
                    <FontAwesomeIcon icon={faItalic} />
                </button>
                <button
                    className={`button ${currentInlineStyle.has('UNDERLINE') ? 'active' : ''}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        toggleInlineStyle('UNDERLINE');
                    }}
                >
                    <FontAwesomeIcon icon={faUnderline} />
                </button>
                <button
                    className={`button ${currentInlineStyle.has('STRIKETHROUGH') ? 'active' : ''}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        toggleInlineStyle('STRIKETHROUGH');
                    }}
                >
                    <FontAwesomeIcon icon={faStrikethrough} />
                </button>
                <button
                    className={`button ${currentInlineStyle.has('CODE') ? 'active' : ''}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        toggleInlineStyle('CODE');
                    }}
                >
                    <FontAwesomeIcon icon={faCode} />
                </button>
                <button
                    className="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        toggleInlineStyle('HIGHLIGHT');
                    }}
                >
                    <FontAwesomeIcon icon={faHighlighter} />
                </button>

                {/* Block Styles */}
                <button
                    className={`button ${blockType === 'unordered-list-item' ? 'active' : ''}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        toggleBlockStyle('unordered-list-item');
                    }}
                >
                    <FontAwesomeIcon icon={faListUl} />
                </button>
                <button
                    className={`button ${blockType === 'ordered-list-item' ? 'active' : ''}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        toggleBlockStyle('ordered-list-item');
                    }}
                >
                    <FontAwesomeIcon icon={faListOl} />
                </button>
                <button
                    className={`button ${blockType === 'blockquote' ? 'active' : ''}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        toggleBlockStyle('blockquote');
                    }}
                >
                    <FontAwesomeIcon icon={faQuoteRight} />
                </button>

                {/* Undo/Redo */}
                <button
                    className="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleEditorChange(EditorState.undo(editorState));
                    }}
                >
                    <FontAwesomeIcon icon={faUndo} />
                </button>
                <button
                    className="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleEditorChange(EditorState.redo(editorState));
                    }}
                >
                    <FontAwesomeIcon icon={faRedo} />
                </button>
            </div>

            <div className="editor">
                <Editor
                    placeholder={placeholder || 'Start typing...'}
                    editorState={editorState}
                    onChange={handleEditorChange}
                />
            </div>
        </div>
    );
};

export default DraftEditor;
