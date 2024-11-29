import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './smallSidebar.css';
import { useAuth } from '../../../reducers/auth/useAuth';

const SmallSidebar = ({ showSeachSidebar, privatePagesSmallSidebar, handleSidebarClick }) => {
    const { authState } = useAuth();

    return (
        <div className={`sidebar-small-container`}>
            <div className='sidebar-small-container-content'>
                <ul>
                    {privatePagesSmallSidebar.map((item, index) => (
                        (item.role === authState.user.role || item.role === 'any') ? (
                            <button className={`sidebar-small-container-content-button ${showSeachSidebar ? 'active' : ''}`} to={item.path} key={`${item.label}-${index}`} onClick={() => handleSidebarClick(item.path, item.action)}>
                                <li>
                                    <div className='sidebar-small-per-item'>
                                        {item.icon}
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

export default SmallSidebar;
