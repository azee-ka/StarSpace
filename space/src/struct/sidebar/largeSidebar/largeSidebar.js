import React, { useState, useRef, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './largeSidebar.css';
import { useActionData, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../reducers/auth/useAuth';

const LargeSidebar = ({ showLargeSidebar, privatePagesLargeSidebar, handleSidebarClick }) => {
    const { authState } = useAuth();

    return (
        <div className={`sidebar-large-container ${showLargeSidebar ? '' : 'collapse'}`}>
            <div className='sidebar-large-container-content'>
                <ul>
                    {privatePagesLargeSidebar.map((item, index) => (
                        (item.role === authState.user.role || item.role === 'any') ? (
                            <button key={`${item.label}-${index}`} onClick={() => handleSidebarClick(item.path, item.action)}>
                                <li>
                                    <div className='sidebar-large-per-item'>
                                        {item.label}
                                    </div>
                                </li>
                            </button>
                        ) : (
                            null
                        )
                    ))}
                </ul>
            </div>
        </div>

    );
}

export default LargeSidebar;