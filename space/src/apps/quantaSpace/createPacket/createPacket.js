import React, { useEffect, useState } from "react";
import './createPacket.css';
import useApi from "../../../utils/useApi";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import DraftEditor from "../../../utils/editor/editor";
import { stateToHTML } from 'draft-js-export-html';
import { FaCross, FaTimes } from "react-icons/fa";

const CreatePacketOverlay = ({ onClose }) => {
    const { callApi } = useApi();
    const navigate = useNavigate();
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
            navigate(`/quantaspace/packet/${packetId}`);
        } catch (err) {
            console.error('Error posting packet', err);
        }
    };

    return (
        <div className="create-packet-page" onClick={onClose}>
            <div className="create-packet-inner" onClick={(e) => e.stopPropagation(e)}>
                <button className="create-packet-overlay-close-btn" onClick={onClose}>
                    <FaTimes className="icon-style" />
                </button>
                <h3>Create Packet</h3>
                <div className="create-packet-content-editor">
                    <DraftEditor
                        placeholder='Write something...'
                        onContentChange={(state) => setContent(state)}
                    />
                </div>
                <input type="file" multiple onChange={handleUploadedFilesChange} />
                <div>
                    <label>Packet Type</label>
                    <select value={packetType} onChange={handlePacketTypeChange}>
                        <option value="announcement">Announcement</option>
                        <option value="idea">Idea</option>
                        <option value="question">Question</option>
                        <option value="poll">Poll</option>
                    </select>
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
