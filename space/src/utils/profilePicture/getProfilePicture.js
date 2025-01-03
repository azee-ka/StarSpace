import React, { useEffect, useState } from 'react';
import default_profile_picture from '../../assets/default_profile_picture.png';
import API_BASE_URL from '../../apiUrl';
import './getProfilePicture.css';

const ProfilePicture = ({ src, onClick }) => {
    let profilePictureSrc = default_profile_picture;

    if (src) {
        if (typeof src === 'object' && src.profile_picture) {
            profilePictureSrc = API_BASE_URL + src.profile_picture;

        } else if (typeof src === 'string' && src.includes('default_profile_picture')) {
            profilePictureSrc = default_profile_picture;
        }
        else if (typeof src === 'string' && src.includes('http://')) {
            profilePictureSrc = src;
        }
        else if (typeof src === 'string') {
            profilePictureSrc = API_BASE_URL + src;
        }
        else if (src === null) {
            profilePictureSrc = default_profile_picture;
        }
    } else if (src === null) {
        profilePictureSrc = default_profile_picture;
    }

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <img
            src={profilePictureSrc}
            alt={'profile-picture-icon'}
            onClick={handleClick}
            className='profile-picture'
        />
    );
};

export default ProfilePicture;
