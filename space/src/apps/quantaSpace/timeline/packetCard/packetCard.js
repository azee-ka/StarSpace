import React from "react";
import './packetCard.css';
import { useNavigate, useParams } from "react-router-dom";
import ProfilePicture from "../../../../utils/profilePicture/getProfilePicture";
import DOMPurify from 'dompurify';
import { FaBookmark, FaEllipsisV, FaHeart, FaReply, FaShareAlt, FaThumbsDown, FaThumbsUp } from "react-icons/fa";

const PacketCard = ({ packet }) => {
    return (
        <div className="quanta-timeline-packet-card-per-item">
            <div className="quanta-timeline-packet-info">
                <div className="quanta-timeline-packet-author-panel">
                    <div className="quanta-timeline-packet-author">
                        <ProfilePicture src={packet?.author?.profile_image} />
                        <p>@{packet?.author?.username}</p>
                    </div>
                    <div className="quanta-timeline-packet-personal-action-btns">
                        <button>
                            <FaShareAlt className="icon-style" />
                        </button>
                        <button>
                            <FaBookmark className="icon-style" />
                        </button>
                        <button>
                            <FaEllipsisV className="icon-style" />
                        </button>
                    </div>
                </div>
                <div className="quanta-timeline-packet-content">
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(packet?.content) }} />
                </div>
            </div>
            <div className="quanta-timeline-packet-interaction">
                <button>
                    <FaThumbsUp className="icon-style" />
                    <p>{packet?.likes_count}0</p>
                </button>
                <button>
                    <FaThumbsDown className="icon-style" />
                    <p>{packet?.dislikes_count}0</p>
                </button>
                <button>
                    <FaReply className="icon-style" />
                    <p>{packet?.replies_count}0</p>
                </button>
                <button>
                    <FaHeart className="icon-style" />
                    <p>{packet?.favorites_count}0</p>
                </button>
            </div>
        </div>
    )
}

export default PacketCard;