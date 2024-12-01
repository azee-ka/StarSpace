import React from "react";
import "./EntryCard.css";

const EntryCard = ({ entry }) => {
    return (
        <div className="entry-card">
            <div className="entry-header">
                <span><strong>{entry.author}</strong> | {entry.timestamp}</span>
            </div>
            <p className="entry-content">{entry.content}</p>
            <div className="entry-actions">
                <button>👍 {entry.upvotes}</button>
                <button>👎 {entry.downvotes}</button>
                <button>Reply</button>
            </div>
        </div>
    );
};

export default EntryCard;
