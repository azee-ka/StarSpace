import React, { useState } from "react";
import './rightPanel.css';
import FullProfileEntriesTab from "../../tabs/entries/entries";
import FullProfilePostsTab from "../../tabs/posts/posts";
import { formatDateTime } from "../../../../../../utils/formatDateTime";

const FullProfileRightPanel = ({ profileInfo }) => {

    const tabs = [
        { 
            label: 'Axion Pings', 
            component: <FullProfilePostsTab />,
            condition: profileInfo?.stats?.posts_count > 0,
        },
        { 
            label: 'Qunata Pulses', 
            component: <FullProfileEntriesTab profileInfo={profileInfo} />,
            condition: profileInfo?.stats?.entries_count > 0,
        },
        { 
            label: 'Raidan Flares', 
            component: <FullProfileEntriesTab profileInfo={profileInfo} />,
            condition: profileInfo?.stats?.entries_count > 0,
        },
    ];

    const filteredTabs = tabs.filter(tab => tab.condition === undefined || tab.condition);

    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div className="full-profile-right-panel-inner">
            <div className="full-profile-right-panel-top-panel">
                <div className="full-profile-right-menu-tabs">
                    <ul className="full-profile-right-panel-tabs">
                        {filteredTabs.map((tab, index) => (
                            <li
                                key={index}
                                className={`full-profile-right-panel-tab-item ${activeTab === index ? 'active' : ''}`}
                                onClick={() => handleTabClick(index)}
                            >
                                <button>{tab.label}</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="full-profile-right-top-panel-info">
                    <div>
                        <p>Member Since</p>
                        <p>{formatDateTime(profileInfo?.basicInfo?.date_joined)}</p>
                    </div>
                </div>
            </div>
            <div className="full-profile-right-panel-content">
                {filteredTabs[activeTab] ? 
                    (
                        filteredTabs[activeTab].component

                    ) : (
                        <div className="right-panel-no-content">No Content!</div>
                    )
                }
            </div>
        </div>
    )
};

export default FullProfileRightPanel;