import React, { useState, useEffect } from "react";
import axios from "axios";
import "./exchange.css";
import API_BASE_URL from "../../../apiUrl";
import { useParams } from "react-router-dom";
import getConfig from "../../../config";
import { useAuth } from "../../../reducers/auth/useAuth";

const ExchangePage = () => {
    const { authState } = useAuth();
    const config = getConfig(authState);
    const [exchange, setExchange] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { exchangeId } = useParams();
    console.log(exchangeId);

    useEffect(() => {
        const fetchExchange = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/openspace/exchange/${exchangeId}/`, config);
                console.log(response.data)
                setExchange(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load exchange data.");
                setLoading(false);
            }
        };

        fetchExchange();
    }, [exchangeId]);

    if (loading) return <div className="loading">Loading Exchange...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="exchange-page">
            <header className="exchange-header">
                <div className="exchange-banner">
                    <img src={exchange.banner} alt={`${exchange.name} Banner`} />
                </div>
                <div className="exchange-info">
                    <h1>{exchange.name}</h1>
                    <p>{exchange.description}</p>
                    <div className="exchange-stats">
                        <span>{exchange.members} Members</span>
                        <span>{exchange.entries} Entries</span>
                        <span>Score: {exchange.score}</span>
                    </div>
                </div>
            </header>

            <section className="exchange-details">
                <div className="rules-section">
                    <h2>Exchange Rules</h2>
                    {exchange.rules.length ? (
                        <ul>
                            {exchange.rules.map((rule, index) => (
                                <li key={index}>{rule}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No specific rules for this exchange.</p>
                    )}
                </div>

                <div className="moderators-section">
                    <h2>Moderators</h2>
                    <ul>
                        {exchange.moderators.map((moderator, index) => (
                            <li key={index}>{moderator}</li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default ExchangePage;
