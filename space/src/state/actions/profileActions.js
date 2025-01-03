import { fetchMinimalProfileData } from '../services/profileService';
import { setMinimalProfileData, setProfileLoading, setProfileError } from '../reducers/profileSlice';

export const loadMinimalProfileData = () => async (dispatch, getState, { callApi }) => {
    dispatch(setProfileLoading());
    try {
        const data = await fetchMinimalProfileData(callApi);
        dispatch(setMinimalProfileData(data));
    } catch (error) {
        dispatch(setProfileError(error.message));
    }
};
