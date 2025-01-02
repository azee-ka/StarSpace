// In ExpandedPostOverlay.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ExpandedPost from './expandedPost';
import './expandPostOverlay.css';
//import './expandedPost.css';
import '../postFrame/postFrame.css';
import '../postContent/postContent.css';
//import '../postFrame/postFrameNonOverlay.css'

import PostFrame from '../postFrame/postFrame';
import Post from '../timeline/post';

function ExpandedPostOverlay({ postIdFromClick, onClose }) {
    const navigate = useNavigate();

    const { postIdParam } = useParams();
    const [postId, setPostId] = useState(postIdParam);


    // Update address bar based on overlay status
    useEffect(() => {
        if (postIdFromClick !== null) {
            setPostId(postIdFromClick);
        } else if (postIdParam) {
            setPostId(postIdParam);
        }
    }, []);

    return (
        <div className={`expanded-post-non-overlay`}>
            {
                <ExpandedPost postIdForOverlay={postId} onClose={onClose} />
            }
        </div>
    );
};

export default ExpandedPostOverlay;
