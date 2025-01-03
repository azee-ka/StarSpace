import React from 'react';
import './notificationsMenu.css';
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
            <div className='notification-item-content'>
                <div className='notification-item-message-container'>
                <p>{notification.message}</p>
                </div>
                <div className='notification-item-actions-container'>
                {notification.type === 'action' && (
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
            </div>
        </div>
    );
};

export default NotificationItem;
