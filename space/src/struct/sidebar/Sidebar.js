import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCog, faStream, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { useSubApp } from '../../context/SubAppContext';
// import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { activeSubApp, setActiveSubApp } = useSubApp();


    const taskFlow = [
        { icon: <FontAwesomeIcon icon={faStream} />, label: 'Central', path: '/', type: 'context' },
        { icon: <FontAwesomeIcon icon={faStream} />, label: 'OpenSpace', path: '/openspace', type: 'context' },
        { icon: <FontAwesomeIcon icon={faLayerGroup} />, label: 'ProSpace', path: '/prospace', type: 'context' },
        { icon: <FontAwesomeIcon icon={faCog} />, label: 'Impact Space', path: '/impactspace', type: 'context' },
    ];

    const [options] = useState(taskFlow);

    const handleClick = (item) => {
        if (item.type === 'button') {
            if (typeof item.onClick === 'function') {
                item.onClick();
            }
        } else if (item.type === 'link') {
            navigate(item.path);
        } else if (item.type === 'context') {
            setActiveSubApp(item.label.toLowerCase() === 'central' ? 'home' : item.label.toLowerCase());
            navigate(item.path);
        }
        onClose();
    };

    return (
        <div className={`sidebar-container ${isOpen ? '' : 'close'}`} onClick={(e) => e.stopPropagation()}>
            <div className='sidebar-container-content'>
                <div className='sidebar-container-content-inner'>
                    <div className='sidebar-menu'>
                        {options.map((option, index) => (
                            <li 
                            key={`${index}-${option.label}`} 
                            className='sidebar-menu-item'
                            onClick={() => handleClick(option)}
                            >
                                <div className='sidebar-menu-icon'>
                                    {option.icon}
                                </div>
                                <div>
                                    {option.type === 'link' ? (
                                        <Link to={option.path} className='sidebar-menu-link' onClick={(e) => e.stopPropagation()}>
                                            {option.label}
                                        </Link>
                                    ) : (
                                        <button className='sidebar-menu-button'>
                                            {option.label}
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
