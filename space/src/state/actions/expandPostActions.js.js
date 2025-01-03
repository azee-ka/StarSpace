// actions/expandPostActions.js
import { setExpandPostState, setShowPreviousPostButton, setShowNextPostButton, setCurrentExpandPostIndex } from '../state/reducers/expandPostSlice'; 

export const handleExpandPostOpen = (dispatch, postIdToExpand, posts, originalPreviousUrl, index) => {
    dispatch(setExpandPostState({ postIdToExpand, posts, originalPreviousUrl, index }));
    window.history.replaceState(null, null, `/radianspace/flare/${postIdToExpand}`);
};

export const handlePreviousPostClick = (dispatch, postsList, currentExpandPostIndex, expandPostOnCloseUrl) => {
    if (currentExpandPostIndex > 0) {
        const newIndex = currentExpandPostIndex - 1;
        dispatch(setCurrentExpandPostIndex(newIndex));
        dispatch(setExpandPostState({
            postIdToExpand: postsList[newIndex].uuid,
            posts: postsList,
            originalPreviousUrl: expandPostOnCloseUrl,
            index: newIndex,
        }));
    } else {
        dispatch(setShowPreviousPostButton(false));
    }
};

export const handleNextPostClick = (dispatch, postsList, currentExpandPostIndex, expandPostOnCloseUrl) => {
    if (currentExpandPostIndex < postsList.length - 1) {
        const newIndex = currentExpandPostIndex + 1;
        dispatch(setCurrentExpandPostIndex(newIndex));
        dispatch(setExpandPostState({
            postIdToExpand: postsList[newIndex].uuid,
            posts: postsList,
            originalPreviousUrl: expandPostOnCloseUrl,
            index: newIndex,
        }));
    } else {
        dispatch(setShowNextPostButton(false));
    }
};
