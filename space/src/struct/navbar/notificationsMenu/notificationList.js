import React, { useEffect } from 'react';
import './notificationsMenu.css'
import NotificationItem from './notificationItem';
import useNotifications from '../../../hooks/useNotifications';

const NotificationList = () => {
    const { notifications } = useNotifications();

    return (notifications?.length > 0) ? (
        <div className="notification-list">
            {notifications?.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}
        </div>
    ) : (
        <div className='notifications-list-no-notifications'>No Notifications!</div>
    );
};

export default NotificationList;
