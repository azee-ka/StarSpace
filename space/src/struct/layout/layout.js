// Layout.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './layout.css';
import getConfig from '../../config';
import { useAuth } from '../../reducers/auth/useAuth';
import API_BASE_URL from '../../apiUrl';
import Navbar from '../navbar/navbar';
import Sidebar from '../sidebar/Sidebar';
import NotificationsMenu from '../navbar/notificationsMenu/notificationsMenu';
import { unstable_useBlocker, useLocation, useNavigate } from 'react-router-dom';
import ProfileMenu from '../navbar/profileMenu/profileMenu';
import AppMenu from '../navbar/appMenu/appMenu';
import useApi from '../../utils/useApi';
import { useSubApp } from '../../context/SubAppContext';


function Layout({ children, pageName }) {
    const navigate = useNavigate();
    const { authState } = useAuth();
    const location = useLocation();
    const { callApi } = useApi();
    const { activeSubApp, setActiveSubApp } = useSubApp();
    const [menuOpen, setMenuOpen] = useState(false);
    const [appMenuOpen, setAppMenuOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsMenuOpen, setNotificationsMenuOpen] = useState(false);

    const [notificationsList, setNotificationsList] = useState([]);
    const [countNotifications, setCountNotifications] = useState(0);

    const [profileData, setProfileData] = useState();


    useEffect(() => {
            if (window.location.pathname.includes('openspace')) {
                setActiveSubApp('openspace');
            } else if (window.location.pathname.includes('home')) {
                setActiveSubApp('home');
            }
        }, [window.location.pathname, activeSubApp, setActiveSubApp, navigate]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await callApi(`profile/get-user-info/`);
                console.log(response.data);
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        if (authState.isAuthenticated) {
            fetchProfileData();
        }

    }, [authState.isAuthenticated, setProfileData]);

    const fetchNotifications = async () => {
        try {
            const response = await callApi(`get-notifications/`);
            setNotificationsList(response.data);
            setCountNotifications(response.data.length);
            // console.log(response.data);

        } catch (error) {
            // console.error('Error fetching notifications:', error);
        }
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    const handleProfileMenuToggle = () => {
        setMenuOpen(!menuOpen);
        if (appMenuOpen || notificationsMenuOpen) {
            setAppMenuOpen(false);
            setNotificationsMenuOpen(false);
        }
    };

    const handleAppMenuToggle = () => {
        setAppMenuOpen(!appMenuOpen);
        if (menuOpen || notificationsMenuOpen) {
            setMenuOpen(false);
            setNotificationsMenuOpen(false);
        }
    };

    const handleNotificationsMenuToggle = () => {
        setNotificationsMenuOpen(!notificationsMenuOpen);
        if (menuOpen || appMenuOpen) {
            setMenuOpen(false);
            setAppMenuOpen(false);
        }
    };

    const handleCloseOverlays = () => {
        setSidebarOpen(false);
        setMenuOpen(false);
        setAppMenuOpen(false);
        setNotificationsMenuOpen(false);
    };

    useEffect(() => {
        handleCloseOverlays();
    }, [location]);

    return (
        <div className={`parent-layout`} onClick={() => handleCloseOverlays()}>
            {/* <div className='layout'> */}
            <div className='layout-navbar'>
                <Navbar
                    handleProfileMenuToggle={handleProfileMenuToggle}
                    handleAppMenuToggle={handleAppMenuToggle}
                    handleNotificationsMenuToggle={handleNotificationsMenuToggle}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    profileData={profileData}
                />
            </div>
            <div className='layout-page'>
                {/* <div className='layout-page-content'> */}
                {children}
                {/* </div> */}
                {/* Footer */}
                {/* <footer className="footer">
                    <p>© {new Date().getFullYear()} 4Space. All Copyrights Reserved.</p>
                </footer> */}
            </div>
            {authState.isAuthenticated && <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />}
            {menuOpen && <ProfileMenu profileData={profileData} />}
            {appMenuOpen && <AppMenu />}
            {notificationsMenuOpen && <NotificationsMenu notificationsList={notificationsList} setNotificationCount={setCountNotifications} fetchNotifications={fetchNotifications} />}

            {/* </div> */}
        </div>
    );
}

export default Layout;
