import React from "react";
import DOMPurify from 'dompurify';
import './entries.css';
import { useNavigate } from "react-router-dom";

const FullProfileEntriesTab = ({ profileInfo }) => {
    const navigate = useNavigate();

    const handleEntryClick = (entryUUID) => {
        console.log(entryUUID);
        navigate(`/openspace/entry/${entryUUID}`);
    };


    return (
        <div className="full-profile-entry-tab">
            <div className="full-profile-entries-content">
                {profileInfo?.data?.entries?.map((entry, index) => (
                    <div className="full-profile-entries-per-entry" key={index}>
                        <div className="full-profile-entries-per-entry-content">
                        <div className="full-profile-entries-per-entry-inner" onClick={() => handleEntryClick(entry.uuid)}>
                            <div className="full-profile-entry-title">
                                <h3>{entry.title}</h3>
                            </div>
                            <div className="full-profile-entry-content">
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.content) }} />
                            </div>
                        </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="full-profile-entries-stats">
                <h3>Your Stats</h3>
                <div>

                </div>
            </div>
        </div>
    );
}

export default FullProfileEntriesTab;