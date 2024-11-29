// NotificationsMenu.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../config';
import { useAuth } from '../../../reducers/auth/useAuth';
import './notificationsMenu.css';
import { timeAgo } from '../../../components/personal/postUI/expandPost/convertDateTime';
const NotificationsMenu = ({ setCountNotifications, notificationsList, fetchNotifications }) => {
    const { authState } = useAuth();

    const handleAcceptLinkAccountRequest = async (notificationId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${authState.token}`
            }
        };
        try {
            const response = await axios.post(`${API_BASE_URL}accept_link_request/${notificationId}/`, {}, config);
            console.log(response.data);
        } catch (error) {
            console.error('Error accepting link request:', error);
        }
        fetchNotifications()
    };

    const handleDeleteNotification = async (notificationId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${authState.token}`
            }
        };
        try {
            const response = await axios.delete(`${API_BASE_URL}delete-notification/${notificationId}/`, config);
            console.log(response.data);
        } catch (error) {
            console.error('Error accepting link request:', error);
        }
        fetchNotifications()
    };

    const handleDeclineLinkAccountRequest = async (notificationId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${authState.token}`
            }
        };
        try {
            const response = await axios.post(`${API_BASE_URL}reject_link_request/${notificationId}/`, {}, config);
            console.log(response.data);
        } catch (error) {
            console.error('Error rejecting link request:', error);
        }
        fetchNotifications()
    };



    const handleAcceptFollowAccountRequest = async (notificationId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${authState.token}`
            }
        };
        try {
            const response = await axios.post(`${API_BASE_URL}personal/accept_follow_request/${notificationId}/`, {}, config);
            console.log(response.data);
        } catch (error) {
            console.error('Error accepting link request:', error);
        }
        fetchNotifications()
    };
    const handleDeclineFollowAccountRequest = async (notificationId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${authState.token}`
            }
        };
        try {
            const response = await axios.post(`${API_BASE_URL}personal/reject_follow_request/${notificationId}/`, {}, config);
            console.log(response.data);
        } catch (error) {
            console.error('Error rejecting link request:', error);
        }
        fetchNotifications()
    };


    return (
        <div className='notifications-menu-container'>
            <div className='notifications-menu-notifications-list'>
                {notificationsList.length !== 0 ? (
                    notificationsList.map((notification, index) => (
                        <div key={notification.id} className='notification-item'>
                            <div className='notification-item-inner'>
                                <div className='notification-item-message'>
                                    <div className='notification-message-container'>
                                        <p>{notification.message}</p>
                                    </div>
                                    <div className='notification-time-ago-container'>
                                        <p>{timeAgo(notification.created_at)}</p>
                                    </div>
                                </div>
                                {notification.notification_type === 'profile_link_request' && (
                                    <div className='profile-link-request-buttons-container'>
                                        <button onClick={() => handleAcceptLinkAccountRequest(notification.id)}>Accept</button>
                                        <button onClick={() => handleDeclineLinkAccountRequest(notification.id)}>Decline</button>
                                    </div>
                                )}
                                {notification.notification_type === 'message' && (
                                    <div className='profile-link-request-buttons-container'>
                                        <button onClick={() => handleDeleteNotification(notification.id)}>Dismiss</button>
                                    </div>
                                )}
                                {notification.notification_type === 'follow_request' && (
                                    <div className='profile-link-request-buttons-container'>
                                        <button onClick={() => handleAcceptFollowAccountRequest(notification.id)}>Confirm</button>
                                        <button onClick={() => handleDeclineFollowAccountRequest(notification.id)}>Decline</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='notifications-menu-notifications-list-no-notifications'>
                        <p>No Notifications!</p>
                    </div>
                )

                }

            </div>
        </div>
    );
}

export default NotificationsMenu;
