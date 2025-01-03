import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import ProfilePicture from '../../utils/profilePicture/getProfilePicture';
import { useSubApp } from '../../context/SubAppContext';
import NineDotIcon from '../../utils/nine-dot';
import SidebarMenuIcon from './iconMenu';
import appLogo from '../../assets/logo.png';
import appLogoComplete from '../../assets/logo-comp.png';
import useNotifications from '../../hooks/useNotifications';
import { useCreateFlareContext } from '../../context/CreateFlareContext';
import { useCreatePacketContext } from '../../context/CreatePacketContext';

const Navbar = ({ 
    handleProfileMenuToggle, 
    handleAppMenuToggle, 
    handleNotificationsMenuToggle, 
    sidebarOpen, 
    setSidebarOpen, 
    profileData,
}) => {
    const { authState } = useAuth();
    const { count : notificationsCount } = useNotifications();

    const { openCreateFlareOverlay } = useCreateFlareContext();
    const { openCreatePacketOverlay } = useCreatePacketContext();

    const { activeSubApp, setActiveSubApp } = useSubApp();

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
        'RadianSpace': [
            { label: "Radian Dashboard", path: "/radianspace" },
            { label: "Radian Timeline", path: "/radianspace/timeline" },
            { label: "Radian Explore", path: "/radianspace/explore" },
            { label: "Create Flare", action: () => openCreateFlareOverlay(window.location.pathname) },
        ],
        'QuantaSpace': [
            { label: "Quanta Dashboard", path: "/quantaspace" },
            { label: "Quanta Timeline", path: "/quantaspace/timeline" },
            { label: "Quanta Explore", path: "/quantaspace/explore" },
            { label: "Create Packet", action: () => openCreatePacketOverlay(window.location.pathname) },
        ],
        'AxionSpace': [
            { label: "Axion Dashboard", path: "/axionspace" },
            { label: "Axion Timeline", path: "/axionspace/timeline" },
            { label: "Create Exchange", path: "/axionspace/create-exchange" },
            { label: "Axion Explore", path: "/axionspace/explore" },
        ],
        'Central': [
            { label: "Dashbaord", path: "/" },
            { label: "Metrics", path: "/metrics" },
            { label: 'PageViewer', path: "/page" },
            { label: 'PageCustomizer', path: "/custom" },
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
        <div className='navbar-container'>
            <div className='navbar-left'>
                <div className='navbar-icon-logo-container'>
                    {authState.isAuthenticated &&
                        <SidebarMenuIcon sidebarOpen={sidebarOpen} handleHighOrderSidebarToggle={handleHighOrderSidebarToggle} />
                    }
                    <div className='navbar-logo-container'>
                        <Link to={`/${activeSubApp?.toLowerCase()}`}>
                            <img src={appLogo} />
                            <h2 className='neon-text'>
                                4Space
                                <span>{activeSubApp !== 'null' ? activeSubApp : ''}</span>
                            </h2>
                            <img src={appLogoComplete} className='fade-image' />
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
                                    {notificationsCount > 0 && (
                                        <span className="notification-count">
                                            {notificationsCount > 9 ? '9+' : notificationsCount}
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
                                    <ProfilePicture src={profileData?.profile_image} />
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
