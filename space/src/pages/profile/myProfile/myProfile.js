import React, { useEffect, useState } from "react";
import './myProfile.css';
import useApi from "../../../utils/useApi";
import ProfilePicture from "../../../utils/profilePicture/getProfilePicture";
import { Link } from "react-router-dom";
import RightPanel from "./rightPanel";

const MyProfile = () => {
    const { callApi } = useApi();

    const [profileInfo, setProfileInfo] = useState({});


    useEffect(() => {
        const fetchProfileData = async () => {
            const response = await callApi(`profile/get-user-info/`);
            console.log(response.data);
            setProfileInfo(response.data);
        };

        fetchProfileData();
    }, []);
    
    return (
        <div className="my-profile-page">
            <div className="my-profile-left-panel">
                <div className="my-profile-user-info">
                    <div className="my-profile-user-profile-picture">
                        <ProfilePicture src={profileInfo?.profile_picture} />
                    </div>
                    <Link href={`profile/${profileInfo?.username}`} className="my-profile-user-username">
                        <p>@{profileInfo?.username}</p>
                    </Link>
                    <div className="my-profile-user-stats">
                        <h3>Stats</h3>
                        <button>
                            <p>{profileInfo?.followers_count}0</p>
                            <p>Followers</p>
                        </button>
                        <button>
                            <p>{profileInfo?.followers_count}0</p>
                            <p>Following</p>
                        </button>
                        <button>
                            <p>{profileInfo?.cotributions_count}0</p>
                            <p>Contributions</p>
                        </button>
                    </div>
                </div>
                <div className="my-profile-metrics-container">
                    <h3>Metrics</h3>
                    <div className="my-profile-metrics-collection">
                        <div>
                            <p>0</p>
                            <p>Impact Score</p>
                        </div>
                        <div>
                            <p>0</p>
                            <p>Impact Score</p>
                        </div>
                        <div>
                            <p>0</p>
                            <p>Impact Score</p>
                        </div>
                        <div>
                            <p>0</p>
                            <p>Impact Score</p>
                        </div>
                        <div>
                            <p>0</p>
                            <p>Impact Score</p>
                        </div>
                        <div>
                            <p>0</p>
                            <p>Impact Score</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-profile-right-panel">
                <RightPanel profileInfo={profileInfo} />
            </div>
        </div>
    )
}

export default MyProfile;