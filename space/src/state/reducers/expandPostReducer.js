// expandPostReducer.js
const initialState = {
    expandPostIdReciever: null,
    currentExpandPostIndex: null,
    postsList: [],
    showPreviousPostButton: true,
    showNextPostButton: true,
    expandPostOnCloseUrl: null
};

const expandPostReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_EXPAND_POST':
            return {
                ...state,
                expandPostIdReciever: action.payload.expandPostIdReciever,
                currentExpandPostIndex: action.payload.currentExpandPostIndex,
                postsList: action.payload.postsList,
                showPreviousPostButton: action.payload.showPreviousPostButton,
                showNextPostButton: action.payload.showNextPostButton,
                expandPostOnCloseUrl: action.payload.expandPostOnCloseUrl
            };
        case 'SET_PREVIOUS_NEXT_BUTTONS':
            return {
                ...state,
                showPreviousPostButton: action.payload.showPreviousPostButton,
                showNextPostButton: action.payload.showNextPostButton
            };
        default:
            return state;
    }
};

export default expandPostReducer;
