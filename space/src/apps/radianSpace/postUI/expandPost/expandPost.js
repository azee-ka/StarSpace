import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import API_BASE_URL from '../../../../apiUrl';
import VideoPlayer from '../../utils/videoPlayer';
import './expandPost.css';
import ExpandedPostOverlay from './expandPostOverlay/expandPostOverlay';
import ExpandedPostNonOverlay from './expandPostNonOverlay/expandPostNonOverlay';
import useApi from '../../../../utils/useApi';
import { PostProvider } from './postContext';

const ExpandPost = ({ 
    overlayPostId, 
    handleExpandPostClose, 
    handlePreviousPostClick, 
    handleNextPostClick, 
    showPreviousPostButton, 
    showNextPostButton 
}) => {
    const { postId } = useParams();
    const [expandPostIdFinal, setExpandPostIdFinal] = useState(overlayPostId ? overlayPostId : postId);


    useEffect(() => {
        setExpandPostIdFinal(overlayPostId ? overlayPostId : postId);
    }, [overlayPostId, postId]);


    return (
        <PostProvider postId={expandPostIdFinal}>
            <div className={`expanded-post-container ${!overlayPostId ? 'non-overlay' : 'overlay'}`} onClick={handleExpandPostClose}>
                {overlayPostId ?
                    (
                        <div className='expanded-post-overlay' onClick={(e) => e.stopPropagation()}>
                            <ExpandedPostOverlay
                                handlePreviousPostClick={handlePreviousPostClick}
                                handleNextPostClick={handleNextPostClick}
                                showPreviousPostButton={showPreviousPostButton}
                                showNextPostButton={showNextPostButton}
                            />
                        </div>
                    ) : (
                        <ExpandedPostNonOverlay />
                    )}
            </div>
        </PostProvider>
    );
}

export default ExpandPost;