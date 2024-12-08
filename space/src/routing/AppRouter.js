import React from 'react';
import { Navigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth } from '../reducers/auth/useAuth'; // assuming your auth hook exists
import Layout from '../struct/layout/layout';

import LoginPage from '../pages/auth/Login/login';
import RegisterPage from '../pages/auth/Register/register';

import FrontPage from '../pages/frontPage/frontPage';

import Timeline from '../apps/openSpace/timeline/timeline';
import CreateExchange from '../apps/openSpace/createExchange/createExchange';

import OpenSpace from '../apps/openSpace/explore/openSpace';
import Profile from '../pages/profile/profile';
import { useSubApp } from '../context/SubAppContext';



const privateRoutes = {
    openspace: [
        { name: 'OpenSpace Dasboard', path: '/', component: OpenSpace, key: 'OpenSpaceDasboard' },
        { name: 'OpenSpace Dasboard', path: '/openspace', component: Timeline, key: 'OpenSpaceDasboard' },
        { name: 'Timeline', path: '/openspace/timeline', component: Timeline, key: 'Timeline' },
        { name: 'Create Exchange', path: '/openspace/create-exchange', component: CreateExchange, key: 'CreateExchange' },
    ],
    home: [
        { name: 'Explore', path: '/', component: OpenSpace, key: 'Timeline' },
        { name: 'Timeline', path: '/openspace/timeline', component: Timeline, key: 'Timeline' },
        { name: 'Explore', path: '/openspace/explore', component: OpenSpace, key: 'Explore' },
    ],
};

const publicRoutes = [
    { name: 'Login', path: '/login', component: LoginPage, key: 'Login' },
    { name: 'Register', path: '/register', component: RegisterPage, key: 'Register' },
    { name: 'Home', path: '/', component: FrontPage, key: 'FrontPage' },
    { name: 'Home', path: '/home', component: FrontPage, key: 'FrontPage' },
];


const AppRouter = () => {
    const { authState, isLoading } = useAuth();
    const isAuthenticated = authState.isAuthenticated;
    const { activeSubApp } = useSubApp();

    // console.log(activeSubApp);

    if (isLoading) {
        return <div>Loading...</div>;
    }



    const renderPrivateRoutes = () => {
        const currentRoutes = privateRoutes[activeSubApp] || [];
        console.log("activeSubApp" , activeSubApp)
        console.log("Current Routes:", currentRoutes);
         return currentRoutes.map((route, index) => {
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
                        // showSidebar={route.showSidebar}
                    >
                        <Component />
                    </Layout>
                }
            />
        );
    });
};

    return (
        <Router>
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
                                        <Component />
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
        </Router>
    );
};

export default AppRouter;
