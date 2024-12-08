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
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileMenu from '../navbar/profileMenu/profileMenu';
import AppMenu from '../navbar/appMenu/appMenu';


function Layout({ children, pageName }) {
    const { authState } = useAuth();
    const config = getConfig(authState);
    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [appMenuOpen, setAppMenuOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsMenuOpen, setNotificationsMenuOpen] = useState(false);

    const [notificationsList, setNotificationsList] = useState([]);
    const [countNotifications, setCountNotifications] = useState(0);


    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}get-notifications/`, config);
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
            <div className='layout'>
                <div className='layout-navbar'>
                    <Navbar
                        handleProfileMenuToggle={handleProfileMenuToggle}
                        handleAppMenuToggle={handleAppMenuToggle}
                        handleNotificationsMenuToggle={handleNotificationsMenuToggle}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                </div>
                <div className='layout-page'>
                    <div className='layout-page-content'>
                        {children}
                    </div>
                </div>
                {authState.isAuthenticated && <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />}
                {menuOpen && <ProfileMenu />}
                {appMenuOpen && <AppMenu />}
                {notificationsMenuOpen && <NotificationsMenu notificationsList={notificationsList} setNotificationCount={setCountNotifications} fetchNotifications={fetchNotifications} />}
            </div>
        </div>
    );
}

export default Layout;
