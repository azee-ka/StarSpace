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
            try {
                const response = await callApi(`profile/get-user-info/`);
                console.log(response.data);
                setProfileInfo(response.data);
            } catch (err) {
                console.error('Erre fetching profile data', err);
            }
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
                        <div className="my-profile-user-stat-counts">
                            <button>
                                <p>{profileInfo?.followers_count}0</p>
                                <p>Followers</p>
                            </button>
                            <button>
                                <p>{profileInfo?.followers_count}0</p>
                                <p>Following</p>
                            </button>
                        </div>
                        <div className="my-profile-user-stat-counts">
                            <button>
                                <p>{profileInfo?.affiliated_count}0</p>
                                <p>Affiliations</p>
                            </button>
                            <button>
                                <p>{profileInfo?.affiliated_count}0</p>
                                <p>Affiliations</p>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="my-profile-metrics-container">
                    <section>
                        <h3>Stats</h3>
                        <div className="my-profile-metrics-stats">
                            <div>
                                <p>{profileInfo?.entries_count}0</p>
                                <p>Entries</p>
                            </div>
                            <div>
                                <p>{profileInfo?.posts_count}0</p>
                                <p>Posts</p>
                            </div>
                            <div>
                                <p>{profileInfo?.spaces_count}0</p>
                                <p>Spaces</p>
                            </div>
                        </div>
                    </section>
                    <section>
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
                    </section>
                </div>
            </div>
            <div className="my-profile-right-panel">
                <RightPanel profileInfo={profileInfo} />
            </div>
        </div>
    )
}

export default MyProfile;