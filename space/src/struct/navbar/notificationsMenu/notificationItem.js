import React from 'react';
import { useDispatch } from 'react-redux';
import { markAsRead } from '../../../state/reducers/notificationsSlice';
import { markAsRead as updateState } from '../../../state/reducers/notificationsSlice';

const NotificationItem = ({ notification }) => {
    const dispatch = useDispatch();

    const handleMarkAsRead = async () => {
        try {
            await markAsRead(notification.id);
            dispatch(updateState(notification.id));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    return (
        <div
            className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
        >
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            {notification.type === 'action-required' && (
                <a href={notification.action_url} className="action-link">
                    Take Action
                </a>
            )}
            {!notification.is_read && (
                <button onClick={handleMarkAsRead} className="mark-as-read">
                    Mark as Read
                </button>
            )}
        </div>
    );
};

export default NotificationItem;
