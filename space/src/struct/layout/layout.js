// Layout.js
import React, { useState, useEffect } from 'react';
import './layout.css';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../navbar/navbar';
import Sidebar from '../sidebar/Sidebar';
import NotificationsMenu from '../navbar/notificationsMenu/notificationsMenu';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { useSelector } from 'react-redux';
import useProfile from '../../hooks/useProfile';
import { usePostContext } from '../../context/PostContext';
import { useCreateFlareContext } from '../../context/CreateFlareContext';
import { useCreatePacketContext } from '../../context/CreatePacketContext';


function Layout({ children, pageName }) {
    const navigate = useNavigate();
    const { authState } = useAuth();
    const location = useLocation();
    const { activeSubApp } = useSubApp();

    const { minimalProfileData : profileData } = useProfile();

    const { expandPostIdReciever } = usePostContext();

    const [menuOpen, setMenuOpen] = useState(false);
    const [appMenuOpen, setAppMenuOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsMenuOpen, setNotificationsMenuOpen] = useState(false);

    // const [showCreatePacketOverlay, setCreatePacketOverlay] = useState(false);

    const { showCreateFlareOverlay } = useCreateFlareContext();
    const { showCreatePacketOverlay, openCreatePacketOverlay  } = useCreatePacketContext();


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


    useEffect(() => {
        if (window.location.pathname === '/quantaspace/create-packet' && !showCreatePacketOverlay) {
            openCreatePacketOverlay();
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
                    // handleCreateFlareOverlayOpen={handleCreateFlareOverlayOpen}
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
            {notificationsMenuOpen && <NotificationsMenu />}

            {showCreatePacketOverlay && <CreatePacketOverlay  />}

            {expandPostIdReciever &&
                <ExpandPost />
            }

            {showCreateFlareOverlay &&
                <CreateFlare />
            }
        </div>
    );
}

export default Layout;
