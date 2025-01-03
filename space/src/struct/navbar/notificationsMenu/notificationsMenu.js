// NotificationsMenu.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../apiUrl';
import { useAuth } from '../../../hooks/useAuth';
import './notificationsMenu.css';
import { timeAgo } from '../../../utils/convertDateTIme';
import NotificationList from './notificationList';

const NotificationsMenu = ({ }) => {

    return (
        <div className='notifications-menu-container' onClick={(e) => e.stopPropagation()}>
            <NotificationList />
        </div>
    );
}

export default NotificationsMenu;
