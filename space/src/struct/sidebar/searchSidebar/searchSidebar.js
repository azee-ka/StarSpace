import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../config';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../reducers/auth/useAuth';
import { CLIENT_BASE_URL } from '../../../config';
import ProfilePicture from '../../../utils/getProfilePicture';
import './searchSidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const SearchSidebar = ({ showSeachSidebar }) => {
    const navigate = useNavigate();
    const { authState } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);


    const fetchUserSearchHistory = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${authState.token}`
                }
            };

            const response = await axios.get(`${API_BASE_URL}personal/search/history/`, config);
            // console.log(response.data);
            setSearchHistory(response.data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };


    useEffect(() => {
        fetchUserSearchHistory();
    }, []);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setSearchQuery(inputValue);

        if (inputValue !== "") {
            handleSubmitSearch();
        } else {
            setSearchResults([]);
        }

    };

    const handleSubmitSearch = (e) => {
        // Make an API request to search for users
        axios.get(`${API_BASE_URL}personal/search/?query=${searchQuery}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${authState.token}`,
            },
        })
            .then((response) => {
                setSearchResults(response.data);
            })
            .catch((error) => {
                console.error('Error searching for users:', error);
            });
    };


    const handleUserClick = (clickedUser) => {
        // Make an API request to store search history
        axios.post(`${API_BASE_URL}personal/search/store/`, {
            searched_user_id: clickedUser.id,
        }, {
            headers: {
                'Authorization': `Token ${authState.token}`,
            },
        })
            .then(() => {
                // Redirect to the user's profile page
                // window.location.pathname = `/personal/profile/${clickedUser.username}`;
                navigate(`/personal/profile/${clickedUser.username}`);
            })
            .catch((error) => {
                console.error('Error storing search history:', error);
            });
    };



    const handleDeleteFromHistory = async (usernameToDelete) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${authState.token}`
                }
            };

            const data = {
                username: usernameToDelete
            }

            const response = await axios.post(`${API_BASE_URL}personal/search/delete/`, data, config);
            fetchUserSearchHistory();
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };


    return (
        <div className={`search-sidebar-container ${showSeachSidebar ? 'show' : ''}`}>
            <div className='search-sidebar-title'>
                <div className='search-sidebar-title-inner'>
                    <h3>Search</h3>
                </div>
            </div>
            <div className={`sidebar-search-container`}>
                <div className='sidebar-search-bar-container'>
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleInputChange}
                        />
                        {searchQuery && (
                            <FontAwesomeIcon
                                icon={faClose}
                                className="clear-search-icon"
                                onClick={() => setSearchQuery('')}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className={`sidebar-search-show-users-search`}>
                <div className='sidebar-search-show-users-search-inner'>
                    {searchQuery === '' &&
                        <div className='sidebar-search-history-results'>
                            <div className='sidebar-search-history-title'>
                                <h4>Recent</h4>
                            </div>
                            {searchHistory.map((searchQuery, index) => (
                                <div className="users-search-list-item" key={`${searchQuery.searched_user.username}-${index}`}>
                                    <div className="users-search-list-item-inner" onClick={() => handleUserClick(searchQuery.searched_user)}>
                                        <div className="users-search-list-item-profile-picture">
                                            <div className="users-search-list-item-profile-picture-inner">
                                                <ProfilePicture src={searchQuery.searched_user.profile_picture} />
                                            </div>
                                        </div>
                                        <div className="users-search-list-item-username">
                                            <p>{searchQuery.searched_user.username}</p>
                                        </div>
                                    </div>
                                    <div className={`clear-search-history-result-container ${showSeachSidebar ? 'show' : ''}`}>
                                        <FontAwesomeIcon
                                            icon={faClose}
                                            className="clear-search-history-result"
                                            onClick={() => handleDeleteFromHistory(searchQuery.searched_user.username)}
                                        />
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                    }

                    {searchResults.map((thisUser, index) => (
                        <div className="users-search-list-item" onClick={() => handleUserClick(thisUser)} key={`${thisUser.username}-${index}`}>
                            <div className="users-search-list-item-inner">
                                <div className="users-search-list-item-profile-picture">
                                    <div className="users-search-list-item-profile-picture-inner">
                                        <ProfilePicture src={thisUser.profile_picture} />
                                    </div>
                                </div>
                                <div className="users-search-list-item-username">
                                    <p>{thisUser.username}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchSidebar;