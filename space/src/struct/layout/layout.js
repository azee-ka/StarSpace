// Layout.js
import React, { useState, useEffect } from 'react';
import './layout.css';
import Navbar from '../navbar/navbar';
import { useNavigate } from 'react-router';

function Layout({ children, pageName }) {
    const navigate = useNavigate();

    return (
        <div className={`parent-layout`}>
            <div className='layout'>
                <div className='layout-navbar'>
                    <Navbar />
                </div>
                <div className='layout-page'>
                    <div className='layout-page-content'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
