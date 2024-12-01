import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './openSpace.css';
import API_BASE_URL from '../../../apiUrl';
import getConfig from '../../../config';
import { useAuth } from '../../../reducers/auth/useAuth';

const OpenSpace = () => {
    const { authState } = useAuth();
    const config = getConfig(authState);

    const [exchangePosts, setExchangePosts] = useState([]);
    const [newExchangePost, setNewExchangePost] = useState('');

    useEffect(() => {
        const fetchExchangePosts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}exchange-post/`);
                setExchangePosts(response.data);
            } catch (error) {
                console.error("Error fetching Exchange Posts:", error);
            }
        };

        fetchExchangePosts();
    }, []);

    const handleExchangePostSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}exchange-post/create/`, { content: newExchangePost }, config);
            setExchangePosts([...exchangePosts, response.data]);
            setNewExchangePost('');
        } catch (error) {
            console.error("Error creating Exchange Post:", error);
        }
    };

    return (
        <div className="open-space">
            <div className='open-space-inner'>
                <div className='open-space-inner-sidebar'>
                    <div className='open-space-inner-sidebar-inner'>
                        
                    </div>
                </div>
                <div className='open-space-inner-content'>
                    <div className='open-space-inner-content-inner'>
                        <h3>OpenSpace</h3>
                        {/* List of ExchangePosts */}
                        <div className='open-space-inner-content-inner-content'>
                            <div className="exchange-post-list">
                                {exchangePosts.map((exchangePost) => (
                                    <div key={exchangePost.id} className="exchange-post">
                                        <h2>{exchangePost.title}</h2>
                                        <p>{exchangePost.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpenSpace;
