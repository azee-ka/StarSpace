import React from 'react';
import { Link } from 'react-router-dom';
import './appMenu.css';
import { FaCog, FaServer, FaUser, FaTasks, FaStream, FaImages, FaPlay, FaChartLine, FaDashcube, FaChartBar } from 'react-icons/fa'; // Example icons
import { faStream } from '@fortawesome/free-solid-svg-icons';

const appsData = [
    { path: '/timeline', label: 'Timeline', icon: <FaStream /> },
    { path: '/timeflow', label: 'TimeFlow', icon: <FaStream /> },
    { path: '/taskflow', label: 'Tasks', icon: <FaTasks /> },
    { path: '/photos', label: 'Photos', icon: <FaImages /> },
    { path: '/spectra', label: 'Spectra', icon: <FaPlay /> },
    { path: '/stocks', label: 'Stocks', icon: <FaChartLine /> },
    { path: '/mechflow', label: 'MechFlow', icon: <FaChartBar /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
    { path: '/profile', label: 'Profile', icon: <FaCog /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
];

const AppMenu = () => {
    return (
        <div className='app-menu' onClick={(e) => e.stopPropagation()}>
            <div className='app-menu-inner'>
                <div className='apps-grid'>
                    {appsData.map((app, index) => (
                        <div key={index} className='app-item'>
                            <Link to={app.path}>
                                <div className='app-icon'>{app.icon}</div>
                                <div className='app-label'>{app.label}</div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AppMenu;
