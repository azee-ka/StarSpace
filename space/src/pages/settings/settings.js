import React, { useEffect, useState } from "react";
import './settings.css';
import Visiblity from "./tabs/visiblity/visibility";
import Profile from "../profile/profile";
import ProfileAppearance from "./tabs/profileAppearance/profileAppearance";

const Settings = () => {
    const [isCustomizing, setIsCustomizing] = useState(false);

    const startCustomization = () => setIsCustomizing(true);
    const stopCustomization = () => setIsCustomizing(false);
    const [customizeTargetPage, setCustomizeTargetPage] = useState('');

    const handleStartCustomization = (targetPage) => {
        startCustomization();
        setCustomizeTargetPage(targetPage);
    };

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
        Appearance: [
            { label: 'Profile Appearance', component: <ProfileAppearance handleStartCustomization={handleStartCustomization} /> },
            { label: 'Restrictions', component: <Visiblity /> },
            { label: 'Local Visiblity', component: <Visiblity /> },
        ],
    }


    const tabKeys = Object.entries(tabs).flatMap(([sectionKey, sectionItems], parentIndex) =>
        sectionItems.map((item, index) => ({
            hash: `#${sectionKey.toLowerCase()}-${item.label.replace(/\s+/g, '-').toLowerCase()}`,
            parentIndex,
            index,
        }))
    );


    useEffect(() => {
        const handleHashChange = () => {
            const currentHash = window.location.hash;
            const matchingTab = tabKeys.find((tab) => tab.hash === currentHash);

            if (matchingTab) {
                setSelectedParentIndex(matchingTab.parentIndex);
                setSelectedIndex(matchingTab.index);
            }
        };

        handleHashChange(); // Set the tab on initial load
        window.addEventListener("hashchange", handleHashChange);

        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, [tabKeys]);


    const handleTabClick = (parentIndex, index) => {
        setSelectedParentIndex(parentIndex);
        setSelectedIndex(index);

        const selectedTab = tabKeys.find(
            (tab) => tab.parentIndex === parentIndex && tab.index === index
        );
        if (selectedTab) {
            window.location.hash = selectedTab.hash; // Update the URL hash
        }
    };

    return isCustomizing ? (
        <div className="settings-customization-page">
            <button className="exit-customization" onClick={stopCustomization}>
                Exit Customization
            </button>
            <Profile enforceViewType={customizeTargetPage} isCustomizing={true} />
        </div>
    ) : (
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
                    tabs[Object.keys(tabs)[selectedParentIndex]][selectedIndex]?.component
                }
            </div>
        </div>
    );
};

export default Settings;