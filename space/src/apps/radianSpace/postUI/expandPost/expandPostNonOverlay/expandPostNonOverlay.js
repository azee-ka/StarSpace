import React, { useState, useEffect } from 'react';
import './expandPostNonOverlay.css';
import { faChevronDown, faChevronUp, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../../../../../apiUrl';
import axios from 'axios';
import { useAuth } from '../../../../../hooks/useAuth';
import { timeAgo } from '../convertDateTime';
import ExpandedPostLoading from '../expandedPostLoading/expandedPostLoading';
import unliked from '../../../../../assets/unliked.png';
import undisliked from '../../../../../assets/undisliked.png';
import liked from '../../../../../assets/liked.png';
import disliked from '../../../../../assets/disliked.png';
import VideoPlayer from '../../../utils/videoPlayer';
import UserListOverlay from '../../../utils/userListOverlay/userListOverlay';
import { Link, useNavigate } from 'react-router';
import useApi from '../../../../../utils/useApi';
import ProfilePicture from '../../../../../utils/profilePicture/getProfilePicture';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { usePostContext } from '../postContext';

const ExpandedPostNonOverlay = () => {
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
        <div className="expanded-post-non-overlay-container">
            <div className='expanded-post-non-overlay-container-inner'>
                <div className='expanded-post-non-overlay-user-info-comments-container'>
                    <div className='expanded-post-non-overlay-user-info-comments-container-inner'>
                        <div className='expanded-post-non-overlay-comment-top-panel'>
                            <div className='expanded-post-non-overlay-user-info-container'>
                                <div className='expanded-post-non-overlay-user-info-profile-image'>
                                    <ProfilePicture src={post?.author?.profile_image} />
                                </div>
                                <Link to={`/profile/${post?.author?.username}`} className='custom-link'>
                                    {post?.author?.username}
                                </Link>
                            </div>
                            <div className='expanded-post-non-overlay-comment-top-panel-other-info'>

                            </div>
                        </div>
                        <div className='expanded-post-non-overlay-comments'>
                                {post?.comments?.length !== 0 ?
                                    (post.comments.map((commentData, index) => (
                                        <div key={`${index}-${commentData.created_at}`} className='expanded-post-per-comment'>
                                            <div className='expanded-post-comments-info'>
                                                <div className='expanded-post-commenting-user-info'>
                                                    <div className='expanded-post-commenting-user-profile-picture'>
                                                        <div className='expanded-post-commenting-user-profile-picture-inner'>
                                                            <ProfilePicture src={post?.author?.profile_picture} />
                                                        </div>
                                                    </div>
                                                    <div className='expanded-post-commenting-user-username'>
                                                        <p>
                                                            <Link to={`/profile/${commentData?.author?.username}`}>

                                                                {commentData.author.username}
                                                            </Link>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className='expanded-post-comment-info'>
                                                    <p>Posted {timeAgo(commentData.created_at)}</p>
                                                </div>
                                            </div>
                                            <div className='expanded-post-comments-text'>
                                                <div className='expanded-post-comments-text-inner'>
                                                    <p>{commentData.text}</p>
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
                </div>
                <div className='expanded-post-non-overlay-post-info-img-container'>
                    <div className='expanded-post-non-overlay-post-info-container'>
                        <div className='expanded-post-non-overlay-post-info-container-inner'>
                            <div className='expanded-post-non-overlay-post-creation-time'>
                                <p>Posted {timeAgo(post.created_at)}</p>
                            </div>
                            <div className='expanded-post-non-overlay-post-info-likes-unlikes-comments-count'>
                                <p >{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</p>
                                <p onClick={() => setShowLikesOverlay(!showLikesOverlay)}>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</p>
                                <p onClick={() => setShowDislikesOverlay(!showDislikesOverlay)}>{post.dislikes.length} {post.dislikes.length === 1 ? 'dislike' : 'dislikes'}</p>
                            </div>
                        </div>
                    </div>
                    <div className='expanded-post-non-overlay-img-container'>
                        {post &&
                            <div className='expanded-post-non-overlay-post-img'>
                                {renderMediaContent(post.media_files[currentMediaIndex])}
                                {/* <img src={`${API_BASE_URL}${post.media_files[currentMediaIndex].file}`} /> */}
                            </div>
                        }
                        {post.media_files.length > 1 &&
                            <div className='expanded-post-non-overlay-img-previous-next-buttons-container'>
                                <div className='expanded-post-non-overlay-img-previous-next-buttons-container-inner'>
                                    <div className='expanded-post-non-overlay-img-previous-button-container'>
                                        {currentMediaIndex > 0 &&
                                            <div className='expanded-post-non-overlay-img-previous-button-container-inner' onClick={() => navigateMedia('prev')}>
                                                <FaChevronLeft className='icon-style' />
                                            </div>
                                        }
                                    </div>
                                    <div className='expanded-post-non-overlay-img-next-button-container'>
                                        {currentMediaIndex !== post.media_files.length - 1 &&
                                            <div className='expanded-post-non-overlay-img-next-button-container-inner' onClick={() => navigateMedia('next')}>
                                                <FaChevronRight className='icon-style' />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>

                        }
                    </div>
                </div>
                <div className='expanded-post-non-overlay-interaction-container'>
                    <div onClick={() => toggleLike()}>
                        <img src={postLiked ? liked : unliked} />
                    </div>
                    <div onClick={() => toggleDislike()}>
                        <img src={postDisliked ? disliked : undisliked} />
                    </div>
                    {post?.author?.username === authState?.author?.username &&
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
            </div>
        </div>
    ) : (
        <ExpandedPostLoading />
    );
}

export default ExpandedPostNonOverlay;