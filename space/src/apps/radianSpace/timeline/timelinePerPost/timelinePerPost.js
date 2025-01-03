import React, { useEffect, useState } from 'react';
import './timelinePerPost.css';
import API_BASE_URL from '../../../../apiUrl';
import ProfilePicture from '../../../../utils/profilePicture/getProfilePicture';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import unliked from '../../../../assets/unliked.png';
import undisliked from '../../../../assets/undisliked.png';
import liked from '../../../../assets/liked.png';
import disliked from '../../../../assets/disliked.png';
import VideoPlayer from '../../utils/videoPlayer';
import UserListOverlay from '../../utils/userListOverlay/userListOverlay';
import { Link } from 'react-router';
import { timeAgo } from '../../postUI/expandPost/convertDateTime';
import useApi from '../../../../utils/useApi';

const TimelinePerPost = ({ postId, posts, handleExpandPostOpen, index }) => {
    const { callApi } = useApi();
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    console.log(index);
    const [post, setPost] = useState(null);


    const [postLiked, setPostLiked] = useState(false);
    const [postDisliked, setPostDisliked] = useState(false);

    const [showLikesOverlay, setShowLikesOverlay] = useState(false);
    const [showDislikesOverlay, setShowDislikesOverlay] = useState(false);

    const handlePostClick = (index) => {
        console.log('inner idx', index)
        handleExpandPostOpen(postId, posts, window.location.pathname, index);
      };

      const handleFetchPostData = async (postId, setPost) => {
        try {
            const response = await callApi(`radianspace/flare/${postId}/`)
            console.log(response.data);
            setPost(response.data);
        } catch (error) {
            console.error('Error fetching timeline page posts:', error);
        };
    }

    useEffect(() => {
        handleFetchPostData(postId, setPost);
      }, []);


      
    useEffect(() => {    
        // Fetch initial like/dislike status when component mounts
        const fetchInitialLikeStatus = async (flareId) => {
            try {
                const response = await callApi(`radianspace/flare/${flareId}/like-status/`);
                const { liked, disliked } = response.data;
                setPostLiked(liked);
                setPostDisliked(disliked);
            } catch (error) {
                console.error('Error fetching like status:', error);
            }
        };  
        fetchInitialLikeStatus(postId);
    }, [postId]);

    const handlePreviousMediaClick = () => {
        if (currentMediaIndex > 0) {
            setCurrentMediaIndex(currentMediaIndex - 1);
        }
    };

    const handleNextMediaClick = () => {
        if (currentMediaIndex <= post.media_files.length - 2) {
            setCurrentMediaIndex(currentMediaIndex + 1);
        }
    };

    const handleCloseLikesOverlay = () => {
        setShowLikesOverlay(false);
        setShowDislikesOverlay(false);
    }



    const handlePostLike = async (flareId, setPost) => {
        setPostLiked(!postLiked);
        setPostDisliked(false);

        const handleLike = async () => {
            try {
                const method = (postLiked === true) ? 'DELETE' : 'POST';
                const response = await callApi(`radianspace/flare/${flareId}/like/`, method)
                setPost(response.data);
            } catch (err) {
                console.error('Error toggling like:', err);   
            }
        };
        await handleLike();
    };

    const handlePostDislike = async (flareId, setPost) => {
        setPostDisliked(!postDisliked);
        setPostLiked(false);

        const handleDislike = async () => {
            try {
            const method = (postDisliked === true) ? 'DELETE' : 'POST';
            const response = await callApi(`radianspace/flare/${flareId}/dislike/`, method);
            setPost(response.data);
            console.log(response.data);
        } catch(err) {
                console.error('Error toggling like:', err);
            };
        };

        await handleDislike();
    };




    const renderMediaContent = (mediaFile, onEnded) => {
        // console.log(mediaFile)
        if (mediaFile.media_type === 'mp4' || mediaFile.media_type === 'MOV') {
            return (
                <VideoPlayer
                    mediaFile={mediaFile}
                    onEnded={onEnded}
                    playable={true}
                />
            );
        } else {
            return (
                <img src={`${API_BASE_URL}${mediaFile.file}`} alt={mediaFile.id} />
            );
        }
    };


    return post ? (
        <div className='radian-timeline-per-post'>
            <div className='radian-timeline-per-post-inner'>
                <div className='radian-timeline-post-user-info'>
                    <div className='radian-timeline-post-user-profile-picture'>
                        <ProfilePicture src={post?.author?.profile_image} />
                    </div>
                    <div className='radian-timeline-post-user-username'>
                        <Link to={`profile/${post?.author?.username}`}>
                            @{post?.author?.username}
                        </Link>
                    </div>
                    <div className='radian-timeline-post-stats'>
                        <div className='radian-timeline-post-created-at'>
                            <p>Posted {timeAgo(post.created_at)}</p>
                        </div>
                        <div className='radian-timeline-post-stats-count'>
                            <p onClick={() => handlePostClick(index)}>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</p>
                            <p onClick={() => setShowLikesOverlay(!showLikesOverlay)}>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</p>
                            <p onClick={() => setShowDislikesOverlay(!showDislikesOverlay)}>{post.dislikes.length} {post.dislikes.length === 1 ? 'dislike' : 'dislikes'}</p>
                        </div>
                    </div>
                </div>
                <div className='radian-timeline-post-media-container'>
                    {renderMediaContent(post?.media_files[currentMediaIndex])}
                    <div className='radian-timeline-post-previous-next-post-button-container'>
                        <div className='radian-timeline-post-previous-next-post-button-container-inner'>
                            <div className='radian-timeline-post-previous-post-button-container'>
                                {currentMediaIndex > 0 &&
                                    <div className='radian-timeline-post-previous-post-button-container-inner' onClick={handlePreviousMediaClick}>
                                        <FontAwesomeIcon icon={faChevronLeft} />
                                    </div>
                                }
                            </div>
                            <div className='radian-timeline-post-next-post-button-container'>
                                {currentMediaIndex <= post.media_files.length - 2 &&
                                    <div className='radian-timeline-post-next-post-button-container-inner' onClick={handleNextMediaClick}>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='radian-timeline-post-comments-caption'>

                </div>
            </div>
            <div className='radian-timeline-per-post-interaction'>
                <div onClick={() => handlePostLike(post.id, setPost)}>
                    <img src={postLiked ? liked : unliked} />
                </div>
                <div onClick={() => handlePostDislike(post.id, setPost)}>
                    <img src={postDisliked ? disliked : undisliked} />
                </div>
            </div>
            {showLikesOverlay && (
                <UserListOverlay userList={post.likes} onClose={handleCloseLikesOverlay} title={'Likes'} />
            )}
            {showDislikesOverlay && (
                <UserListOverlay userList={post.dislikes} onClose={handleCloseLikesOverlay} title={'Dislikes'} />
            )}
        </div>
    ) : (
        <div>Loading...</div>
    )
};

export default TimelinePerPost;