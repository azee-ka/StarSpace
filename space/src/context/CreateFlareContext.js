// context/CreateFlareContext.js
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateFlareContext = createContext();

export const CreateFlareProvider = ({ children }) => {
    const [showCreateFlareOverlay, setShowCreateFlareOverlay] = useState(false);
    const [originalUrlBeforeCreateFlareOverlay, setOriginalUrlBeforeCreateFlareOverlay] = useState(null);
    const navigate = useNavigate();

    const openCreateFlareOverlay = (originalUrl) => {
        if (window.location.pathname !== '/radianspace/create-flare') {
            setOriginalUrlBeforeCreateFlareOverlay(originalUrl);
            setShowCreateFlareOverlay(true);
        }
    };

    const closeCreateFlareOverlay = () => {
        setShowCreateFlareOverlay(false);
        navigate(originalUrlBeforeCreateFlareOverlay);
    };

    return (
        <CreateFlareContext.Provider
            value={{
                showCreateFlareOverlay,
                originalUrlBeforeCreateFlareOverlay,
                openCreateFlareOverlay,
                closeCreateFlareOverlay,
            }}
        >
            {children}
        </CreateFlareContext.Provider>
    );
};

export const useCreateFlareContext = () => useContext(CreateFlareContext);
