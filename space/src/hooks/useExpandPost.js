// hooks/useExpandPost.js
import { useDispatch, useSelector } from 'react-redux';
import { handleExpandPostOpen, handlePreviousPostClick, handleNextPostClick } from '../state/actions/expandPostActions'; // Import actions
import {
    selectExpandPostId,
    selectCurrentExpandPostIndex,
    selectPostsList,
    selectShowPreviousPostButton,
    selectShowNextPostButton,
    selectExpandPostOnCloseUrl,
} from '../state/reducers/expandPostSlice'; // Import selectors

const useExpandPost = () => {
    const dispatch = useDispatch();

    // Accessing state from Redux store
    const expandPostId = useSelector(selectExpandPostId);
    const currentExpandPostIndex = useSelector(selectCurrentExpandPostIndex);
    const postsList = useSelector(selectPostsList);
    const showPreviousPostButton = useSelector(selectShowPreviousPostButton);
    const showNextPostButton = useSelector(selectShowNextPostButton);
    const expandPostOnCloseUrl = useSelector(selectExpandPostOnCloseUrl);

    // Actions wrapped in the hook for convenience
    const openPost = (postIdToExpand, posts, originalPreviousUrl, index) => {
        handleExpandPostOpen(dispatch, postIdToExpand, posts, originalPreviousUrl, index);
    };

    const goToPreviousPost = () => {
        handlePreviousPostClick(dispatch, postsList, currentExpandPostIndex, expandPostOnCloseUrl);
    };

    const goToNextPost = () => {
        handleNextPostClick(dispatch, postsList, currentExpandPostIndex, expandPostOnCloseUrl);
    };

    return {
        expandPostId,
        postsList,
        showPreviousPostButton,
        showNextPostButton,
        expandPostOnCloseUrl,
        openPost,
        goToPreviousPost,
        goToNextPost,
    };
};

export default useExpandPost;
