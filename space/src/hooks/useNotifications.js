// hooks/useNotifications.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadNotifications } from '../state/actions/notificationsActions'; // Action to load notifications
import { selectNotifications, selectNotificationsCount, selectNotificationsLoading, selectNotificationsError } from '../state/reducers/notificationsSlice'; // Selectors
import useApi from '../utils/useApi';

const useNotifications = () => {
    const dispatch = useDispatch();
    const { callApi } = useApi();

    // Select notifications and related state
    const notifications = useSelector(selectNotifications);
    const count = useSelector(selectNotificationsCount);
    const isLoading = useSelector(selectNotificationsLoading);
    const error = useSelector(selectNotificationsError);

    // Automatically load notifications when the hook is used
    useEffect(() => {
        dispatch(loadNotifications({ callApi })); // Pass callApi here
    }, [dispatch]);

    return { notifications, count, isLoading, error };
};

export default useNotifications;
