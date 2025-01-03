// ProfileMenu.js
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useAuth } from '../../../hooks/useAuth';
import './profileMenu.css';
import API_BASE_URL from '../../../apiUrl';
import ProfilePicture from '../../../utils/profilePicture/getProfilePicture';
import getConfig from '../../../config';
import useApi from '../../../utils/useApi';

const ProfileMenu = ({ profileData }) => {
    const navigate = useNavigate();
    const { callApi } = useApi();
    const { authState, logout } = useAuth();


    const profileMenuLinks = [
        { label: 'Profile', url: '/profile' },
        { label: 'Settings', url: '/settings' },
        { label: 'Messages', url: '/messages' },
    ];
    return (
        <div className="profile-menu-container" onClick={(e) => e.stopPropagation()}>
            <div className='profile-menu-user-info-container'>
                <div className='profile-menu-profile-picture-container'>
                    <div className='learner-profile-menu-user-profile-picture'>
                        <ProfilePicture src={profileData?.profile_image} />
                    </div>
                    <div className='learner-profile-menu-user-info-text'>
                        <div className='learner-profile-menu-name-text'>{profileData?.first_name} {profileData?.last_name}</div>
                        <div className='learner-profile-menu-username-text'>@{profileData?.username}</div>
                    </div>
                </div>
            </div>
            <div className="profile-menu-links">
                <ul>
                    {profileMenuLinks.map((link, index) => (
                        (<Link to={link.url} key={`${link.label}-${index}`}>
                            <li id='exclude-link'>
                                <div className='profile-menu-per-link'>
                                    <div className='profile-menu-link-label'>
                                        {link.label}
                                    </div>
                                    {link.icon && <span className="link-icon">{link.icon}</span>}
                                </div>
                            </li>
                        </Link>
                        )
                    ))}
                </ul>
            </div>
            <div className='profile-menu-sign-out-button-container'>
                <button onClick={logout}>Sign Out</button>
            </div>
        </div>
    );
};

// ProfileMenu.propTypes = {
//     user: PropTypes.object.isRequired,
//     logout: PropTypes.func.isRequired,
// };

export default ProfileMenu;
