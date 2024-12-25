import React, { useEffect, useState } from "react";
import DOMPurify from 'dompurify';
import './entries.css';
import useApi from "../../../../../utils/useApi";
import { useNavigate } from "react-router-dom";

const ProfileEntries = ({ profileInfo }) => {
    const navigate = useNavigate();
    const { callApi } = useApi();

    const handleEntryClick = (entryUUID) => {
        console.log(entryUUID);
        navigate(`/openspace/entry/${entryUUID}`);
    };


    return (
        <div className="profile-entries">
            <div className="profile-entries-content">
                {profileInfo?.entries?.map((entry, index) => (
                    <div className="profile-entries-per-entry" key={index}>
                        <div className="profile-entries-per-entry-content">
                        <div className="profile-entries-per-entry-inner" onClick={() => handleEntryClick(entry.uuid)}>
                            <div className="profile-entry-title">
                                <h3>{entry.title}</h3>
                            </div>
                            <div className="profile-entry-content">
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.content) }} />
                            </div>
                        </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="profile-entries-stats">
                <h3>Your Stats</h3>
                <div>

                </div>
            </div>
        </div>
    )
}

export default ProfileEntries;