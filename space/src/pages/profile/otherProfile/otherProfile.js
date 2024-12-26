import React, { useEffect, useState } from "react";
import useApi from "../../../utils/useApi";
import { useAuth } from "../../../reducers/auth/useAuth";
import PartialProfile from "./partialProfile/partialProfile";
import FullProfile from "./fullProfile/fullProfile";
import { useLocation } from "react-router-dom";

const OtherProfile = ({ username, fetchProfileData }) => {
    const [profileInfo, setProfileInfo] = useState({});
    const location = useLocation();

    useEffect(() => {
        if (location.state?.refreshed) {
            fetchProfileData(username, setProfileInfo);
        }
    }, [location.state]);

    useEffect(() => {
            fetchProfileData(username, setProfileInfo);
    }, []);

    return profileInfo?.view_type === 'partial' ? (
        <PartialProfile profileInfo={profileInfo} />
    ) : (
        <FullProfile profileInfo={profileInfo} />
    )
}

export default OtherProfile;