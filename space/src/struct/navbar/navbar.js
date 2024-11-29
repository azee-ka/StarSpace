import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../../reducers/auth/useAuth';
import API_BASE_URL from '../../config';
import axios from 'axios';
// import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faEdit, faPlus, faCompass, faCalculator, faTachometerAlt, faChartLine, faBell } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const { authState, logout, isAuthenticated } = useAuth();

    const [profileData, setProfileData] = useState();

    const [profileMenuVisible, setProfileMenuVisible] = useState(false);

    const [notificationsMenuVisible, setNotificationsMenuVisible] = useState(false);
    const [notificationsList, setNotificationsList] = useState([]);
    const [countNotifications, setCountNotifications] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();
    const profileMenuRef = useRef(null);
    const notificationsMenuRef = useRef(null);

    const fetchProfileData = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${authState.token}`
            }
        };
        try {
            const response = await axios.get(`${API_BASE_URL}profile/get-user-info/`, config);
            // console.log(response.data);
            setProfileData(response.data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const fetchNotifications = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${authState.token}`
            }
        };
        try {
            const response = await axios.get(`${API_BASE_URL}get-notifications/`, config);
            setNotificationsList(response.data);
            setCountNotifications(response.data.length);
            // console.log(response.data);

        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };
    useEffect(() => {
        if (authState.isAuthenticated) {
            fetchProfileData();
            fetchNotifications();
        }
    }, []);


    const handleProfileMenuToggle = () => {
        setProfileMenuVisible(!profileMenuVisible);
        setNotificationsMenuVisible(false);
    };
    const handleNotificationsMenuToggle = () => {
        setNotificationsMenuVisible(!notificationsMenuVisible);
        setProfileMenuVisible(false);
    };


    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setProfileMenuVisible(false);
            }
            if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target)) {
                setNotificationsMenuVisible(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);


    const publicPagesNavbar = [
        { path: '/', label: 'Home', id: 'navbar-phrase', role: 'public' },
        { path: '/login', label: 'Sign In', id: 'navbar-access', role: 'public' },
    ];

    const privatePagesNavbar = [
        { path: '/timeline', label: 'Timeline', id: 'navbar-phrase', role: 'private' },
    ];

    const handleMenuClick = (path, action) => {
        if (action) {
            action();
        } else {
            navigate(path);
        }
    };

    const [showHighOrderSidebar, setShowHighOrderSidebar] = useState(false);

    const handleHighOrderSidebarToggle = () => {
        setShowHighOrderSidebar(!showHighOrderSidebar);
    };

    const pagesNavbar = authState.isAuthenticated ? privatePagesNavbar : publicPagesNavbar;

    return (
        <div className={`site-navbar`}>
            <div className='navbar-container'>
                <div className='navbar-inner'>
                    <div className='navbar-menu-logo-container'>
                        {isAuthenticated &&
                            <div className={`navbar-sidebar-menu-toggle`}>
                            <div className={`navbar-sidebar-menu-toggle-inner ${showHighOrderSidebar ? 'sidebar-visible' : ''}`}>
                                <div className='navbar-sidebar-menu-toggle-inner-content'>
                                    <button onClick={handleHighOrderSidebarToggle}>
                                        <span className={`icon-bar ${showHighOrderSidebar ? 'rotate' : ''}`}></span>
                                        <span className={`icon-bar ${showHighOrderSidebar ? 'rotate' : ''}`}></span>
                                        <span className={`icon-bar ${showHighOrderSidebar ? 'rotate' : ''}`}></span>
                                    </button>
                                </div>
                            </div>
                        </div>}
                        <div className={`app-logo`}>
                            <Link to={'/'}>
                                <h2>4Space</h2>
                            </Link>
                        </div>
                    </div>

                    <nav className={`top-nav`}>
                        <div className='menu-items-containter'>
                            <div className='right-side-menu-items'>
                                <ul className="right-menu">
                                    {pagesNavbar && pagesNavbar.map((item, index) => (
                                            <li
                                                key={index}
                                                className={location.pathname === item.path ? 'active' : ''}
                                                id={item.id}
                                            >
                                                <Link to={item.path} onClick={() => handleMenuClick(item.path, item.action)}>
                                                    {item.label}
                                                </Link>
                                            </li>
                                    ))}

                                    {/* Notifications Menu */}
                                    {authState.isAuthenticated && (
                                        <li
                                            className={`notifications-menu ${notificationsMenuVisible ? 'active' : ''}`}
                                            ref={notificationsMenuRef}
                                        >
                                            <button onClick={handleNotificationsMenuToggle} className="notification-button">
                                                <FontAwesomeIcon icon={faBell} /> {/* Replace text with the bell icon */}
                                                {notificationsList.length > 0 && (
                                                    <span className="notification-count">
                                                        {notificationsList.length > 9 ? '9+' : notificationsList.length}
                                                    </span>
                                                )}
                                            </button>
                                            {/* {notificationsMenuVisible && <NotificationsMenu notificationsList={notificationsList} setCountNotifications={setCountNotifications} fetchNotifications={fetchNotifications} />} */}
                                        </li>
                                    )}

                                    {/* Profile Menu */}
                                    {authState.isAuthenticated && (
                                        <li
                                            className={`profile-menu ${profileMenuVisible ? 'active' : ''}`}
                                            ref={profileMenuRef}
                                        >
                                            <button onClick={handleProfileMenuToggle}>
                                                {/* <ProfilePicture src={profileData} /> */}
                                            </button>
                                            {/* {profileMenuVisible && <ProfileMenu user={authState.user} logout={logout} />} */}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
