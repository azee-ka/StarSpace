// context/CreatePacketContext.js
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePacketContext = createContext();

export const CreatePacketProvider = ({ children }) => {
    const [showCreatePacketOverlay, setShowCreatePacketOverlay] = useState(false);
    const [originalUrlBeforeCreatePacketOverlay, setOriginalUrlBeforeCreatePacketOverlay] = useState(null);
    const navigate = useNavigate();

    const openCreatePacketOverlay = (originalPreviousUrl) => {
            setOriginalUrlBeforeCreatePacketOverlay(originalPreviousUrl);
            setShowCreatePacketOverlay(true);
    };

    const closeCreatePacketOverlay = () => {
        setShowCreatePacketOverlay(false);
        if(originalUrlBeforeCreatePacketOverlay) {
            navigate(originalUrlBeforeCreatePacketOverlay);
        } else {
            navigate('/')
        }
    };

    return (
        <CreatePacketContext.Provider
            value={{
                showCreatePacketOverlay,
                originalUrlBeforeCreatePacketOverlay,
                openCreatePacketOverlay,
                closeCreatePacketOverlay,
            }}
        >
            {children}
        </CreatePacketContext.Provider>
    );
};

export const useCreatePacketContext = () => useContext(CreatePacketContext);
