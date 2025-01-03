import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import OtherProfile from "./otherProfile/otherProfile";
import { useAuth } from "../../hooks/useAuth";
import MyProfile from "./myProfile/myProfile";
import useApi from "../../utils/useApi";
import { useSubApp } from "../../context/SubAppContext";

const Profile = ({ enforceViewType = '', isCustomizing = false }) => {
    const { username } = useParams();
    const { authState } = useAuth();
    const { callApi } = useApi();
    const { setActiveSubApp } = useSubApp();

    const fetchProfileData = async (username, setProfileInfo) => {
        // if (!username) return;
        try {
            const response = await callApi(`profile/${username}/`);
            console.log(response.data);
            setProfileInfo(response.data);
        } catch (err) {
            console.error('Erre fetching profile data', err);
        }
    };

    useEffect(() => {
        if (enforceViewType === '' && (!username || authState.user.username === username || window.location.pathname === "/profile")) {
            window.history.replaceState(null, "", "/profile");
        }
        setActiveSubApp('Central');
    }, []);


    return enforceViewType === '' ? (
        (!username || authState.user.username === username || window.location.pathname === "/profile") ? (
        <MyProfile username={username} fetchProfileData={fetchProfileData} isCustomizing={isCustomizing} />
    ) : (
        <OtherProfile username={username} fetchProfileData={fetchProfileData} isCustomizing={isCustomizing} />
    )
    ) : (
        enforceViewType === 'self' ? (
            <MyProfile username={authState.user.username} fetchProfileData={fetchProfileData} isCustomizing={isCustomizing} />
        ) : (
            <OtherProfile username={authState.user.username} fetchProfileData={fetchProfileData} enforceViewType={enforceViewType} isCustomizing={isCustomizing} />
        )
    )

};

export default Profile;