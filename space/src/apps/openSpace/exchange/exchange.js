import React, { useState, useEffect } from "react";
import axios from "axios";
import "./exchange.css"; // Style for futuristic UI
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../reducers/auth/useAuth";
import API_BASE_URL from "../../../apiUrl";
import getConfig from "../../../config";
import { FaChartBar, FaFlag, FaUsers, FaInfoCircle, FaArrowUp, FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";
import { IoMdCheckmark } from 'react-icons/io';

// Chart.js setup
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import FuturisticDonutChart from "./chartConfig";
import { formatDateTime } from "../../../utils/formatDateTime";
import CreateEntryOverlay from "./createEntryOverlay/createEntryOverlay";
ChartJS.register(ArcElement, Tooltip, Legend);

const ExchangePage = () => {
    const navigate = useNavigate();
    const { authState } = useAuth();
    const config = getConfig(authState);
    const [exchange, setExchange] = useState(null);
    const [entries, setEntries] = useState([]);

    const [activeSection, setActiveSection] = useState("overview");

    const [showCreateEntryOverlay, setShowCreateEntryOverlay] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { exchangeId } = useParams();

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1); // Remove the '#' symbol
            setActiveSection(hash || "overview"); // Default to 'overview' if no hash
        };

        window.addEventListener("hashchange", handleHashChange);

        // Set initial section based on the URL hash
        handleHashChange();

        // Cleanup event listener on component unmount
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);


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
                console.log(response.data)
                setEntries(response.data);
            } catch (err) {
                console.error("Failed to load entries.");
            }
        };

        fetchExchange();
        fetchEntries();
    }, [exchangeId]);

    const handleShowCreateEntryOverlay = () => {
        setShowCreateEntryOverlay(true);
    };

    const handleCloseCreateEntryOverlay = () => {
        setShowCreateEntryOverlay(false);
    };

    const handleEntryClick = (entryUUID) => {
        navigate(`entry/${entryUUID}`);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="exchange-page">
            <div className='exchange-page-inner'>
                <div className="exchange-page-sidebar">
                    <div className="exchange-page-sidebar-inner">
                        <div className="exchange-sidebar-section">
                            <div className="exchange-sidebar-section-title">
                                <h4>Exchange Stats</h4>
                            </div>
                            <div className="exchange-sidebar-section-content-stats">
                                <div className="exchange-sidebar-upvotes-count">
                                    <p>{exchange?.upvotes}</p>
                                    <p>Upvotes</p>
                                </div>
                                <div className="exchange-sidebar-downvotes-count">
                                    <p>{exchange?.upvotes}</p>
                                    <p>Downvotes</p>
                                </div>
                                <div className="exchange-sidebar-entries-count">
                                    <p>{exchange?.total_entries}</p>
                                    <p>Entries</p>
                                </div>
                            </div>
                        </div>
                        <div className="exchange-sidebar-section">
                            <div className="exchange-sidebar-section-title">
                                <h4>Quick Navigation</h4>
                            </div>
                            <div className="exchange-sidebar-section-content">
                                <ul className="exchange-sidebar-links">
                                    <li>
                                        <a href="#overview" className={activeSection === "overview" ? "active" : ""}><p>Overview</p></a>
                                    </li>
                                    <li>
                                        <a href="#entries" className={activeSection === "entries" ? "active" : ""}><p>Entries</p></a>
                                    </li>
                                    <li>
                                        <a href="#metrics" className={activeSection === "metrics" ? "active" : ""}><p>Metrics</p></a>
                                    </li>
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
                                <button onClick={() => handleShowCreateEntryOverlay()} className="exchange-sidebar-contribute-button">+ Add New Entry</button>
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
                            <div className="exchange-page-header-tabs">
                                <div className="exchange-page-header-tabs-inner">
                                    <p>Category<span>{exchange?.category}</span></p>
                                    <p>Date Created<span>{formatDateTime(exchange?.created_at)}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {activeSection === 'overview' &&
                        <div className="exchange-page-info">
                            <div className="exchange-page-info-inner">
                                <div className="exchange-header-description-control-card">
                                    <div className="exchange-header-control-card">
                                        <button className="exchange-header-control-btn">
                                            <FaArrowCircleUp className="icon-style" />
                                            <p>Upvote</p>
                                        </button>
                                        <button className="exchange-header-control-btn">
                                            <FaArrowCircleDown className="icon-style" />
                                            <p>Downvote</p>
                                        </button>
                                    </div>
                                    <div className="exchange-header-description-card">
                                        <div className="exchange-header-description-card-inner">
                                            <div className="exchange-header-description-card-title">
                                                <h3>Description</h3>
                                            </div>
                                            <div className="exchange-header-description-card-content">
                                                <p>{exchange?.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="exchange-header-charts-card">
                                    <div className="exchange-header-charts-card-inner">
                                        <FuturisticDonutChart data={[60, 25, 15]} label={["Positive Impact", "Negative Impact", "Neutral"]} />
                                    </div>
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
                    }
                    {(activeSection === 'overview' || activeSection === 'entries') &&
                        <div className="exchange-page-entries">
                            <div className="exchange-page-entries-inner">
                                {entries.map((entry, index) => (
                                    <div key={index} className="exchange-page-per-entry">
                                        <div className="exchange-page-per-entry-content" onClick={() => handleEntryClick(entry.uuid)} >
                                            <div className="exchange-page-per-entry-content-inner">
                                                <div className="exhcange-page-per-entry-title">
                                                    <h3>{entry.title}</h3>
                                                </div>
                                                <div className="exhcange-page-per-entry-content">
                                                    <p>{entry.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="exchange-page-per-entry-metrics">
                                            <div className="exchange-page-per-entry-metrics-inner">

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    {activeSection === 'metrics' &&
                        <div className="exchange-page-metrics">

                        </div>
                    }
                </div>
            </div>
            {showCreateEntryOverlay && <CreateEntryOverlay exchangeUUID={exchange?.uuid} onClose={handleCloseCreateEntryOverlay} />}
        </div>
    );
};

export default ExchangePage;
