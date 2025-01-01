import React, { useState } from "react";
import './rightPanel.css';
import ProfilePosts from "../tabs/posts/posts";
import ProfileSpaces from "../tabs/spaces/spaces";
import { formatDateTime } from "../../../../utils/formatDateTime";
import ProfileEntries from "../tabs/entries/entries";

const RightPanel = ({ profileInfo }) => {

    const tabs = [
        { 
            label: 'Pings', 
            component: <ProfilePosts />,
            condition: profileInfo?.stats?.entries_count > 0,
        }, // AxionSpace (Twitter-like)
        { 
            label: 'Flares', 
            component: <ProfilePosts />,
            condition: profileInfo?.stats?.entries_count > 0,
        }, // RadianSpace (Insta-like)
        { 
            label: 'Pulses', 
            component: <ProfileEntries profileInfo={profileInfo} />,
            condition: profileInfo?.stats?.entries_count > 0,
        }, // QuantaSpace (Reddit-like)
        
        { label: 'Spaces', component: <ProfileSpaces /> },
    ];

    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };


    return (
        <div className="my-profile-right-panel-inner">
            <div className="my-profile-right-top-panel">
                <div className="my-profile-right-top-panel-inner">
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
                {tabs[activeTab]?.label === 'Entries' &&
                    <div className="my-profile-right-top-panel-other-btns">
                        <button>Create Entry</button>
                    </div>
                }
                </div>
                <div className="my-profile-right-panel-info">
                    <div>
                        <p>Member Since</p>
                        <p>{formatDateTime(profileInfo?.basicInfo?.date_joined)}</p>
                    </div>
                </div>
            </div>
            <div className="my-profile-right-bottom-panel">
                {tabs[activeTab]?.component}
            </div>
        </div>
    )
};

export default RightPanel;