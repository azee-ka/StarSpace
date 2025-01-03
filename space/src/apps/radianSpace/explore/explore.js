import React, { useEffect, useState } from "react";
import './explore.css';
import { useAuth } from "../../../hooks/useAuth";
import useApi from "../../../utils/useApi";
import PostsGrid from "../postUI/postGrid/postGrid";

const RadianExplore = ({ handleExpandPostOpen }) => {
    const { authState } = useAuth();
    const { callApi } = useApi();
    const [posts, setPosts] = useState([]);

    const fetchExplorePosts = async () => {
        try {
            const response = await callApi(`radianspace/explore/flares-list`);
            setPosts(response.data);
            console.log(response.data); 
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    useEffect(() => {
        fetchExplorePosts();
    }, []);

    return (
        <div className='radian-explore-container'>
                <div className='radian-explore-header'>
                    <h2>Explore</h2>
                </div>
                <div className='radian-explore-content'>
                    <div className='radian-explore-content-left-container'>
                        <div className='radian-explore-posts-grid'>
                                {posts.length !== 0 ? (
                                    <PostsGrid classname={'explore'} postsData={posts} handleExpandPostOpen={handleExpandPostOpen} />
                                ) : (
                                    <div>
                                    </div>
                                )
                                }
                        </div>
                    </div>
                    <div className='radian-explore-content-right-container'>

                    </div>
                </div>
        </div>
    );
};

export default RadianExplore;