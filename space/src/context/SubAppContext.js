import React, { createContext, useContext, useState, useEffect } from "react";

// Create SubApp Context
const SubAppContext = createContext();

export const SubAppProvider = ({ children }) => {
    const [activeSubApp, setActiveSubApp] = useState(() => {
        // Load from localStorage, default to "home"
        return localStorage.getItem("activeSubApp") || "home";
    });

    // Update localStorage whenever activeSubApp changes
    useEffect(() => {
        localStorage.setItem("activeSubApp", activeSubApp);
    }, [activeSubApp]);

    return (
        <SubAppContext.Provider value={{ activeSubApp, setActiveSubApp }}>
            {children}
        </SubAppContext.Provider>
    );
};

export const useSubApp = () => useContext(SubAppContext);
