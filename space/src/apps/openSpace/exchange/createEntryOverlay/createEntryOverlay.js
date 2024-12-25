import React, { useRef, useState } from "react";
import "./createEntryOverlay.css";
import { FaChevronCircleLeft, FaChevronCircleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import useApi from "../../../../utils/useApi";
import Editor from "../../../../utils/editor/editor";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import DraftEditor from "../../../../utils/editor/editor";
import { EditorState } from "draft-js";
import { stateToHTML } from 'draft-js-export-html';

const CreateEntryOverlay = ({ exchangeUUID, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { callApi } = useApi();
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState(EditorState.createEmpty());
    const [uploadedContentFiles, setUploadedContentFiles] = useState([]);
    const [currentFileIndex, setCurrentFileIndex] = useState(0);
    const editorRef = useRef(null);

    const handleContentUpload = (event) => {
        setUploadedContentFiles([
            ...uploadedContentFiles,
            ...Array.from(event.target.files),
        ]);
    };

    const handleNavigation = (direction) => {
        if (direction === "next") {
            setCurrentFileIndex((prevIndex) =>
                prevIndex + 1 >= uploadedContentFiles.length ? 0 : prevIndex + 1
            );
        } else if (direction === "prev") {
            setCurrentFileIndex((prevIndex) =>
                prevIndex - 1 < 0 ? uploadedContentFiles.length - 1 : prevIndex - 1
            );
        }
    };

    const handleSubmit = async () => {
        try {
            const sanitizedTitle = DOMPurify.sanitize(title);

            const contentState = description.getCurrentContent(); // Get current content from the editor
            const sanitizedDescription = DOMPurify.sanitize(stateToHTML(contentState));

            const formData = new FormData();
            formData.append("title", sanitizedTitle);
            formData.append("text", sanitizedDescription); // Match 'text' key expected by backend
    
            // Add files to FormData
            uploadedContentFiles.forEach((file) => {
                formData.append("uploadedFiles", file); // Match 'uploadedFiles' key expected by backend
            });
            
            const response = await callApi(`openspace/exchange/${exchangeUUID}/create-entry/`, 'POST', formData, "multipart/form-data")
            console.log(response.data);
            navigate(`/openspace/entry/${response.data.entry_uuid}`);
            // console.log('location.href', location);
            onClose();
        } catch (err) {
            console.error('Error creating entry:', err);
        }
    };


    const renderCurrentPreview = () => {
        if (uploadedContentFiles.length === 0) {
            return <p>No files uploaded yet.</p>;
        }

        const file = uploadedContentFiles[currentFileIndex];
        const fileType = file.type.split("/")[0]; // Check the type (image, video, etc.)

        if (fileType === "image") {
            return (
                <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${currentFileIndex}`}
                    className="preview-media"
                />
            );
        } else if (fileType === "video") {
            return (
                <video
                    controls
                    className="preview-media"
                    src={URL.createObjectURL(file)}
                />
            );
        } else {
            return <p>{file.name}</p>;
        }
    };


    return (
        <div className="create-entry-overlay" onClick={() => onClose()}>
            <div className="create-entry-overlay-inner">
                <div className="create-entry-overlay-card" onClick={(e) => e.stopPropagation()}>
                    <div className="create-entry-overlay-title">
                        <h3>Create Entry</h3>
                    </div>
                    <div className="create-entry-overlay-textarea">
                        <div className="create-entry-overlay-title">
                            <textarea
                                className="entry-textarea-title"
                                placeholder="Enter prompt here..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="create-entry-overlay-content">
                            <DraftEditor 
                                placeholder="Enter context..." 
                                onContentChange={(state) => setDescription(state)}
                            />
                        </div>
                    </div>
                    <div className="entry-overlay-subtmit-btn">
                        <button onClick={handleSubmit} >Submit Entry</button>
                    </div>
                </div>
                <div className="create-entry-overlay-upload" onClick={(e) => e.stopPropagation()}>
                    <div className="create-entry-overlay-upload-inner" onClick={() => document.getElementById('media-upload').click()}>
                        <input
                            type="file"
                            id="media-upload"
                            accept="image/*,video/*,.pdf,.doc,.docx,.xlsx,.ppt,.pptx,.txt"
                            multiple
                            onChange={handleContentUpload}
                            style={{ display: 'none' }} // Hide the input
                        />
                        <div className="create-entry-overlay-click-area">
                            <h2>+</h2>
                            <h2>Upload Content</h2>
                        </div>
                    </div>
                </div>
            </div>
            {uploadedContentFiles.length !== 0 &&
                <div className="entry-overlay-content-upload-preview" onClick={(e) => e.stopPropagation()}>
                    <div className="entry-overlay-preview-container">
                        {renderCurrentPreview()}
                        <div className="navigation-buttons">
                            <div>
                            {currentFileIndex > 0 &&
                                <button onClick={() => handleNavigation("prev")}>
                                    <FaChevronLeft />
                                </button>
                            }
                            </div>
                            <div>
                            {currentFileIndex < uploadedContentFiles.length - 1 &&
                                <button onClick={() => handleNavigation("next")}>
                                <FaChevronRight />
                            </button>
                            }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default CreateEntryOverlay;
