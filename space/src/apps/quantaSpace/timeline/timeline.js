import React, { useEffect, useState } from "react";
import './timeline.css';
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useApi from "../../../utils/useApi";
import PacketCard from "./packetCard/packetCard";

const QunataTimeline = () => {
    const navigate = useNavigate();
    const { callApi } = useApi();
    const [packetsList, setPacketsList] = useState([]);
    const [activeTab, setActiveTab] = useState('feed');
    const location = useLocation();

    const fetchPacketsList = async () => {
        try {
            const response = await callApi(`quantaspace/timeline/packets-list/`);
            console.log(response.data);
            setPacketsList(response.data);
        } catch (err) {
            console.error('Error fetching packet data', err);
        }
    }

    useEffect(() => {
        fetchPacketsList();
    }, []);

    useEffect(() => {
        // Set the active tab based on the URL hash or default to 'feed'
        const hash = location.hash.replace('#', ''); // Remove the '#' symbol
        setActiveTab(hash || 'feed'); // Default to 'feed' if no hash is present
    }, [location]);

    return (
        <div className="quanta-timeline-page">
            <div className="quanta-timeline-packet-card">
                <div className="quanta-timeline-packet-card-top-panel">
                    <Link
                        to={'#feed'}
                        className={activeTab === 'feed' ? 'active-tab' : ''}
                    >
                        Feed
                    </Link>
                    <Link
                        to={'#reccomended'}
                        className={activeTab === 'reccomended' ? 'active-tab' : ''}
                    >
                        Reccomended
                    </Link>
                </div>
                <div className="quanta-timeline-packet-card-inner">
                    {activeTab === 'feed' ?
                        (
                            packetsList.map((packet, index) => (
                                <PacketCard packet={packet} key={index} />
                            ))
                        ) : (
                            (
                                // packetsList.map((packet, index) => (
                                //     <PacketCard packet={packet} key={index} />
                                // ))
                                <div>
                                    </div>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
};

export default QunataTimeline;