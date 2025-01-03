import React, { useEffect, useState } from "react";
import './myProfile.css';
import useApi from "../../../utils/useApi";
import ProfilePicture from "../../../utils/profilePicture/getProfilePicture";
import { Link, useNavigate } from "react-router-dom";
import RightPanel from "./panels/rightPanel";
import { useAuth } from "../../../hooks/useAuth";
import { FaCog } from "react-icons/fa";
import UserListOverlay from "../../../apps/radianSpace/utils/userListOverlay/userListOverlay";

const MyProfile = ({ username, fetchProfileData, isCustomizing }) => {
    const navigate = useNavigate();
    const { authState } = useAuth();
    const [profileInfo, setProfileInfo] = useState({});

    const [showFollowersListOverlay, setShowFollowersListOverlay] = useState(false);
    const [showFollowingListOverlay, setShowFollowingListOverlay] = useState(false);
    const [showAffiliationsListOverlay, setShowAffiliationsListOverlay] = useState(false);

    useEffect(() => {
        fetchProfileData(username || authState.user.username, setProfileInfo);
    }, [username]);

    return !isCustomizing ? (
        <div className="my-profile-page">
            <div className="my-profile-left-panel">
                <div className="my-profile-user-info">
                    <FaCog className="icon-style" onClick={() => navigate('/settings#profile-basic-info')} />
                    <div className="my-profile-user-profile-picture">
                        <ProfilePicture src={profileInfo?.basicInfo?.profile_image} />
                    </div>
                    <Link href={`profile/${profileInfo?.basicInfo?.username}`} className="my-profile-user-username">
                        <p>@{profileInfo?.basicInfo?.username}</p>
                    </Link>
                    <div className="my-profile-user-stats">
                        <div className="my-profile-user-stat-counts">
                            <button onClick={() => setShowFollowersListOverlay(true)}>
                                <p>{profileInfo?.stats?.followers_count}</p>
                                <p>Followers</p>
                            </button>
                            <button onClick={() => setShowFollowingListOverlay(true)}>
                                <p>{profileInfo?.stats?.following_count}</p>
                                <p>Following</p>
                            </button>
                        </div>
                        <div className="my-profile-user-stat-counts">
                            <button onClick={() => setShowAffiliationsListOverlay(true)}>
                                <p>{profileInfo?.stats?.affiliated_count}0</p>
                                <p>Affiliations</p>
                            </button>
                            <button onClick={() => setShowAffiliationsListOverlay(true)}>
                                <p>{profileInfo?.stats?.affiliated_count}0</p>
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
                                <p>{profileInfo?.stats?.entries_count}</p>
                                <p>Entries</p>
                            </div>
                            <div>
                                <p>{profileInfo?.stats?.posts_count}0</p>
                                <p>Posts</p>
                            </div>
                            <div>
                                <p>{profileInfo?.stats?.spaces_count}0</p>
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
            {showFollowersListOverlay &&
                <UserListOverlay userList={null} onClose={() => setShowFollowersListOverlay(false)} title={'Followers'} />
            }
            {showFollowingListOverlay &&
                <UserListOverlay userList={null} onClose={() => setShowFollowingListOverlay(false)} title={'Following'} />
            }
            {showAffiliationsListOverlay &&
                <UserListOverlay userList={null} onClose={() => setShowAffiliationsListOverlay(false)} title={'Affiliations'} />
            }
        </div>
    ) : (
        <div>Cutsom Self</div>
    )
}

export default MyProfile;