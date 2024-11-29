import React from 'react';
import { Navigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth } from '../reducers/auth/useAuth'; // assuming your auth hook exists
import Layout from '../struct/layout/layout';

import LoginPage from '../pages/auth/Login/login';
import RegisterPage from '../pages/auth/Register/register';

import FrontPage from '../pages/frontPage/frontPage';

import Timeline from '../pages/timeline/timeline';

const privateRoutes = [
    { name: 'Timeline', path: '/', component: Timeline, key: 'Timeline' },
    { name: 'Timeline', path: '/timeline', component: Timeline, key: 'Timeline' },
];

const publicRoutes = [
    { name: 'Login', path: '/login', component: LoginPage, key: 'Login' },
    { name: 'Register', path: '/register', component: RegisterPage, key: 'Register' },
    { name: 'Home', path: '/', component: FrontPage, key: 'FrontPage' },
    { name: 'Home', path: '/home', component: FrontPage, key: 'FrontPage' },
];

const AppRouter = () => {
    const { authState, isLoading } = useAuth();
    const isAuthenticated = authState.isAuthenticated;

    if (isLoading) {
        return <div>Loading...</div>;
    }

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
                                        showSidebar={route.showSidebar}
                                    >
                                        <Component />
                                    </Layout>
                                }
                            />
                        );
                    })}

                    {/* Private Routes (Accessible only by authenticated users) */}
                    {isAuthenticated && privateRoutes.map((route, index) => {
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
                                        showSidebar={route.showSidebar}
                                    >
                                        <Component />
                                    </Layout>
                                }
                            />
                        );
                    })}

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
