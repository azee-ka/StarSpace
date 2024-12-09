// ProfileMenu.js
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useAuth } from '../../../reducers/auth/useAuth';
import './profileMenu.css';
import API_BASE_URL from '../../../apiUrl';
import ProfilePicture from '../../../utils/profilePicture/getProfilePicture';
import getConfig from '../../../config';

const ProfileMenu = () => {
    const navigate = useNavigate();
    const { authState, logout } = useAuth();
    const config = getConfig(authState);

    const [profileData, setProfileData] = useState({});

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/profile/get-user-info/`, config);
                console.log(response.data);
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        if (authState.isAuthenticated) {
            fetchProfileData();
        }

    }, [authState.isAuthenticated, setProfileData]);

    const profileMenuLinks = [
        { label: 'Profile', url: '/profile', role: 'Personal' },
        { label: 'Settings', url: '/preferences', role: 'Personal' },
        { label: 'Messages', url: '/messages', role: 'Personal' },
    ];
    return (
        <div className="profile-menu-container" onClick={(e) => e.stopPropagation()}>
            <div className='profile-menu-user-info-container'>
                <div className='profile-menu-profile-picture-container'>
                    <div className='learner-profile-menu-user-profile-picture'>
                        <ProfilePicture src={profileData.profile_picture} />
                    </div>
                    <div className='learner-profile-menu-user-info-text'>
                        <div className='learner-profile-menu-name-text'>{profileData.first_name} {profileData.last_name}</div>
                        <div className='learner-profile-menu-username-text'>@{profileData.username}</div>
                    </div>
                </div>
            </div>
            <div className="profile-menu-links">
                <ul>
                    {profileMenuLinks.map((link) => (
                        (<a href={link.url} key={`${link.label}-${link.role}`}>
                            <li id='exclude-link'>
                                <div className='profile-menu-per-link'>
                                    <div className='profile-menu-link-label'>
                                        {link.label}
                                    </div>
                                    {link.icon && <span className="link-icon">{link.icon}</span>}
                                </div>
                            </li>
                        </a>
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
