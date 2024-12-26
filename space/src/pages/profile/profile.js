import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import OtherProfile from "./otherProfile/otherProfile";
import { useAuth } from "../../reducers/auth/useAuth";
import MyProfile from "./myProfile/myProfile";
import useApi from "../../utils/useApi";

const Profile = () => {
    const { username } = useParams();
    const { authState } = useAuth();
    const { callApi } = useApi();

    const fetchProfileData = async (username, setProfileInfo) => {
        if (!username) return;
        try {
            const response = await callApi(`profile/${username}/`);
            console.log(response.data);
            setProfileInfo(response.data);
        } catch (err) {
            console.error('Erre fetching profile data', err);
        }
    };

    useEffect(() => {
        if (!username || authState.user.username === username || window.location.pathname === "/profile") {
            window.history.replaceState(null, "", "/profile");
        }
    }, []);


    return (!username || authState.user.username === username || window.location.pathname === "/profile") ? (
        <MyProfile username={username} fetchProfileData={fetchProfileData} />
    ) : (
        <OtherProfile username={username} fetchProfileData={fetchProfileData} />
    );

};

export default Profile;