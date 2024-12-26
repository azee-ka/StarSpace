import React, { useState } from "react";
import './rightPanel.css';
import ProfilePosts from "../tabs/posts/posts";
import ProfileSpaces from "../tabs/spaces/spaces";
import { formatDateTime } from "../../../../utils/formatDateTime";
import ProfileEntries from "../tabs/entries/entries";

const RightPanel = ({ profileInfo }) => {

    const tabs = [
        { label: 'Posts', component: <ProfilePosts /> },
        { label: 'Entries', component: <ProfileEntries profileInfo={profileInfo} /> },
        { label: 'Spaces', component: <ProfileSpaces /> },
    ];

    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };


    return (
        <div className="my-profile-right-panel-inner">
            <div className="my-profile-right-top-panel">
                <ul className="my-profile-right-panel-tabs">
                    {tabs.map((tab, index) => (
                        <li
                            key={index}
                            className={`my-profile-right-panel-tab-item ${activeTab === index ? 'active' : ''}`}
                            onClick={() => handleTabClick(index)}
                        >
                            <button>{tab.label}</button>
                        </li>
                    ))}
                </ul>
                <div className="my-profile-right-panel-info">
                    <div>
                        <p>Member Since</p>
                        <p>{formatDateTime(profileInfo?.basicInfo?.date_joined)}</p>
                    </div>
                </div>
            </div>
            <div className="my-profile-right-bottom-panel">
                {tabs[activeTab].component && tabs[activeTab].component}
            </div>
        </div>
    )
};

export default RightPanel;