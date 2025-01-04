import React, { useEffect, useState } from "react";
import './createPacket.css';
import useApi from "../../../utils/useApi";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import { stateToHTML } from 'draft-js-export-html';
import { FaCross, FaEllipsisV, FaTimes, FaUpload } from "react-icons/fa";
import { useCreatePacketContext } from "../../../context/CreatePacketContext";
import DraftEditor from "../../../utils/editor/editor";

const CreatePacketOverlay = () => {
    const { callApi } = useApi();
    const navigate = useNavigate();
    const { closeCreatePacketOverlay: onClose } = useCreatePacketContext();

    const [showPacketEditorToolbar, setShowPacketEditorToolbar] = useState(false);

    // State for various fields
    const [content, setContent] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isSensitive, setIsSensitive] = useState(false);
    const [packetType, setPacketType] = useState("idea");
    const [isPrivate, setIsPrivate] = useState(true);

    // Handlers
    const handlePacketTypeChange = (e) => setPacketType(e.target.value);
    const handlePublicChange = (e) => setIsPrivate(e.target.checked);
    const handleUploadedFilesChange = (e) => setUploadedFiles([...e.target.files]);
    const handleSensitiveChange = (e) => setIsSensitive(e.target.checked);


    useEffect(() => {
        window.history.pushState(null, '', '/quantaspace/create-packet');
    }, []);


    const handleSubmit = async () => {
        const formData = new FormData();

        const contentState = content.getCurrentContent(); // Get current content from the editor
        const sanitizedContent = DOMPurify.sanitize(stateToHTML(contentState));

        formData.append('content', sanitizedContent);
        formData.append('is_sensitive', isSensitive);
        formData.append('is_private', isPrivate);
        formData.append('packet_type', packetType);

        // Append files to the FormData object
        uploadedFiles.forEach(file => {
            formData.append('uploaded_files', file);
        });

        try {
            const response = await callApi(`quantaspace/packet/create-packet/`, 'POST', formData, 'multipart/form-data');
            console.log(response.data);
            const packetId = response.data.uuid;

            // Navigate to the newly created packet page
            onClose(`/quantaspace/packet/${packetId}`);
        } catch (err) {
            console.error('Error posting packet', err);
        }
    };

    return (
        <div className="create-packet-page" onClick={() => onClose(window.location.pathname)}>
            <div className="create-packet-inner" onClick={(e) => e.stopPropagation(e)}>
                <button className="create-packet-overlay-close-btn" onClick={() => onClose(window.location.pathname)}>
                    <FaTimes className="icon-style" />
                </button>
                <h3>Create Packet</h3>
                <div className="create-packet-content-editor">
                    <DraftEditor
                        placeholder='Write something...'
                        onContentChange={(state) => setContent(state)}
                        showToolbar={showPacketEditorToolbar}
                    />
                    <div className="create-packet-actions-menubar">
                        <div className="create-packet-actions-menubar-inner">
                            <div className="create-packet-menu-btn">
                                <label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleUploadedFilesChange}
                                        style={{ display: 'none' }}
                                    />
                                    <FaUpload className="icon-style" />
                                </label>
                            </div>
                            <div className="create-packet-menu-btn" id="create-packet-menu-btn-selector">
                                <select value={packetType} onChange={handlePacketTypeChange}>
                                    <option disabled value="idea">Select Type</option>
                                    <option value="announcement">Announcement</option>
                                    <option value="idea">Idea</option>
                                    <option value="question">Question</option>
                                    <option value="poll">Poll</option>
                                </select>
                            </div>
                        </div>
                        <div className="create-packet-actions-menubar-inner">
                            <button
                                className="create-packet-settings-btn"
                                onClick={() => setShowPacketEditorToolbar(!showPacketEditorToolbar)}
                            >
                                    {showPacketEditorToolbar ? 'Show Toolbar' : 'Hide Toolbar'}
                            </button>
                            <button className="create-packet-settings-btn">
                                <FaEllipsisV className="icon-style" />
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <label>Visibility</label>
                    <input
                        type="checkbox"
                        checked={!isPrivate}
                        onChange={handlePublicChange}
                    />
                    <span>{isPrivate ? "Private" : "Visible to everyone"}</span>
                </div>
                <div className="create-packet-checkmarks">
                    <label>
                        <input type="checkbox" checked={isSensitive} onChange={handleSensitiveChange} />
                        Mark as Sensitive
                    </label>
                    <label>
                        <input type="checkbox" checked={isSensitive} onChange={handleSensitiveChange} />
                        Mark as Sensitive
                    </label>
                </div>
                <div className="create-packet-submit-btn">
                    <button onClick={handleSubmit}>Post Packet</button>
                </div>
            </div>
        </div>
    );
};

export default CreatePacketOverlay;
