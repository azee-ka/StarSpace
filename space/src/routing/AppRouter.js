import React, { useEffect } from 'react';
import { Navigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth } from '../reducers/auth/useAuth'; // assuming your auth hook exists
import Layout from '../struct/layout/layout';

const LoginPage = React.lazy(() => import('../pages/auth/Login/login'));
const RegisterPage = React.lazy(() => import('../pages/auth/Register/register'));
const Timeline = React.lazy(() => import('../pages/timeline/timeline'));

const privateRoutes = [
    { name: 'Timeline', path: '/', component: Timeline, key: 'Timeline', showSidebar: true },
];

const publicRoutes = [
    { name: 'Login', path: '/login', component: LoginPage, key: 'Login', showSidebar: false },
    { name: 'Register', path: '/register', component: RegisterPage, key: 'Register', showSidebar: false },
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
