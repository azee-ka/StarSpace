import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, Modifier } from 'draft-js';
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
    faTextHeight,
    faFont,
    faPalette,
    faEraser,
    faSuperscript,
    faSubscript,
    faTable,
    faLink,
    faImage,
    faTint, // For text color
    faFillDrip // For background color
} from '@fortawesome/free-solid-svg-icons';
import 'draft-js/dist/Draft.css';
import './editor.css';

const DraftEditor = ({ placeholder, onContentChange }) => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [textColor, setTextColor] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const [fontSize, setFontSize] = useState("16px");
    const [fontFamily, setFontFamily] = useState("");

    const editorRef = useRef(null);

    
    // Function to ensure the editor scrolls to the caret
    const scrollToCaret = () => {
        const editorDOM = editorRef.current;
        const contentDiv = editorDOM.querySelector('.public-DraftEditor-content');
        
        if (contentDiv) {
            const caretElement = contentDiv.querySelector('.public-DraftEditor-caret');
            if (caretElement) {
                const caretPosition = caretElement.getBoundingClientRect();
                const editorPosition = editorDOM.getBoundingClientRect();

                // If caret is below the visible area, scroll to it
                if (caretPosition.bottom > editorPosition.bottom) {
                    editorDOM.scrollTop += caretPosition.bottom - editorPosition.bottom;
                }
            }
        }
    };

    const handleEditorChange = useCallback((state) => {
        setEditorState(state);
        onContentChange && onContentChange(state);
        
        // Scroll to caret after state changes (e.g., pressing Enter)
        setTimeout(scrollToCaret, 0); // Ensure this happens after the DOM update
    }, [onContentChange]);

    useEffect(() => {
        // Scroll the editor whenever the editor state changes, particularly after Enter press
        scrollToCaret();
    }, [editorState]);
    

    const toggleInlineStyle = useCallback((style) => {
        handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
    }, [editorState, handleEditorChange]);

    const toggleBlockStyle = useCallback((blockType) => {
        handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
    }, [editorState, handleEditorChange]);

    const handleTextColor = (color) => {
        setTextColor(color);
        if (!editorState.getSelection().isCollapsed()) {
            const contentState = editorState.getCurrentContent();
            const selection = editorState.getSelection();
            const newContentState = Modifier.applyInlineStyle(contentState, selection, color);
            const newEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
            handleEditorChange(newEditorState);
        }
    };

    const handleBackgroundColor = (color) => {
        setBackgroundColor(color);
        if (!editorState.getSelection().isCollapsed()) {
            const contentState = editorState.getCurrentContent();
            const selection = editorState.getSelection();
            const newContentState = Modifier.applyInlineStyle(contentState, selection, color);
            const newEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
            handleEditorChange(newEditorState);
        }
    };

    const handleFontSize = (size) => {
        setFontSize(size);
        if (!editorState.getSelection().isCollapsed()) {
            const contentState = editorState.getCurrentContent();
            const selection = editorState.getSelection();
            const newContentState = Modifier.applyInlineStyle(contentState, selection, size);
            const newEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
            handleEditorChange(newEditorState);
        }
    };

    const handleFontFamily = (family) => {
        setFontFamily(family);
        if (!editorState.getSelection().isCollapsed()) {
            const contentState = editorState.getCurrentContent();
            const selection = editorState.getSelection();
            const newContentState = Modifier.applyInlineStyle(contentState, selection, family);
            const newEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
            handleEditorChange(newEditorState);
        }
    };

    const handleUndo = () => {
        const undoState = EditorState.undo(editorState);
        handleEditorChange(undoState);
    };

    const handleRedo = () => {
        const redoState = EditorState.redo(editorState);
        handleEditorChange(redoState);
    };

    return (
        <div className="editor-container">
            <div className="toolbar">
                {/* Inline Styles */}
                <button className={`button ${editorState.getCurrentInlineStyle().has('BOLD') ? 'active' : ''}`} 
                    onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('BOLD'); }}>
                    <FontAwesomeIcon icon={faBold} />
                </button>
                <button className={`button ${editorState.getCurrentInlineStyle().has('ITALIC') ? 'active' : ''}`} 
                    onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('ITALIC'); }}>
                    <FontAwesomeIcon icon={faItalic} />
                </button>
                <button className={`button ${editorState.getCurrentInlineStyle().has('UNDERLINE') ? 'active' : ''}`} 
                    onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('UNDERLINE'); }}>
                    <FontAwesomeIcon icon={faUnderline} />
                </button>
                <button className={`button ${editorState.getCurrentInlineStyle().has('STRIKETHROUGH') ? 'active' : ''}`} 
                    onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('STRIKETHROUGH'); }}>
                    <FontAwesomeIcon icon={faStrikethrough} />
                </button>
                <button className={`button ${editorState.getCurrentInlineStyle().has('SUPERSCRIPT') ? 'active' : ''}`} 
                    onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('SUPERSCRIPT'); }}>
                    <FontAwesomeIcon icon={faSuperscript} />
                </button>
                <button className={`button ${editorState.getCurrentInlineStyle().has('SUBSCRIPT') ? 'active' : ''}`} 
                    onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('SUBSCRIPT'); }}>
                    <FontAwesomeIcon icon={faSubscript} />
                </button>
                <button className="button" 
                    onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('CODE'); }}>
                    <FontAwesomeIcon icon={faCode} />
                </button>

                {/* Text Color Picker */}
                <button className="button" 
                    onMouseDown={(e) => { e.preventDefault(); handleTextColor("#ff6347"); }}>
                    <FontAwesomeIcon icon={faTint} />
                </button>
                {/* Background Color Picker */}
                <button className="button" 
                    onMouseDown={(e) => { e.preventDefault(); handleBackgroundColor("#ffff00"); }}>
                    <FontAwesomeIcon icon={faFillDrip} />
                </button>

                {/* Font Family and Size */}
                
                <div className="editor-selector">
                <select onChange={(e) => handleFontFamily(e.target.value)} value={fontFamily}>
                    <option value="Roboto">Roboto</option>
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                </select>
                </div>
                
                <div className="editor-selector">
                <select onChange={(e) => handleFontSize(e.target.value)} value={fontSize}>
                    <option value="14px">14px</option>
                    <option value="16px">16px</option>
                    <option value="18px">18px</option>
                    <option value="20px">20px</option>
                </select>
                </div>

                {/* Block Styles (Alignments and Lists) */}
                <button className="button" onMouseDown={(e) => { e.preventDefault(); toggleBlockStyle('unordered-list-item'); }}>
                    <FontAwesomeIcon icon={faListUl} />
                </button>
                <button className="button" onMouseDown={(e) => { e.preventDefault(); toggleBlockStyle('ordered-list-item'); }}>
                    <FontAwesomeIcon icon={faListOl} />
                </button>
                <button className="button" onMouseDown={(e) => { e.preventDefault(); toggleBlockStyle('left'); }}>
                    <FontAwesomeIcon icon={faAlignLeft} />
                </button>
                <button className="button" onMouseDown={(e) => { e.preventDefault(); toggleBlockStyle('center'); }}>
                    <FontAwesomeIcon icon={faAlignCenter} />
                </button>
                <button className="button" onMouseDown={(e) => { e.preventDefault(); toggleBlockStyle('right'); }}>
                    <FontAwesomeIcon icon={faAlignRight} />
                </button>
                <button className="button" onMouseDown={(e) => { e.preventDefault(); toggleBlockStyle('justify'); }}>
                    <FontAwesomeIcon icon={faAlignJustify} />
                </button>

                {/* Undo/Redo */}
                <button className="button" onMouseDown={handleUndo}>
                    <FontAwesomeIcon icon={faUndo} />
                </button>
                <button className="button" onMouseDown={handleRedo}>
                    <FontAwesomeIcon icon={faRedo} />
                </button>
            </div>

            <div 
                className="editor"
                ref={editorRef}
                style={{ fontFamily, fontSize, color: textColor, backgroundColor }}>
                <Editor
                // ref={editorRef}
                    placeholder={placeholder || 'Start typing...'}
                    editorState={editorState}
                    onChange={handleEditorChange}
                />
            </div>
        </div>
    );
};

export default DraftEditor;
