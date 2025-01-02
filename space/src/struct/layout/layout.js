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
import CentralLayout from '../../apps/central/centralLayout/centralLayout';
import QuantaLayout from '../../apps/quantaSpace/quantaLayout/quantaLayout';
import AxionLayout from '../../apps/axionSpace/axionLayout/axionLayout';
import RadianLayout from '../../apps/radianSpace/radianLayout/radianLayout';
import CreatePacketOverlay from '../../apps/quantaSpace/createPacket/createPacket';
import ExpandPost from '../../apps/radianSpace/postUI/expandPost/expandPost';
import CreateFlare from '../../apps/radianSpace/createFlare/createPost';


function Layout({ children, pageName,
    expandPostIdReciever, 
    handlePreviousPostClick, 
    handleNextPostClick, 
    showPreviousPostButton, 
    showNextPostButton,
    setExpandPostIdReciever,
    expandPostOnCloseUrl,
 }) {
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

    const [showCreatePacketOverlay, setCreatePacketOverlay] = useState(false);

    const [profileData, setProfileData] = useState();


    const [showCreateFlareOverlay, setShowCreateFlareOverlay] = useState(false);
    const [originalUrlBeforeCreateFlareOverlay, setOriginalUrlBeforeCreateFlareOverlay] = useState(null);

    const handleCreateFlareOverlayOpen = () => {
        if (window.location.pathname !== '/radianspace/create-flare') {
            setOriginalUrlBeforeCreateFlareOverlay(window.location.pathname);
            setShowCreateFlareOverlay(true);
        }
    };

    const handleCreateFlareOverlayClose = () => {
        setShowCreateFlareOverlay(false);
        navigate(originalUrlBeforeCreateFlareOverlay);
    }

    const handleExpandPostClose = () => {
        // e.stopPropagation();
        setExpandPostIdReciever(null);

        navigate(expandPostOnCloseUrl);
    };

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

    const handleCloseCreatePacketOverlay = () => {
        setCreatePacketOverlay(false);
        navigate(`/`);
    }

    useEffect(() => {
        handleCloseOverlays();
    }, [location]);


    useEffect(() => {
        if (window.location.pathname === '/quantaspace/create-packet') {
            setCreatePacketOverlay(true);
        }
    }, [])

    const layoutDict = {
        // Central: {
        //     component: CentralLayout,
        //     props: {}
        // },
        QuantaSpace: {
            component: QuantaLayout,
            props: {},
        },
        // AxionSpace: {
        //     component: AxionLayout,
        //     props: {}
        // },
        RadianSpace: {
            component: RadianLayout,
            props: {}
        },
    };

    // Get the correct layout component
    const ActiveLayoutConfig = layoutDict[activeSubApp] || null;

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
                    setCreatePacketOverlay={setCreatePacketOverlay}
                    handleCreateFlareOverlayOpen={handleCreateFlareOverlayOpen}
                />
            </div>
            <div className='layout-page'>
                {authState?.isAuthenticated ? (
                    ActiveLayoutConfig ? (
                        <ActiveLayoutConfig.component {...ActiveLayoutConfig.props}>
                            {children}
                        </ActiveLayoutConfig.component>
                    ) : (
                        children
                    )
                ) : (
                    children
                )}

                {/* Footer */}
                {/* <footer className="footer">
                    <p>© {new Date().getFullYear()} 4Space. All Copyrights Reserved.</p>
                </footer> */}
            </div>
            {authState.isAuthenticated && <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />}
            {menuOpen && <ProfileMenu profileData={profileData} />}
            {appMenuOpen && <AppMenu />}
            {notificationsMenuOpen && <NotificationsMenu notificationsList={notificationsList} setNotificationCount={setCountNotifications} fetchNotifications={fetchNotifications} />}

            {showCreatePacketOverlay && <CreatePacketOverlay onClose={handleCloseCreatePacketOverlay} />}

            {expandPostIdReciever !== undefined && expandPostIdReciever !== null &&
                <ExpandPost
                    overlayPostId={expandPostIdReciever}
                    handleExpandPostClose={handleExpandPostClose} 
                    handlePreviousPostClick={handlePreviousPostClick} 
                    handleNextPostClick={handleNextPostClick} 
                    showPreviousPostButton={showPreviousPostButton}
                    showNextPostButton={showNextPostButton}
                />
            }

            {showCreateFlareOverlay &&
                <CreateFlare originalUrl={originalUrlBeforeCreateFlareOverlay} handleCreateFlareOverlayClose={handleCreateFlareOverlayClose} />
            }
        </div>
    );
}

export default Layout;
