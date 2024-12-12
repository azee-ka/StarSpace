import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import OtherProfile from "./otherProfile/otherProfile";
import { useAuth } from "../../reducers/auth/useAuth";
import MyProfile from "./myProfile/myProfile";

const Profile = () => {
    const { username } = useParams();
    const { authState } = useAuth();

    useEffect(() => {
        if(authState.user.username === username) {
            window.history.replaceState(null, "", '/profile');
        }
    }, []);

    return authState.user.username === username ? (
        <OtherProfile username={username} />
    ) : (
        <MyProfile />
    )
};

export default Profile;