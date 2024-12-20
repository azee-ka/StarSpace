import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../../reducers/auth/useAuth';
import API_BASE_URL from '../../apiUrl';
import axios from 'axios';
// import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faEdit, faPlus, faCompass, faCalculator, faTachometerAlt, faChartLine, faBell } from '@fortawesome/free-solid-svg-icons';
import ProfilePicture from '../../utils/profilePicture/getProfilePicture';
import ProfileMenu from './profileMenu/profileMenu';
import NotificationsMenu from './notificationsMenu/notificationsMenu';
import getConfig from '../../config';
import { useSubApp } from '../../context/SubAppContext';
import NineDotIcon from '../../utils/nine-dot';
import AppMenu from './appMenu/appMenu';
import SidebarMenuIcon from './iconMenu';
import appLogo from '../../assets/logo.png';

const Navbar = ({ handleProfileMenuToggle, handleAppMenuToggle, handleNotificationsMenuToggle, sidebarOpen, setSidebarOpen, notificationCount }) => {
    const { authState, logout } = useAuth();
    const config = getConfig(authState);

    const { activeSubApp, setActiveSubApp } = useSubApp();

    const [profileData, setProfileData] = useState();

    const [profileMenuVisible, setProfileMenuVisible] = useState(false);

    const [notificationsMenuVisible, setNotificationsMenuVisible] = useState(false);

    const [appMenuVisible, setAppMenuVisible] = useState(false)

    const location = useLocation();
    const navigate = useNavigate();

    const profileMenuRef = useRef(null);
    const notificationsMenuRef = useRef(null);
    const appMenuRef = useRef(null);


    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setProfileMenuVisible(false);
            }
            if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target)) {
                setNotificationsMenuVisible(false);
            }
            if (appMenuRef.current && !appMenuRef.current.contains(event.target)) {
                setAppMenuVisible(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);


    const publicPagesNavbar = [
        { path: '/home', label: 'Home', id: 'navbar-phrase', role: 'public' },
        { path: '/login', label: 'Sign In', id: 'navbar-access', role: 'public' },
    ];

    const privatePagesNavbar = {
        openspace: [
            { label: "Dashboard", path: "/openspace" },
            { label: "Timeline", path: "/openspace/timeline" },
            { label: "Create Exchange", path: "/openspace/create-exchange" },
            { label: "Explore", path: "/openspace/explore" },
        ],
        home: [
            { label: "Dashbaord", path: "/" },
            { label: "Metrics", path: "/metrics" },
        ],
    };

    const handleMenuClick = (path, action) => {
        if (action) {
            action();
        } else {
            navigate(path);
        }
    };

    const handleHighOrderSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const pagesNavbar = authState.isAuthenticated ? privatePagesNavbar : publicPagesNavbar;

    return (
        <div className='navbar-conatiner neon-background'>
            <div className='navbar-left'>
                <div className='navbar-icon-logo-container'>
                    {authState.isAuthenticated &&
                        <SidebarMenuIcon sidebarOpen={sidebarOpen} handleHighOrderSidebarToggle={handleHighOrderSidebarToggle} />
                    }
                    <div className='navbar-logo-container'>
                        <Link to={`/${activeSubApp === 'home' ? '' : activeSubApp.toLowerCase()}`}>
                            <img src={appLogo} />
                            <h2 className='neon-text'>4Space<span></span></h2>
                        </Link>
                    </div>
                </div>
            </div>
            <div className='navbar-right'>
                <div className='navbar-pages'>
                    <ul>
                        {pagesNavbar && pagesNavbar[activeSubApp]?.map((item, index) => (
                            <li
                                key={index}
                                className={location.pathname === item.path ? 'active' : ''}
                                id={item.id}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Link to={item.path} onClick={() => handleMenuClick(item.path, item.action)}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='navbar-items'>
                {!authState.isAuthenticated && (
                    <div className='navbar-public-btns'>
                        <div className='navbar-login-btn'>
                            <Link to={'/login'}>Sign In</Link>
                        </div>
                        <div className='navbar-register-btn'>
                            <Link to={'/register'}>Sign Up</Link>
                        </div>
                    </div>
                )}

                    {authState.isAuthenticated && (
                        <ul>
                            {/* Notifications Menu */}
                            <li
                                className={`notifications-menu ${notificationsMenuVisible ? 'active' : ''}`}
                                ref={notificationsMenuRef}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button onClick={handleNotificationsMenuToggle} className="notification-button">
                                    <FontAwesomeIcon icon={faBell} /> {/* Replace text with the bell icon */}
                                    {notificationCount > 0 && (
                                        <span className="notification-count">
                                            {notificationCount > 9 ? '9+' : notificationCount}
                                        </span>
                                    )}
                                </button>
                            </li>

                            {/* App Menu */}
                            <li className="navigation-bar-menubar-icon" ref={appMenuRef} onClick={(e) => e.stopPropagation()}>
                                <button onClick={handleAppMenuToggle}>
                                    <NineDotIcon style={{ color: 'white', background: 'transparent', fontSize: '24px' }} />
                                </button>
                            </li>

                            {/* Profile Menu */}
                            <li
                                className={`profile-menu ${profileMenuVisible ? 'active' : ''}`}
                                ref={profileMenuRef}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button onClick={handleProfileMenuToggle}>
                                    <ProfilePicture src={profileData} />
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
