import React, { createContext, useContext, useState, useEffect } from 'react';
import useApi from '../../../../utils/useApi';
import API_BASE_URL from '../../../../apiUrl';
import VideoPlayer from '../../utils/videoPlayer';
const PostContext = createContext();

export const PostProvider = ({ children, postId }) => {
    const { callApi } = useApi();

    // States managed by the PostProvider
    const [post, setPost] = useState(null); // Complete post data
    const [postLiked, setPostLiked] = useState(false);
    const [postDisliked, setPostDisliked] = useState(false);
    const [commentText, setCommentText] = useState(''); // Comment input
    const [showLikesOverlay, setShowLikesOverlay] = useState(false);
    const [showDislikesOverlay, setShowDislikesOverlay] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0); // Media navigation index

    // Fetch and set initial post data
    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await callApi(`radianspace/flare/${postId}/`);
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };

        const fetchInitialLikeStatus = async () => {
            try {
                const response = await callApi(`radianspace/flare/${postId}/like-status/`);
                const { liked, disliked } = response.data;
                setPostLiked(liked);
                setPostDisliked(disliked);
            } catch (error) {
                console.error('Error fetching like status:', error);
            }
        };

        if (postId) {
            fetchPostData();
            fetchInitialLikeStatus();
        }
    }, [postId]);

    // Toggle like status
    const toggleLike = async () => {
        try {
            const method = postLiked ? 'DELETE' : 'POST';
            const response = await callApi(`radianspace/flare/${postId}/like/`, method);
            setPostLiked(!postLiked);
            setPostDisliked(false);
            setPost(response.data);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    // Toggle dislike status
    const toggleDislike = async () => {
        try {
            const method = postDisliked ? 'DELETE' : 'POST';
            const response = await callApi(`radianspace/flare/${postId}/dislike/`, method);
            setPostDisliked(!postDisliked);
            setPostLiked(false);
            setPost(response.data);
        } catch (error) {
            console.error('Error toggling dislike:', error);
        }
    };

    // Add a comment
    const addComment = async () => {
        if (!commentText.trim()) return; // Prevent empty comments
        try {
            const formData = new FormData();
            formData.append('text', commentText);
            formData.append('post_id', postId);

            const response = await callApi(`radianspace/flare/${postId}/comment/`, 'POST', formData);
            setCommentText('');
            setPost((prev) => ({
                ...prev,
                comments: [...prev.comments, response.data],
            }));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Delete the post
    const deletePost = async () => {
        try {
            await callApi(`radianspace/flare/${postId}/delete/`, 'DELETE');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // Navigate media
    const navigateMedia = (direction) => {
        if (!post?.media_files) return;
        setCurrentMediaIndex((prevIndex) => {
            const maxIndex = post.media_files.length - 1;
            if (direction === 'next' && prevIndex < maxIndex) return prevIndex + 1;
            if (direction === 'prev' && prevIndex > 0) return prevIndex - 1;
            return prevIndex;
        });
    };

    // Render media content
    const renderMediaContent = () => {
        const mediaFile = post?.media_files?.[currentMediaIndex];
        if (!mediaFile) return null;

        if (mediaFile.media_type === 'mp4' || mediaFile.media_type === 'MOV') {
            return <VideoPlayer mediaFile={mediaFile} />;
        } else {
            return <img src={`${API_BASE_URL}${mediaFile.file}`} alt={mediaFile.id} />;
        }
    };

    const handleCloseLikesOverlay = () => {
        setShowLikesOverlay(false);
        setShowDislikesOverlay(false);
    }
    

    // Context value
    const value = {
        post,
        postLiked,
        postDisliked,
        commentText,
        showLikesOverlay,
        showDislikesOverlay,
        currentMediaIndex,
        setCommentText,
        setShowLikesOverlay,
        setShowDislikesOverlay,
        toggleLike,
        toggleDislike,
        addComment,
        deletePost,
        navigateMedia,
        renderMediaContent,
        handleCloseLikesOverlay,
    };

    return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

// Hook to use PostContext in components
export const usePostContext = () => useContext(PostContext);
