import React, { useState, useEffect } from "react";
import axios from "axios";
import "./exchange.css"; // Style for futuristic UI
import { useParams } from "react-router-dom";
import { useAuth } from "../../../reducers/auth/useAuth";
import API_BASE_URL from "../../../apiUrl";
import getConfig from "../../../config";
import { Doughnut } from 'react-chartjs-2';
import { FaChartBar, FaFlag, FaUsers, FaInfoCircle } from "react-icons/fa";

// Chart.js setup
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const ExchangePage = () => {
    const { authState } = useAuth();
    const config = getConfig(authState);
    const [exchange, setExchange] = useState(null);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { exchangeId } = useParams();

    useEffect(() => {
        const fetchExchange = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/openspace/exchange/${exchangeId}/`, config);
                setExchange(response.data);
                console.log(response.data)
                setLoading(false);
            } catch (err) {
                setError("Failed to load exchange data.");
                setLoading(false);
            }
        };

        const fetchEntries = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/openspace/exchange/${exchangeId}/entries/`, config);
                setEntries(response.data);
            } catch (err) {
                console.error("Failed to load entries.");
            }
        };

        fetchExchange();
        fetchEntries();
    }, [exchangeId]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    const metricsData = {
        labels: ["Positive Impact", "Negative Impact", "Neutral"],
        datasets: [
            {
                data: [60, 25, 15], // Example data
                backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
                hoverBackgroundColor: ["#81C784", "#E57373", "#FFD54F"],
            },
        ],
    };

    return (
        <div className="exchange-page">
            <div className='exchange-page-inner'>
                <div className="exchange-page-sidebar">
                    <div className="exchange-page-sidebar-inner">
                        <div className="exchange-sidebar-section">
                            <div className="exchange-sidebar-section-title">
                                <h4>Quick Navigation</h4>
                            </div>
                            <div className="exchange-sidebar-section-content">
                                <ul className="exchange-sidebar-links">
                                    <li><a href="#overview">Overview</a></li>
                                    <li><a href="#entries">Entries</a></li>
                                    <li><a href="#metrics">Metrics</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="exchange-sidebar-section">
                            <div className="exchange-sidebar-section-title">
                                <h4>Search Entries</h4>
                            </div>
                            <div className="exchange-sidebar-section-content">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="sidebar-search"
                                />
                            </div>
                        </div>
                        <div className="exchange-sidebar-section">
                            <div className="exchange-sidebar-section-title">
                                <h4>Trending Entries</h4>
                            </div>
                            <div className="exchange-sidebar-section-content">
                                <ul className="exchange-sidebar-section-trending-entries">
                                    <li><a href="/entry/1">Top Contribution of the Week</a></li>
                                    <li><a href="/entry/2">Most Discussed Entry</a></li>
                                    <li><a href="/entry/3">Editor's Pick</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="exchange-sidebar-section">
                            <div className="exchange-sidebar-section-title">
                                <h4>Your Contributions</h4>
                            </div>
                            <div className="exchange-sidebar-section-content">
                                <button className="exchange-sidebar-contribute-button">+ Add New Entry</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="exchange-page-content">
                    <div className="exchange-page-header">
                        <div className="exchange-page-header-inner">
                            <div className="exchange-page-header-title">
                                <h2>{exchange?.name}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="exchange-page-info">
                        <div className="exchange-page-info-inner">
                            <div className="exchange-header-description-card">
                                <div className="exchange-header-description-card-inner">
                                    <p>{exchange?.description}</p>
                                </div>
                            </div>
                            <div className="exchange-header-charts-card">
                                <Doughnut data={metricsData} />
                            </div>
                            <div className="exchange-header-metrics-card">
                                <div className="metric-card">
                                    <div className="metric-card-name">
                                        <FaChartBar />
                                        <h3>Net Impact Score</h3>
                                    </div>
                                    <p>{exchange?.net_impact_score}</p>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-card-name">
                                        <FaFlag />
                                        <h3>Flagged Content</h3>
                                    </div>
                                    <p>{exchange?.flagged_content_count}</p>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-card-name">
                                        <FaUsers />
                                        <h3>Active Users</h3>
                                    </div>
                                    <p>{exchange?.user_contributions?.length}</p>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-card-name">
                                        <FaInfoCircle />
                                        <h3>Toxicity Score</h3>
                                    </div>
                                    <p>{exchange?.toxicity_score}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="exchange-page-entries">
                        <div className="exchange-page-entries-inner">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExchangePage;
