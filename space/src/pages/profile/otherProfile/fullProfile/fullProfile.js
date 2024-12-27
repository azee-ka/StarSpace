import React, { useEffect, useState } from "react";
import './fullProfile.css';
import ProfilePicture from "../../../../utils/profilePicture/getProfilePicture";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../../../../utils/useApi";
import FullProfileRightPanel from "./panels/rightPanel/rightPanel";

const FullProfile = ({ profileInfo, isCustomizing }) => {
    const { callApi } = useApi();
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(profileInfo?.interact?.is_following);

    useEffect(() => {
        setIsFollowing(profileInfo?.interact?.is_following);
    }, [profileInfo]);

    const handleFollowProfile = async () => {
        try {
            setIsFollowing(prevState => !prevState);
            const response = await callApi(`profile/follow-toggle/${profileInfo?.basicInfo?.username}/`, 'POST');
            console.log(response.data);
            navigate(`/profile/${profileInfo?.basicInfo?.username}`, { state: { refreshed: true } });
        } catch (err) {
            console.error('Error toggling follow', err);
            setIsFollowing(prevState => !prevState);
        }
    };

    return !isCustomizing ? (
        <div className="full-profile-page">
            <div className="full-profile-left-panel">
                <div className="full-profile-user-info">
                    <div className="full-profile-user-info-profile-picture">
                        <ProfilePicture src={profileInfo?.basicInfo?.profile_image} />
                    </div>
                    <div className="full-profile-user-info-username">
                        <Link to={`/profile/${profileInfo?.basicInfo?.username}`}>
                            <p>@{profileInfo?.basicInfo?.username}</p>
                        </Link>
                    </div>
                    <div className="full-profile-user-info-stats">
                        <div className="full-profile-user-info-stats-count">
                            <button>
                                <p>{profileInfo?.stats?.followers_count} followers</p>
                            </button>
                            <button>
                                <p>{profileInfo?.stats?.following_count} following</p>
                            </button>
                        </div>
                        <div className="full-profile-user-info-stats-count">
                            <button>
                                <p>{profileInfo?.stats?.followers_count} Contributions</p>
                            </button>
                            <button>
                                <p>{profileInfo?.stats?.following_count} Affiliations</p>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="full-profile-interact">
                    <div className="full-profile-interact-follow-btn">
                        <button onClick={() => handleFollowProfile()}>
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    </div>
                    <div className="full-profile-interact-message-btn">
                        <button>
                            Message
                        </button>
                    </div>
                </div>
                <div className="full-profile-metrics">
                    <section>
                        <h3>Metrics</h3>
                        <div>

                        </div>
                    </section>
                </div>
            </div>
            <div className="full-profile-right-panel">
                <FullProfileRightPanel profileInfo={profileInfo} />
            </div>
        </div>
    ) : (
        <div>Custom Full</div>
    )
};

export default FullProfile;