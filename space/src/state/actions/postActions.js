// actions.js
export const setExpandPost = (postId) => ({
    type: 'SET_EXPAND_POST',
    payload: postId
  });
  
  export const setShowPreviousPostButton = (value) => ({
    type: 'SET_SHOW_PREVIOUS_POST_BUTTON',
    payload: value
  });
  
  export const setShowNextPostButton = (value) => ({
    type: 'SET_SHOW_NEXT_POST_BUTTON',
    payload: value
  });
  
  export const setPostsList = (posts) => ({
    type: 'SET_POSTS_LIST',
    payload: posts
  });
  
  // You can define more actions as necessary.
  