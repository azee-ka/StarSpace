import React from "react";
import { Link } from "react-router-dom";
import './leftPanel.css';

const LeftPanel = ({ entryInfo, exchangeTrendingEntries }) => {
    return (
        <div className="entry-left-panel-inner">
                    <div className="entry-left-panel-section">
                        <div className="entry-left-panel-section-title">
                            <h4>Entry Stats</h4>
                        </div>
                        <div className="entry-left-panel-section-content-stats">
                            <div className="entry-left-panel-count">
                                <p>{entryInfo?.upvotes}</p>
                                <p>Upvotes</p>
                            </div>
                            <div className="entry-left-panel-count">
                                <p>{entryInfo?.downvotes}</p>
                                <p>Downvotes</p>
                            </div>
                            <div className="entry-left-panel-count">
                                <p>{entryInfo?.comments_count}</p>
                                <p>Replies</p>
                            </div>
                        </div>
                    </div>
                    <div className="entry-left-panel-section">
                        <div className="entry-left-panel-section-title">
                            <h4>Trending Entries</h4>
                        </div>
                        <div className="entry-left-panel-section-content-trending">
                            {exchangeTrendingEntries.map((entry, index) => (
                                <div className="entry-left-panel-trending-per-entry" key={index}>
                                    <Link to={`/axionspace/exchange/${entry?.exchange_uuid}/entry/${entry?.uuid}`}>
                                        {entry?.uploadedFiles &&
                                            <div className="entry-page-trending-entry-media-preview">

                                            </div>
                                        }
                                        <div className="entry-page-trending-entry-title">
                                            {entry.title}
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
    );
}

export default LeftPanel;