// reducers/expandPostSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    expandPostId: null,
    currentExpandPostIndex: null,
    postsList: [],
    showPreviousPostButton: true,
    showNextPostButton: true,
    expandPostOnCloseUrl: null,
};

const expandPostSlice = createSlice({
    name: 'expandPost',
    initialState,
    reducers: {
        setExpandPostState(state, action) {
            const { postIdToExpand, posts, originalPreviousUrl, index } = action.payload;
            state.expandPostId = postIdToExpand;
            state.postsList = posts;
            state.expandPostOnCloseUrl = originalPreviousUrl;
            state.currentExpandPostIndex = index;
            state.showPreviousPostButton = index > 0;
            state.showNextPostButton = index < posts.length - 1;
        },
        setShowPreviousPostButton(state, action) {
            state.showPreviousPostButton = action.payload;
        },
        setShowNextPostButton(state, action) {
            state.showNextPostButton = action.payload;
        },
        setCurrentExpandPostIndex(state, action) {
            state.currentExpandPostIndex = action.payload;
        },
    },
});

export const {
    setExpandPostState,
    setShowPreviousPostButton,
    setShowNextPostButton,
    setCurrentExpandPostIndex,
} = expandPostSlice.actions;

export const selectExpandPostState = (state) => state.expandPost;
export const selectExpandPostId = (state) => state.expandPost.expandPostId;
export const selectExpandPostIndex = (state) => state.expandPost.currentExpandPostIndex;
export const selectPostsList = (state) => state.expandPost.postsList;
export const selectShowPreviousPostButton = (state) => state.expandPost.showPreviousPostButton;
export const selectShowNextPostButton = (state) => state.expandPost.showNextPostButton;
export const selectExpandPostOnCloseUrl = (state) => state.expandPost.expandPostOnCloseUrl;

export default expandPostSlice.reducer;
