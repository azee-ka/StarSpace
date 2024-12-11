import React, { useState } from "react";
import "./createEntryOverlay.css";
import axios from "axios";
import API_BASE_URL from "../../../../apiUrl";
import { useAuth } from "../../../../reducers/auth/useAuth";
import getConfig from "../../../../config";
import { FaChevronCircleLeft, FaChevronCircleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const CreateEntryOverlay = ({ exchangeUUID, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { authState } = useAuth();
    const config = getConfig(authState, "multipart/form-data");
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("");
    const [uploadedContentFiles, setUploadedContentFiles] = useState([]);
    const [currentFileIndex, setCurrentFileIndex] = useState(0);


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
            const formData = new FormData();
            formData.append("title", title);
            formData.append("text", description); // Match 'text' key expected by backend
    
            // Add files to FormData
            uploadedContentFiles.forEach((file) => {
                formData.append("uploadedFiles", file); // Match 'uploadedFiles' key expected by backend
            });
    
            const response = await axios.post(`${API_BASE_URL}api/openspace/exchange/${exchangeUUID}/create-entry/`, formData, config)
            console.log(response.data);
            navigate(`/openspace/exchange/${exchangeUUID}/entry/${response.data.entry_uuid}`, { replace: true });
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
                            ></textarea>
                        </div>
                        <div className="create-entry-overlay-content">
                            <textarea
                                className="entry-textarea-content"
                                placeholder="Enter context..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
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
