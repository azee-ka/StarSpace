// personalProfile.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './postGrid.css';
import API_BASE_URL from '../../../../apiUrl';
import VideoPlayer from '../../utils/videoPlayer';

const PostsGrid = ({ classname, postsData, handleExpandPostOpen }) => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState(postsData);

  useEffect(() => {
    setPosts(postsData);
  }, [postsData]);

  const handlePostClick = (post, index) => {
    console.log(post);
    handleExpandPostOpen(post.uuid, posts, window.location.pathname, index);
  };


  return posts ? (
    <div className='post-for-grid'>
        {posts.map((post, index) => (
          <div className='per-post-grid' key={`${index}-${post.id}`} onClick={() => handlePostClick(post, index)}>
            <div className='grid-per-post' >
              {post.thumbnail.media_type === 'mp4' || post.thumbnail.media_type === 'MOV' ? (
                <VideoPlayer
                  mediaFile={post.thumbnail}
                  onEnded={null}
                  playable={false}
                />
              ) : (
                <img src={`${API_BASE_URL}${post.thumbnail.file}`} alt={post.id} />
              )}
            </div>
          </div>
        ))}
    </div>
  ) : (
    <div>Loading...</div>
  )
}

export default PostsGrid;