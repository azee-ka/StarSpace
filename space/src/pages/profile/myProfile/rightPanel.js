import React, { useState } from "react";
import './rightPanel.css';
import ProfilePosts from "./tabs/posts/posts";
import ProfileSpaces from "./tabs/spaces/spaces";
import { formatDateTime } from "../../../utils/formatDateTime";

const RightPanel = ({ profileInfo }) => {

    const tabs = [
        { label: 'Posts', Component: ProfilePosts },
        { label: 'Spaces', Component: ProfileSpaces },
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
                        <p>{formatDateTime(profileInfo?.date_joined)}</p>
                    </div>
                </div>
            </div>
            <div className="my-profile-right-bottom-panel">
                {tabs[activeTab].Component && React.createElement(tabs[activeTab].Component)}
            </div>
        </div>
    )
};

export default RightPanel;