import React, { useEffect, useState } from 'react';
import { Navigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // assuming your auth hook exists
import Layout from '../struct/layout/layout';

import LoginPage from '../pages/auth/Login/login';
import RegisterPage from '../pages/auth/Register/register';

import FrontPage from '../pages/frontPage/frontpage';

import Timeline from '../apps/axionSpace/timeline/timeline';
import CreateExchange from '../apps/axionSpace/createExchange/createExchange';
import ExchangePage from '../apps/axionSpace/exchange/exchange';

import OpenSpace from '../apps/axionSpace/explore/explore';
import Profile from '../pages/profile/profile';
import { useSubApp } from '../context/SubAppContext';
import Entry from '../apps/axionSpace/entry/entry';
import Settings from '../pages/settings/settings';
import MyProfile from '../pages/profile/myProfile/myProfile';
import PageViewer from '../pages/config/pageViewer/pageViewer';
import PageEditor from '../pages/config/pageEditor/pageEditor';
import PageManager from '../pages/config/pageManager/pageManager';
import CreatePacketOverlay from '../apps/quantaSpace/createPacket/createPacket';
import QunataTimeline from '../apps/quantaSpace/timeline/timeline';
import QunataExplore from '../apps/quantaSpace/explore/explore';
import RadianExplore from '../apps/radianSpace/explore/explore';
import RadianTimeline from '../apps/radianSpace/timeline/timeline';
import AxionTimeline from '../apps/axionSpace/timeline/timeline';
import AxionExplore from '../apps/axionSpace/explore/explore';
import AxionDashboard from '../apps/axionSpace/dashboard/dashboard';
import QuantaDashboard from '../apps/quantaSpace/dashboard/dashboard';
import RadianDashboard from '../apps/radianSpace/dashboard/dashboard';
import Packet from '../apps/quantaSpace/packet/packet';
import CreateFlare from '../apps/radianSpace/createFlare/createPost';
import ExpandPost from '../apps/radianSpace/postUI/expandPost/expandPost';
import { PostProvider } from '../context/PostContext';


const AppRouter = () => {
    const { authState, isLoading } = useAuth();
    const isAuthenticated = authState.isAuthenticated;
    const { activeSubApp, setActiveSubApp } = useSubApp()

    // const [expandPostIdReciever, setExpandPostIdReciever] = useState();

    // const [currentExpandPostIndex, setCurrentExpandPostIndex] = useState();

    // const [expandPostOnCloseUrl, setExpandPostOnCloseUrl] = useState();

    // const [postsList, setPostsList] = useState([]);

    // const [showPreviousPostButton, setShowPreviousPostButton] = useState(true)
    // const [showNextPostButton, setShowNextPostButton] = useState(true);

    // const handleExpandPostOpen = (postIdToExpand, posts, originalPreviousUrl, index) => {
    //     console.log('posts', posts, index);
    //     setExpandPostIdReciever(postIdToExpand);
    //     setShowPreviousPostButton(index > 0);
    //     setShowNextPostButton(index < posts.length - 1);
    //     setCurrentExpandPostIndex(index);
    //     setPostsList(posts);
    //     setExpandPostOnCloseUrl(originalPreviousUrl);
    //     window.history.replaceState(null, null, `/radianspace/flare/${postIdToExpand}`);
    // };
    // const handlePreviousPostClick = () => {
    //     if (currentExpandPostIndex > 0) {
    //         const newIndex = currentExpandPostIndex - 1;
    //         handleExpandPostOpen(postsList[newIndex].uuid, postsList, expandPostOnCloseUrl, newIndex);
    //         setCurrentExpandPostIndex(newIndex);
    //     } else {
    //         setShowPreviousPostButton(false)
    //     }
    // }
    // const handleNextPostClick = () => {
    //     if (currentExpandPostIndex < postsList.length - 1) {
    //         const newIndex = currentExpandPostIndex + 1;
    //         handleExpandPostOpen(postsList[newIndex].uuid, postsList, expandPostOnCloseUrl, newIndex);
    //         setCurrentExpandPostIndex(newIndex);
    //     } else {
    //         setShowNextPostButton(false);
    //     }
    // }






    useEffect(() => {
        if (window.location.pathname.includes('openspace')) {
            setActiveSubApp('openspace');
        } else if (window.location.pathname.includes('home')) {
            setActiveSubApp('home');
        }
    }, [window.location.pathname, activeSubApp, setActiveSubApp]);

    const privateRoutes = {
        AxionSpace: [
            { name: 'AxionSpace Dasboard', path: '/', component: <AxionDashboard />, key: 'AxionDashboard' },
            { name: 'AxionSpace Dasboard', path: '/axionspace', component: <AxionDashboard />, key: 'AxionDashboard' },
            { name: 'AxionSpace Explore', path: '/axionspace/timeline', component: <AxionExplore />, key: 'AxionExplore' },
            { name: 'Create Exchange', path: '/axionspace/create-exchange', component: <CreateExchange />, key: 'CreateExchange' },
            { name: 'Exchange', path: '/axionspace/exchange/:exchangeId', component: <ExchangePage />, key: 'ExchangePage' },
            { name: 'Entry', path: '/axionspace/entry/:entryId', component: <Entry />, key: 'EntryPage' },
        ],
        QuantaSpace: [
            { name: 'QuantaSpace Dasboard', path: '/', component: <QuantaDashboard />, key: 'QuantaDashboard' },
            { name: 'QuantaSpace Dasboard', path: '/quantaspace', component: <QuantaDashboard />, key: 'QuantaDashboard' },
            { name: 'QuantaSpace Timeline', path: '/quantaspace/timeline', component: <QunataTimeline />, key: 'QuantaTimeline' },
            { name: 'QuantaSpace Explore', path: '/quantaspace/explore', component: <QunataExplore />, key: 'QuantaExplore' },
            { name: 'Create Packet', path: '/quantaspace/create-packet', component: <QunataTimeline />, key: 'CreatePacket' },
            { name: 'QuantaSpace Packet', path: '/quantaspace/packet/:packetId', component: <Packet />, key: 'QuantaPacket' },
        ],
        RadianSpace: [
            { name: 'RadianSpace Dasboard', path: '/', component: <RadianDashboard />, key: 'RadianDashboard' },
            { name: 'RadianSpace Dasboard', path: '/radianspace', component: <RadianDashboard />, key: 'RadianDashboard' },
            { name: 'RadianSpace Timeline', path: '/radianspace/timeline', component: <RadianTimeline /*handleExpandPostOpen={handleExpandPostOpen}*/ />, key: 'RadianTimeline' },
            { name: 'RadianSpace Explore', path: '/radianspace/explore', component: <RadianExplore /*handleExpandPostOpen={handleExpandPostOpen}*/ />, key: 'RadianExplore' },
            { name: 'Create Flare', path: '/radianspace/create-flare', component: <CreateFlare />, key: 'CreateFlare' },
            { name: 'Expand Flare', path: '/radianspace/flare/:postId', component: <ExpandPost />, key: 'ExpandFlare' },
        ],
        Central: [

            { name: 'PageViewer', path: '/page', component: <PageViewer />, key: 'PageViewer' },
            { name: 'PageCustom', path: '/custom', component: <PageManager />, key: 'PageCustomizer' },
        ],
        Universal: [
            { name: 'Profile', path: '/profile/:username', component: <Profile />, key: 'Profile' },
            { name: 'My Profile', path: '/profile', component: <Profile />, key: 'MyProfile' },
            { name: 'Settings', path: '/settings', component: <Settings />, key: 'Settings' },
        ],
    };

    const publicRoutes = [
        { name: 'Login', path: '/login', component: <LoginPage />, key: 'Login' },
        { name: 'Register', path: '/register', component: <RegisterPage />, key: 'Register' },
        { name: 'Home', path: '/', component: <FrontPage />, key: 'FrontPage' },
        { name: 'Home', path: '/home', component: <FrontPage />, key: 'FrontPage' },
    ];


    if (isLoading) {
        return <div>Loading...</div>;
    }

    const renderPrivateRoutes = () => {
        const currentRoutes = privateRoutes[activeSubApp] || [];
        // const allRoutes = [...currentRoutes, ...privateRoutes['Universal']];
        const allRoutes = [
            ...privateRoutes['AxionSpace'],
            ...privateRoutes['QuantaSpace'],
            ...privateRoutes['RadianSpace'],
            // ...privateRoutes['Central'],
            ...privateRoutes['Universal'],
        ];

        return allRoutes.map((route, index) => {
            const Component = route.component;
            return (
                <Route
                    key={`${index}-${route.path}`}
                    path={route.path}
                    element={
                        <Layout
                            key={`${index}-${route.path}`}
                            className={route.path.substring(1)}
                            pageName={route.pageName}
                            // expandPostOnCloseUrl={expandPostOnCloseUrl}
                            // expandPostIdReciever={expandPostIdReciever}
                            // setExpandPostIdReciever={setExpandPostIdReciever}
                            // handlePreviousPostClick={handlePreviousPostClick}
                            // handleNextPostClick={handleNextPostClick}
                            // showPreviousPostButton={showPreviousPostButton}
                            // showNextPostButton={showNextPostButton}
                        >
                            {Component}
                        </Layout>
                    }
                />
            );
        });
    };

    return (
        <Router>
        <PostProvider>
            <React.Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {/* Public Routes (Accessible by everyone) */}
                    {!isAuthenticated && publicRoutes.map((route, index) => {
                        const Component = route.component;
                        return (
                            <Route
                                key={`${index}-${route.path}`}
                                path={route.path}
                                element={
                                    <Layout
                                        key={`${index}-${route.path}`}
                                        className={`${route.path.substring(1)}`}
                                        pageName={route.pageName}
                                    >
                                        {Component}
                                    </Layout>
                                }
                            />
                        );
                    })}

                    {/* Private Routes (Accessible only by authenticated users) */}
                    {isAuthenticated && renderPrivateRoutes()}


                    {/* If not authenticated, redirect to login page */}
                    {!isAuthenticated && (
                        <Route path="/*" element={<Navigate to="/login" />} />
                    )}

                    {/* If authenticated, allow access to private routes */}
                    {isAuthenticated && (
                        <Route path="/*" element={<Navigate to="/" />} />
                    )}
                </Routes>
            </React.Suspense>
            </PostProvider>
        </Router>
    );
};

export default AppRouter;
