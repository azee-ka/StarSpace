import React, { useEffect, useState } from "react";
import './timeline.css';
import useApi from "../../../utils/useApi";
import TimelinePerPost from './timelinePerPost/timelinePerPost';

const RadianTimeline = ({ handleExpandPostOpen }) => {
    const { callApi } = useApi();
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        const fetchTimelinePosts = async () => {
            try { 
                const response = await callApi(`radianspace/timeline/flares-list/`);
                console.log(response.data);
                setPosts(response.data);
            } catch (err) {
                console.error('Error fetching timeline page posts:', err);
            }
        }
        fetchTimelinePosts();
    }, []);

    return (
        <div className="radian-timeline-page">
                <div className='radian-timeline-page-header'>
                    <h2>Timeline</h2>
                </div>
                <div className='radian-timeline-page-content'>
                        <div className="timeline-left-side-container">
                            {posts.map((post, index) => (
                                <TimelinePerPost key={index} postId={post.uuid} posts={posts} handleExpandPostOpen={handleExpandPostOpen} index={index} />
                            ))
                            }
                        </div>
                        <div className="timeline-right-side-container">

                        </div>
                </div>
        </div>
    )
};

export default RadianTimeline;