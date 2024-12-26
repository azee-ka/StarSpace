import React, { useState } from "react";
import './settings.css';
import Visiblity from "./tabs/visiblity/visibility";

const Settings = () => {
    const [selectedParentIndex, setSelectedParentIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const tabs = {
        Profile: [
            { label: 'Basic Info', component: <Visiblity /> },
            { label: 'Your Activity', component: <Visiblity /> },
            { label: 'Your Activity', component: <Visiblity /> },
        ],
        Privacy: [
            { label: 'Visiblity', component: <Visiblity /> },
            { label: 'Restrictions', component: <Visiblity /> },
            { label: 'Local Visiblity', component: <Visiblity /> },
        ],
        Privacy2: [
            { label: 'Visiblity', component: <Visiblity /> },
            { label: 'Restrictions', component: <Visiblity /> },
            { label: 'Local Visiblity', component: <Visiblity /> },
        ],
    }

    const handleTabClick = (parentIndex, index) => {
        setSelectedParentIndex(parentIndex);
        setSelectedIndex(index);
    };

    return (
        <div className="settings-page">
            <div className="settings-left-panel">
                {Object.entries(tabs).map(([sectionKey, sectionItems], parentIndex) => (
                    <section key={parentIndex}>
                        <h3>{sectionKey}</h3>
                        <div>
                            {sectionItems.map((item, index) => (
                                <div key={index} onClick={() => handleTabClick(parentIndex, index)}>
                                    <p>{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
            <div className="settings-right-panel">
                <h2>Settings</h2>
                {
                    tabs[Object.keys(tabs)[selectedParentIndex]] && 
                    tabs[Object.keys(tabs)[selectedParentIndex]][selectedIndex] &&
                    tabs[Object.keys(tabs)[selectedParentIndex]][selectedIndex].component
                }
            </div>
        </div>
    );
};

export default Settings;