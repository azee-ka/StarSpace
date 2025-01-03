import { useDispatch, useSelector } from 'react-redux';
import { loadMinimalProfileData } from '../state/actions/profileActions';  // Action to fetch profile data
import { selectMinimalProfileData, selectIsProfileLoading, selectProfileError } from '../state/reducers/profileSlice';  // Selectors

const useProfile = () => {
    const dispatch = useDispatch();
    const minimalProfileData = useSelector(selectMinimalProfileData);  // Get profile data from Redux state
    const isLoading = useSelector(selectIsProfileLoading);  // Get loading state from Redux
    const error = useSelector(selectProfileError);  // Get error state from Redux

    const fetchProfile = () => {
        dispatch(loadMinimalProfileData());  // Dispatch action to load profile data
    };

    return { minimalProfileData, isLoading, error, fetchProfile };
};

export default useProfile;