import React, { useState } from "react"
import './quantaSidebar.css';
import { FaBookmark, FaStream } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSubApp } from "../../../../context/SubAppContext";

const QuantaSidebar = () => {
    const navigate = useNavigate();


    const options = [
        { icon: <FaStream className='icon-style' />, label: 'Dashboard', path: '/', type: 'link' },
        { icon: <FaBookmark className='icon-style' />, label: 'Bookmarks', path: '/quantaspace', type: 'link' },
    ];

    const handleClick = (item) => {
        if (item.type === 'button') {
            if (typeof item.onClick === 'function') {
                item.onClick();
            }
        } else if (item.type === 'link') {
            navigate(item.path);
        }
    };

    return (
        <div className="quanta-sidebar">
            <ul>
                {options.map((item, index) => (
                    <div key={index} className="sidebar-item" onClick={() => handleClick(item)}>
                        <div className="sidebar-item-inner">
                            {item.icon}
                            <p>{item.label}</p>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default QuantaSidebar;