import axios from "axios";
import './entry.css';
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../../../apiUrl";
import getConfig from "../../../config";
import { useAuth } from "../../../reducers/auth/useAuth";
import { FaArrowCircleDown, FaArrowCircleUp, FaComment, FaReply } from "react-icons/fa";
import { formatDateTime } from "../../../utils/formatDateTime";
import ProfilePicture from "../../../utils/profilePicture/getProfilePicture";

const Entry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { entryId, exchangeId } = useParams();
    const { authState } = useAuth();
    const config = getConfig(authState);

    const [parentExchangeInfo, setParentExchangeInfo] = useState({});
    const [entryInfo, setEntryInfo] = useState({});

    const [showCreateReplyOverlay, setShowCreateReplyOverlay] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const [commentReplyContent, setCommentReplyContent] = useState('');
    const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);

    const [exchangeTrendingEntries, setExchangeTrendingEntries] = useState([]);

    const fetchEntryInfo = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/openspace/exchange/${exchangeId}/entrie/${entryId}/get-details/`, config);
            console.log(response.data);
            setEntryInfo(response.data);
        } catch (err) {
            console.error('Error fetching entry info', err);
        }
    };

    

    const fetchParentExchangeInfo = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/openspace/exchange/${exchangeId}/minimal-info/`, config);
            console.log(response.data);
            setParentExchangeInfo(response.data);
        } catch (err) {
            console.error('Error fetching entry info', err);
        }
    }

    const fetchTrendingExchangeEntries = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/openspace/exchange/${exchangeId}/entries/`, config);
            console.log(response.data)
            setExchangeTrendingEntries(response.data);
        } catch (err) {
            console.error('Error fetching trending entries', err);
        }
    };

    useEffect(() => {
        fetchEntryInfo();
        fetchParentExchangeInfo();
        fetchTrendingExchangeEntries();
    }, [entryId, exchangeId]);



    async function voteEntry(entryUUID, voteType) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}api/openspace/exchange/entry/${entryUUID}/vote/`,
                { vote_type: voteType },
                config,
            );
            console.log(response.data);

            const { upvotes, downvotes, net_votes } = response.data;

            // Update the entry info state with the new vote counts from the API response
            setEntryInfo((prevState) => {
                const updatedEntry = { ...prevState };
                updatedEntry.upvotes = upvotes;
                updatedEntry.downvotes = downvotes;
                updatedEntry.net_votes = net_votes;
                return updatedEntry;
            });

        } catch (err) {
            console.error(err);
        }
    }


    async function commentEntry() {
        if (replyContent !== '') {
            try {
                const response = await axios.post(
                    `${API_BASE_URL}api/openspace/exchange/entry/${entryId}/comment/`,
                    { content: replyContent },
                    config
                );
                console.log("Comment created:", response.data);
                setShowCreateReplyOverlay(false);
                setReplyContent('');
                setEntryInfo((prevState) => {
                    const updatedEntry = { ...prevState };
                    updatedEntry.comments = [...prevState.comments, response.data.comment];
                    updatedEntry.comments_count += 1;
                    return updatedEntry;
                });
            } catch (err) {
                console.error("Error creating comment:", err);
            }
        }
    }


    async function submitCommentReply(commentId) {
        if (commentReplyContent !== '') {
            try {
                const response = await axios.post(
                    `${API_BASE_URL}api/openspace/exchange/entry/comment/${commentId}/reply/`,
                    { content: commentReplyContent },
                    config
                );
                console.log("Reply created:", response.data);

                setCommentReplyContent(''); // Clear input
                setActiveReplyCommentId(null); // Close reply box
                setEntryInfo((prevState) => {
                    const updatedEntry = { ...prevState };
                    const targetComment = updatedEntry.comments.find(c => c.id === commentId);
                    if (targetComment) {
                        targetComment.replies = [...(targetComment.replies || []), response.data.reply];
                    }
                    return updatedEntry;
                });
            } catch (err) {
                console.error("Error creating reply:", err);
            }
        }
    }



    return (
        <div className='openspace-entry'>
            <div className="entry-left-panel">
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
                                    <Link to={`/openspace/exchange/${entry?.exchange_uuid}/entry/${entry?.uuid}`}>
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
            </div>
            <div className="entry-center-panel">
                <div className="entry-center-panel-content">
                    <div className="entry-center-panel-title">
                        <h2>{entryInfo.title}</h2>
                    </div>
                    {entryInfo.content !== '' &&
                        <div className="entry-center-panel-context">
                            <p>{entryInfo.content}</p>
                        </div>
                    }
                    <div className="entry-center-panel-controls-and-info">
                        <div className="entry-center-panel-controls">
                            <button className="entry-central-panel-control-btn" onClick={() => voteEntry(entryInfo?.uuid, 'upvote')}>
                                <FaArrowCircleUp className="entry-control-icon" />
                                <p>Upvote</p>
                            </button>
                            <button className="entry-central-panel-control-btn" onClick={() => voteEntry(entryInfo?.uuid, 'downvote')}>
                                <FaArrowCircleDown className="entry-control-icon" />
                                <p>Downvote</p>
                            </button>
                            <button onClick={() => setShowCreateReplyOverlay(!showCreateReplyOverlay)}>
                                <FaReply className="entry-control-icon" />
                                <p>Reply</p>
                            </button>
                        </div>
                        <div className="entry-center-panel-info">
                            <div className="entry-center-panel-info-content">
                                <p>Author</p>
                                <Link to={`/profile/${entryInfo.author}`} >
                                    <ProfilePicture />
                                    @{entryInfo.author}
                                </Link>
                            </div>
                            <div className="entry-center-panel-info-content">
                                <p>Created</p>
                                <p>{formatDateTime(entryInfo.created_at)}</p>
                            </div>
                            <div className="entry-center-panel-info-content">
                                <p>Posted in</p>
                                <Link to={`/openspace/exchange/${parentExchangeInfo.uuid}`}>{parentExchangeInfo.name}</Link>
                            </div>
                        </div>
                    </div>
                    <div className={`entry-page-write-comment-container ${showCreateReplyOverlay ? 'open' : ''}`}>
                        <div className="entry-page-write-comment-title">
                            <h3>Write a Reply</h3>
                        </div>
                        <div className="entry-page-write-comment-textarea">
                            <textarea
                                className="entry-page-comment-textarea"
                                placeholder="Enter reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="entry-page-write-comment-submit">
                            <button onClick={() => commentEntry()} >Reply</button>
                        </div>
                    </div>
                    {entryInfo?.comments?.length === 0 ? (
                        <div className="entry-center-panel-no-comments">
                            <h3>No Replies!</h3>
                        </div>
                    ) : (
                        <div className="entry-center-panel-comments">
                            {entryInfo?.comments?.map((comment, index) => (
                                <div className="entry-center-panel-per-comment" key={index}>
                                    <div className="entry-comment-info">
                                        <div className="entry-comment-author">
                                            <Link to={`/profile/${comment.author}`} >
                                                <ProfilePicture />
                                                <p>@{comment.author}</p>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="entry-comment-content">
                                        <p>{comment.content}</p>
                                    </div>
                                    <div className="entry-comment-controls">
                                        <button>
                                            <FaArrowCircleUp />
                                            <p>Upvote</p>
                                        </button>
                                        <button>
                                            <FaArrowCircleDown />
                                            <p>Downvote</p>
                                        </button>
                                        <button onClick={() => setActiveReplyCommentId(activeReplyCommentId === comment.id ? null : comment.id)}>
                                            <FaReply />
                                            <p>Reply</p>
                                        </button>
                                    </div>

                                    <div className={`entry-write-comment-reply ${activeReplyCommentId === comment.id ? 'open' : ''}`}>
                                        <div className="entry-write-comment-reply-title">
                                            <h3>Write a Reply</h3>
                                        </div>
                                        <div className="entry-write-comment-reply-textarea-container">
                                            <textarea
                                                className="entry-page-comment-reply-textarea"
                                                placeholder="Enter reply..."
                                                value={commentReplyContent}
                                                onChange={(e) => setCommentReplyContent(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div className="entry-page-comment-reply-btn">
                                            <button onClick={() => submitCommentReply(comment.id)}>Reply</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="entry-right-panel">
                <div className="entry-right-panel-inner">

                </div>
            </div>
        </div>
    )
}

export default Entry;