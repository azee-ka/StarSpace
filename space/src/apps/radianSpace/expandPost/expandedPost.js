import React, { useState, useEffect } from 'react';
//import axios from 'react';
//import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './expandedPost.css'; // Import the CSS file
import './expandPostOverlay.css';
// import '@fortawesome/fontawesome-free/css/all.css';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate from react-router-dom
import API_BASE_URL, { CLIENT_BASE_URL } from '../../../config';
import { timeAgo } from './convertDateTIme';
//import { Link } from 'react-router-dom';
import { useAuth } from '../../../reducers/auth/useAuth';
import UserListOverlay from '../personalTimeline/followListOverlay';
//import { findByText } from '@testing-library/react';
import likedImg from '../../../assets/liked.png';
import unlikedImg from '../../../assets/unliked.png';
import dislikedImg from '../../../assets/disliked.png';
import undislikedImg from '../../../assets/undisliked.png';
import VideoPlayer from '../utils/videoPlayer';
import ProfilePicture from '../../../utils/getProfilePicture';

const ExpandedPost = ({ postIdForOverlay, previousPostId, nextPostId, onClose, originalUrl }) => {
  const { authState } = useAuth();
  const user = authState.user
  const navigate = useNavigate();

  // const [originalUrl, setOriginalUrl] = useState(null);



  const { postId: postIdParam } = useParams();


  const [postId, setPostId] = useState(null);
  const [postIdNext, setPostIdNext] = useState(null);
  const [postIdPrevious, setPostIdPrevious] = useState(null);


  const [post, setPost] = useState(null);

  const [commentText, setCommentText] = useState('');

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const [showLikesOverlay, setShowLikesOverlay] = useState(false);
  const [showDislikesOverlay, setShowDislikesOverlay] = useState(false);

  const [loading, setLoading] = useState(true);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [renderMedia, setRenderMedia] = useState(true);



  const handlePreviousMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex((prevIndex) => prevIndex - 1);
      setRenderMedia(false);
      setRenderMedia(true);
    }
  };

  const handleNextMedia = () => {
    if (currentMediaIndex < post.media_files.length - 1) {
      setCurrentMediaIndex((prevIndex) => prevIndex + 1);
      setRenderMedia(false);
      setRenderMedia(true);
    }
  };


  const handlePreviousPost = () => {
    console.log("Before pre", post);
    if(previousPostId){
      setPost(previousPostId);
      console.log("After pre", post);
    }
  };

  console.log("postIdPrevious", previousPostId);
  console.log("postIdNext", nextPostId);

  const handleNextPost = () => {
    console.log("Before next", post);
    if(nextPostId){
      setPost(nextPostId);
      console.log("After next", post);
    }
  };


  useEffect(() => {
    if (postIdForOverlay) {
      setPostId(postIdForOverlay);
      window.history.replaceState(null, null, `/post/${postIdForOverlay}`);

      setPostIdNext(nextPostId);
      console.log("next p", nextPostId);
      setPostIdPrevious(previousPostId);

    } else {
      setPostId(postIdParam);
    }

  }, [postId]);


  useEffect(() => {
    //    setOriginalUrl(window.location.href);
    // fetchUserData();
    setLoading(false); // Set loading to false once user data is fetched

  }, [setLoading]);

  // console.log(post);

  useEffect(() => {
    if (!loading) {
      const token = localStorage.getItem('token');

      const headers = new Headers({
        'Authorization': `Token ${token}`,
      });

      fetch(`${API_BASE_URL}posts/${postId}`, {
        method: 'GET',
        headers: headers,
      })
        .then(response => response.json())
        .then(data => {
          setPost(data);

          // Check if user data is available
          if (user && user.username) {
            setIsLiked(data.likes.find(like => like.username === user.username && isDisliked));
            setIsDisliked((data.dislikes.find(dislike => dislike.username === user.username)) && isLiked);
          } else {
            console.warn('User data not available yet.');
          }
        })
        .catch(error => {
          console.error('Error fetching expanded post:', error);
        });
    }
  }, [postId, user, isDisliked, isLiked, loading]);


  const handleCloseOverlay = () => {
    setShowLikesOverlay(false);
    setShowDislikesOverlay(false);
  };



  const handleCloseExpandPostOverlay = (event) => {
    if (event.target.classList.contains('expanded-overlay')) {
      onClose?.();
      window.history.replaceState(null, null, originalUrl);
    }
  };

  const handleDislikeandUndislike = () => {
    // Update the post state with the new dislike information
    setIsDisliked(!isDisliked); // Toggle the state for dislike
    // If the user disliked the post, ensure that the like state is set to false
    setIsLiked(!isLiked && isDisliked);

    const token = localStorage.getItem('token');
    const method = (isDisliked === true) ? 'DELETE' : 'POST';
    fetch(`${API_BASE_URL}posts/${postId}/dislike/`, {
      method: method,
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {

        setPost(data);
      })
      .catch(error => console.error('Error toggling like:', error));
  }

  const handleLikeAndUnlike = () => {
    // Update the post state with the new like information
    setIsLiked(!isLiked); // Toggle the state for dislike
    // If the user disliked the post, ensure that the like state is set to false
    setIsDisliked(!isDisliked && isLiked);

    const token = localStorage.getItem('token');
    const method = (isLiked === true) ? 'DELETE' : 'POST';
    fetch(`${API_BASE_URL}posts/${postId}/like/`, {
      method: method,
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {

        setPost(data);
      })
      .catch(error => console.error('Error toggling like:', error));
  };

  const handleDeletePost = () => {
    const token = localStorage.getItem('token');
    const method = 'DELETE';
    fetch(`${API_BASE_URL}posts/${postId}/delete/`, {
      method: method,
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
    .then(response => {
      if (response.ok) {
        // Successful deletion (status 204)
        if(originalUrl){
          window.location.href = originalUrl;
        } else {
          navigate('/profile');
        }
      } else {
        // Non-successful response (status other than 204)
        throw new Error('Network response was not ok');
      }
    })
    .catch(error => {
      console.error('Error deleting post:', error);
      alert("Couldn't delete post. Please try again!");
    });
      
  };


  const myUsernameIsNotSameUser = (thisUser) => {
    return !(user.username === thisUser);
  }

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    // Assuming 'content' and 'uploadedMedia' are variables containing your data
    const formData = new FormData();
    formData.append('text', commentText);
    formData.append('post_id', postId);

    fetch(`${API_BASE_URL}posts/${post.id}/comment/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`, // Use 'Authorization' header for the token
      },
      body: formData, // Use FormData to send both 'text' and 'media' fields
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the post state with the new comment
        setCommentText('');
        setPost((prevPost) => ({
          ...prevPost,
          comments: [...prevPost.comments, data], // assuming data is the new comment object
        }));
      })
      .catch((error) => console.error('Error creating post:', error));
    navigate();
  };


  const renderMediaContent = (mediaFile, onEnded) => {
    if (mediaFile.media_type === 'mp4') {
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


  return (
    <div className={`expanded${postIdForOverlay ? '-overlay' : '-non-overlay'}`} onClick={handleCloseExpandPostOverlay}>
      <div className="expanded-post-container" onClick={(e) => e.stopPropagation()}>
        <span className="expanded-close-button" onClick={handleCloseExpandPostOverlay}>&times;</span>
        {post ? (
          <div className="expanded-post-content">


            <div className={`expanded-post-area-media-and-info${postIdForOverlay ? '' : '-non-overlay'}`}>

              <div className="expanded-post-user-info-and-comments">

                <div className="expanded-post-user-info">
                  <div className='expanded-post-info-profile-picture'>
                    <a href={myUsernameIsNotSameUser(post.user.username) ? `http://localhost:3000/profile/${post.user.username}` : `http://localhost:3000/profile`}>
                      <img src={`${API_BASE_URL}${post.user.profile_picture}`} alt={post.user.username} />
                    </a>
                  </div>
                  <div className='expanded-post-info-username'>
                    <a href={myUsernameIsNotSameUser(post.user.username) ? `http://localhost:3000/profile/${post.user.username}` : `http://localhost:3000/profile`}>
                      <p className="username">{post.user.username}</p>
                    </a>
                  </div>
                </div>

                <div className='expanded-post-comments-area'>
                  {post.text !== "" &&
                    <div className='expanded-post-caption'>
                      <p>{post.text}</p>
                    </div>
                  }
                  {post.comments.length ?
                    (
                      <div className="expanded-post-comments">
                        {post.comments.map((comment) =>
                          <div className="expanded-post-each-comment">
                            <div className='expanded-post-comment-by-user'>
                              <div className='expanded-post-comment-user-info'>
                                <a href={`${CLIENT_BASE_URL}/personal/profile/${post.user.username}`}>
                                  <div className='expanded-post-info-profile-picture'>
                            <ProfilePicture src={comment.user.profile_picture} />
                                  </div>
                                  <div className='expanded-post-user-info-post-comment-text'>
                                    {comment.user.username}
                                  </div>
                                </a>
                                <div className='comment-stats-info-container'>
                                  {`Posted ${timeAgo(comment.created_at)}`}
                                </div>
                              </div>
                              <div className='comment-text-container'>
                                <p>{comment.text}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`expanded-post-comments-no-comments${post.text !== "" ? '-no-caption' : ''}`}>
                        <p>No Comments</p>
                      </div>
                    )
                  }
                </div>

                <div className="expanded-post-write-comment">
                  <input
                    placeholder='Comment here...'
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></input>
                  <button onClick={handleCommentSubmit}>Post</button>
                </div>


              </div>

              <div className="expanded-container">
                <div className='expanded-post-stats-container-top'>

                  <div className="expanded-post-info-timestamp">
                    {`Posted ${timeAgo(post.created_at)}`}
                  </div>
                  <div className="expanded-post-info-counts">
                    <p className="expanded-post-info-count-likes" onClick={() => setShowLikesOverlay(!showLikesOverlay)}>
                      {`${post.likes.length} likes`}
                    </p>
                    <p className="expanded-post-info-count-likes" onClick={() => setShowDislikesOverlay(!showDislikesOverlay)}>
                      {`${post.dislikes.length} dislikes`}
                    </p>
                    <p>
                      {`${post.comments.length} comments`}
                    </p>
                  </div>

                </div>
                {/* Media container */}
                <div className={`expanded-media${postIdForOverlay ? '' : '-non-overlay'}`}>

                  <div className='expanded-post-previous-next-media-buttons'>
                    <div className={`expanded-post-previous-media-button${post.media_files[currentMediaIndex].media_type === 'mp4' ? '-video' : '' }`}>
                      {currentMediaIndex !== 0 &&
                        <button onClick={handlePreviousMedia}>&lt;</button>
                      }
                    </div>
                    <div className={`expanded-post-next-media-button${post.media_files[currentMediaIndex].media_type === 'mp4' ? '-video' : '' }`}>
                      {currentMediaIndex !== (post.media_files.length - 1) &&
                        <button onClick={handleNextMedia}>&gt;</button>
                      }
                    </div>
                  </div>

                  <div className='expanded-post-each-media'>
                    {post.media_files.length > 0 && renderMedia &&
                      renderMediaContent(post.media_files[currentMediaIndex], null)
                    }
                  </div>

                </div>

              </div>


              <div className='expanded-info'>

                <div className="expanded-post-info">
                  <div className="expanded-post-user-interact">
                    <div onClick={handleLikeAndUnlike} className='expanded-post-unlike-img'>
                      {isLiked ?
                        <img src={likedImg} alt="Like"></img>
                        :
                        <img src={unlikedImg} alt="Unlike"></img>
                      }
                    </div>
                    <div onClick={handleDislikeandUndislike} className='expanded-post-like-img'>
                      {isDisliked ?
                        <img src={dislikedImg} alt="Dislike"></img>
                        :
                        <img src={undislikedImg} alt="Undislike"></img>
                      }
                    </div>
                    {(user.username === post.user.username) &&
                      <div onClick={handleDeletePost} className='expanded-delete-post'>
                        <i className='fa fa-trash' id="delete-icon" />
                      </div>
                    }
                  </div>
                </div>

              </div>

            </div>


          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {showLikesOverlay && (
        <UserListOverlay userList={post.likes} onClose={handleCloseOverlay} title={'Likes'} username={user.username} />
      )}
      {showDislikesOverlay && (
        <UserListOverlay userList={post.dislikes} onClose={handleCloseOverlay} title={'Dislikes'} username={user.username} />
      )}
    </div>
  );
};

export default ExpandedPost;