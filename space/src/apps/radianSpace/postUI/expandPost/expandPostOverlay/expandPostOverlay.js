import React, { useState, useEffect } from 'react';
import './expandPostOverlay.css';
import { faChevronDown, faChevronUp, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../../../../../apiUrl';
import axios from 'axios';
import { useAuth } from '../../../../../reducers/auth/useAuth';
import { timeAgo } from '../convertDateTime';
import ExpandedPostLoading from '../expandedPostLoading/expandedPostLoading';
import unliked from '../../../../../assets/unliked.png';
import undisliked from '../../../../../assets/undisliked.png';
import liked from '../../../../../assets/liked.png';
import disliked from '../../../../../assets/disliked.png';
import VideoPlayer from '../../../utils/videoPlayer';
import UserListOverlay from '../../../utils/userListOverlay/userListOverlay';
import { useNavigate, useParams } from 'react-router';
import ProfilePicture from '../../../../../utils/profilePicture/getProfilePicture';
import { Link } from 'react-router-dom';
import useApi from '../../../../../utils/useApi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { usePostContext } from '../postContext';

const ExpandedPostOverlay = ({
    handlePreviousPostClick,
    handleNextPostClick,
    showPreviousPostButton,
    showNextPostButton,
}) => {
    const {
        post,
        postLiked,
        postDisliked,
        commentText,
        showLikesOverlay,
        showDislikesOverlay,
        setCommentText,
        currentMediaIndex,
        setShowLikesOverlay,
        setShowDislikesOverlay,
        toggleLike,
        deletePost,
        toggleDislike,
        addComment,
        navigateMedia,
        renderMediaContent,
        handleCloseLikesOverlay,
    } = usePostContext();

    const { authState } = useAuth();


    return post ? (
        <div className="expanded-post-overlay-container">
            <div className='expanded-post-overlay-user-info-comments-container'>
                <div className='expanded-post-overlay-comment-top-panel'>
                    <div className='expanded-post-overlay-user-info-container'>
                        <div className='expanded-post-overlay-user-info-profile-image'>
                            <ProfilePicture src={post?.author?.profile_image} />
                        </div>
                        <Link to={`/profile/${post?.author?.username}`} className='custom-link'>
                            {post?.author?.username}
                        </Link>
                    </div>
                    <div className='expanded-post-overlay-comment-top-panel-other-info'>

                    </div>
                </div>
                <div className='expanded-post-overlay-comments'>
                        {post?.comments?.length !== 0 ?
                            (post?.comments?.map((commentData, index) => (
                                <div key={`${index}-${commentData?.created_at}`} className='expanded-post-per-comment'>
                                    <div className='expanded-post-comments-info'>
                                        <div className='expanded-post-commenting-user-info'>
                                            <div className='expanded-post-commenting-user-profile-picture'>
                                                <div className='expanded-post-commenting-user-profile-picture-inner'>
                                                    <ProfilePicture src={post?.author?.profile_image} />
                                                </div>
                                            </div>
                                            <div className='expanded-post-commenting-user-username'>
                                                <p>
                                                    <Link to={`/profile/${commentData?.author?.username}`}>
                                                    {commentData?.author?.username}
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                        <div className='expanded-post-comment-info'>
                                            <p>Posted {timeAgo(commentData?.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className='expanded-post-comments-text'>
                                        <div className='expanded-post-comments-text-inner'>
                                            <p>{commentData?.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))) : (
                                <div className='expanded-post-no-comments'>
                                    No Comments
                                </div>
                            )
                        }
                </div>
                <div className='expanded-post-comment-post-container'>
                    <div className={`expanded-post-comment-post-button ${commentText !== '' ? 'active' : ''}`}>
                        {commentText !== '' &&
                            <button onClick={() => addComment()} >Post</button>
                        }
                    </div>
                    <div className='expanded-post-comment-post-container-inner'>
                        <textarea
                            placeholder='Comment here...'
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        ></textarea>
                    </div>
                </div>
            </div>
            <div className='expanded-post-overlay-post-info-img-container'>
                <div className='expanded-post-overlay-post-info-container'>
                    <div className='expanded-post-overlay-post-info-container-inner'>
                        <div className='expanded-post-overlay-post-creation-time'>
                            <p>Posted {timeAgo(post?.created_at)}</p>
                        </div>
                        <div className='expanded-post-overlay-post-info-likes-unlikes-comments-count'>
                            <p >{post?.comments?.length} {post?.comments?.length === 1 ? 'comment' : 'comments'}</p>
                            <p onClick={() => setShowLikesOverlay(!showLikesOverlay)}>{post?.likes?.length} {post?.likes?.length === 1 ? 'like' : 'likes'}</p>
                            <p onClick={() => setShowDislikesOverlay(!showDislikesOverlay)}>{post?.dislikes?.length} {post.dislikes?.length === 1 ? 'dislike' : 'dislikes'}</p>
                        </div>
                    </div>
                </div>
                <div className='expanded-post-overlay-img-container'>
                    {post &&
                        <div className='expanded-post-overlay-post-img'>
                            {renderMediaContent(post?.media_files[currentMediaIndex])}
                            {/* <img src={`${API_BASE_URL}${post.media_files[currentMediaIndex].file}`} /> */}
                        </div>
                    }
                    {post?.media_files?.length > 1 &&
                        <div className='expanded-post-overlay-img-previous-next-buttons-container'>
                            <div className='expanded-post-overlay-img-previous-next-buttons-container-inner'>
                                <div className='expanded-post-overlay-img-previous-button-container'>
                                    {currentMediaIndex > 0 &&
                                        <div className='expanded-post-overlay-img-previous-button-container-inner' onClick={() => navigateMedia('prev')}>
                                            <FaChevronLeft className='icon-style' />
                                        </div>
                                    }
                                </div>
                                <div className='expanded-post-overlay-img-next-button-container'>
                                    {currentMediaIndex !== post?.media_files?.length - 1 &&
                                        <div className='expanded-post-overlay-img-next-button-container-inner' onClick={() => navigateMedia('next')}>
                                            <FaChevronRight className='icon-style' />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                    }
                </div>
            </div>
            <div className='expanded-post-overlay-interaction-container'>
                <div onClick={() => toggleLike()}>
                    <img src={postLiked ? liked : unliked} />
                </div>
                <div onClick={() => toggleDislike()}>
                    <img src={postDisliked ? disliked : undisliked} />
                </div>
                {post?.author?.username === authState.user.username &&
                    <div onClick={() => deletePost()} className='expanded-post-overlay-delete-post'>
                        <i className='fa fa-trash' id="delete-icon" />
                    </div>
                }
            </div>
            {showLikesOverlay && (
                <UserListOverlay userList={post.likes} onClose={handleCloseLikesOverlay} title={'Likes'} username={authState.user.username} />
            )}
            {showDislikesOverlay && (
                <UserListOverlay userList={post.dislikes} onClose={handleCloseLikesOverlay} title={'Dislikes'} username={authState.user.username} />
            )}
            <div className='expand-overlay-previous-next-post-button-container'>
                <div className='expand-overlay-previous-next-post-button-container-inner '>
                    <div className='expanded-post-overlay-previous-post-button-container'>
                        {showPreviousPostButton &&
                            <div className='expanded-post-overlay-previous-post-button-container-inner' onClick={handlePreviousPostClick}>
                                <FaChevronLeft className='icon-style' />
                            </div>
                        }
                    </div>
                    <div className='expanded-post-overlay-next-post-button-container'>
                        {showNextPostButton &&
                            <div className='expanded-post-overlay-next-post-button-container-inner' onClick={handleNextPostClick}>
                                <FaChevronRight className='icon-style' />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <ExpandedPostLoading />
    );
}

export default ExpandedPostOverlay;