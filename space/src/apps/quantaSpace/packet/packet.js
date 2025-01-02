import React, { useEffect, useState } from "react";
import './packet.css';
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../../utils/useApi";
import ProfilePicture from "../../../utils/profilePicture/getProfilePicture";
import DOMPurify from 'dompurify';
import { FaArrowLeft, FaBookmark, FaHeart, FaReply, FaRetweet, FaShareAlt, FaThumbsDown, FaThumbsUp } from "react-icons/fa";

const Packet = () => {
    const navigate = useNavigate();
    const { packetId } = useParams();
    const { callApi } = useApi();
    const [packetData, setPacketData] = useState({});

    const fetchPacketData = async () => {
        try {
            const response = await callApi(`quantaspace/packet/${packetId}`);
            console.log(response.data);
            setPacketData(response.data);
        } catch (err) {
            console.error('Error fetching packet data', err);
        }
    }

    useEffect(() => {
        fetchPacketData();
    }, []);

    return (
        <div className="packet-page">
            <div className="packet-card">
                <div className="packet-card-top-panel">
                    <div className="packet-card-back-btn">
                        <button onClick={() => navigate('/quantaspace/timeline')}>
                            <FaArrowLeft className="icon-style" />
                        </button>
                        <p>Post</p>
                    </div>
                </div>
                <div className="packet-card-inner">
                    <div className="packet-card-per-item">
                        <div className="packet-info">
                            <div className="packet-author-panel">
                                <div className="packet-author">
                                    <ProfilePicture src={packetData?.author?.profile_image} />
                                    <p>@{packetData?.author?.username}</p>
                                </div>
                            </div>
                            <div className="packet-content">
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(packetData?.content) }} />
                            </div>
                        </div>
                        <div className="packet-interaction">
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
                </div>
            </div>
        </div>
    );
};

export default Packet;