import React, { useState, useEffect } from "react";
import axios from "axios";
import EntryCard from "./EntryCard"; // Modularized entry component
import "./Exchange.css";

const Exchange = () => {
    const [exchangeData, setExchangeData] = useState(null); // Exchange details
    const [entries, setEntries] = useState([]); // Entries data
    const [loading, setLoading] = useState(true);

    // Fetch exchange and entries from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const exchangeResponse = await axios.get("/api/exchange/1"); // Mock endpoint for exchange
                const entriesResponse = await axios.get("/api/exchange/1/entries"); // Mock endpoint for entries
                setExchangeData(exchangeResponse.data);
                setEntries(entriesResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="open-space-exchange">
            {/* Header Section */}
            <div className="exchange-header">
                <h1 className="exchange-title">{exchangeData.title}</h1>
                <div className="exchange-meta">
                    <span>By <strong>{exchangeData.author}</strong> | {exchangeData.date}</span>
                    <span className="tags">Tags: {exchangeData.tags.join(", ")}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="exchange-content">
                <p>{exchangeData.content}</p>
                <div className="stats-bar">
                    <span>💬 {entries.length} Entries</span>
                    <span>👍 {exchangeData.upvotes} Upvotes</span>
                </div>
            </div>

            {/* Entries Section */}
            <div className="entries-section">
                <h2>Community Entries</h2>
                {entries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                ))}
            </div>

            {/* Reply Section */}
            <div className="reply-box">
                <textarea placeholder="Contribute your thoughts..." rows="3" className="reply-input"></textarea>
                <button className="reply-submit">Post Entry</button>
            </div>
        </div>
    );
};

export default Exchange;
