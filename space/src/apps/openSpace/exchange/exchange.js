import React, { useState, useEffect } from "react";
import axios from "axios";
import "./exchange.css";

const Exchange = () => {
    const [exchangeData, setExchangeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch the exchange data
        axios.get("/api/exchange")
            .then(response => {
                setExchangeData(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching exchange data:", error);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="exchange-page">
            {isLoading ? (
                <div className="loading-spinner">
                    <span>Loading...</span>
                </div>
            ) : (
                exchangeData && (
                    <div className="exchange-container">
                        <header className="exchange-header">
                            <h1>{exchangeData.name}</h1>
                            <p>{exchangeData.description}</p>
                            <div className="exchange-stats">
                                <span>Members: {exchangeData.members.length}</span>
                                <span>Score: {exchangeData.score}</span>
                            </div>
                        </header>

                        <div className="exchange-body">
                            <h2>Welcome to {exchangeData.name}</h2>
                            <p>
                                Explore, engage, and contribute! This exchange is all about{" "}
                                <strong>{exchangeData.name}</strong>.
                            </p>
                            <div className="futuristic-card">
                                <h3>Be an active member!</h3>
                                <p>
                                    Interact with members, share your thoughts, and contribute to the exchange.
                                </p>
                            </div>
                        </div>

                        <footer className="exchange-footer">
                            <button className="join-button">Join Exchange</button>
                            <button className="explore-button">Explore Entries</button>
                        </footer>
                    </div>
                )
            )}
        </div>
    );
};

export default Exchange;
