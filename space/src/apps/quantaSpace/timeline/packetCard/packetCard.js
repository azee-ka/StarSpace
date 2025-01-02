import React from "react";
import './packetCard.css';
import { useNavigate, useParams } from "react-router-dom";
import ProfilePicture from "../../../../utils/profilePicture/getProfilePicture";
import DOMPurify from 'dompurify';
import { FaBookmark, FaHeart, FaReply, FaShareAlt, FaThumbsDown, FaThumbsUp } from "react-icons/fa";

const PacketCard = ({ packet }) => {
    return (
        <div className="quanta-timeline-packet-card-per-item">
            <div className="quanta-timeline-packet-info">
                <div className="quanta-timeline-packet-author-panel">
                    <div className="quanta-timeline-packet-author">
                        <ProfilePicture src={packet?.author?.profile_image} />
                        <p>@{packet?.author?.username}</p>
                    </div>
                </div>
                <div className="quanta-timeline-packet-content">
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(packet?.content) }} />
                </div>
            </div>
            <div className="quanta-timeline-packet-interaction">
                <button>
                    <FaThumbsUp className="icon-style" />
                </button>
                <button>
                    <FaThumbsDown className="icon-style" />
                </button>
                <button>
                    <FaReply className="icon-style" />
                </button>
                <button>
                    <FaHeart className="icon-style" />
                </button>
                <button>
                    <FaShareAlt className="icon-style" />
                </button>
                <button>
                    <FaBookmark className="icon-style" />
                </button>
            </div>
        </div>
    )
}

export default PacketCard;