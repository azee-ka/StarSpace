import axios from "axios";
import DOMPurify from 'dompurify';
import './entry.css';
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../../../apiUrl";
import getConfig from "../../../config";
import { useAuth } from "../../../reducers/auth/useAuth";
import { FaArrowCircleDown, FaArrowCircleUp, FaCartArrowDown, FaComment, FaRegCaretSquareDown, FaRegCaretSquareUp, FaReply } from "react-icons/fa";
import { formatDateTime } from "../../../utils/formatDateTime";
import ProfilePicture from "../../../utils/profilePicture/getProfilePicture";
import apiCall from "../../../utils/api";
import useApi from "../../../utils/useApi";
import DraftEditor from "../../../utils/editor/editor";
import { EditorState } from "draft-js";
import { stateToHTML } from 'draft-js-export-html';
import LeftPanel from "./leftPanel/leftPanel";
import EntryControls from "./entryControls/entryControl";
import WriteReply from "./writeReply/writeReply";

const Entry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { entryId, exchangeId } = useParams();
    const { authState } = useAuth();
    const { callApi } = useApi();


    const [parentExchangeInfo, setParentExchangeInfo] = useState({});
    const [entryInfo, setEntryInfo] = useState({});

    const [showCreateReplyOverlay, setShowCreateReplyOverlay] = useState(false);
    const [replyContent, setReplyContent] = useState(EditorState.createEmpty()); // Store EditorState directly

    const [commentReplyContent, setCommentReplyContent] = useState(EditorState.createEmpty());
    const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);

    const [exchangeTrendingEntries, setExchangeTrendingEntries] = useState([]);


    useEffect(() => {
        // Pass authState to apiCall
        callApi(`openspace/exchange/${exchangeId}/entry/${entryId}/get-details/`)
            .then((response) => {
                setEntryInfo(response.data);
                console.log(response.data);
            }).catch(console.error);

        callApi(`openspace/exchange/${exchangeId}/entries/`,)
            .then((response) => {
                setExchangeTrendingEntries(response.data);
                // console.log(response.data);
            }).catch(console.error);

        callApi(`openspace/exchange/${exchangeId}/minimal-info/`)
            .then((response) => {
                setParentExchangeInfo(response.data);
                // console.log(response.data);
            }).catch(console.error);

    }, [exchangeId, entryId, authState]);


    async function voteEntry(entryUUID, voteType) {
        try {
            const response = await callApi(`openspace/exchange/entry/${entryUUID}/vote/`, 'POST', { vote_type: voteType });
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
        if (replyContent) {
            try {
                const contentState = replyContent.getCurrentContent(); // Get current content from the editor
                const sanitizedText = DOMPurify.sanitize(stateToHTML(contentState));
                const response = await callApi(`openspace/exchange/entry/${entryId}/comment/`, 'POST', { content: sanitizedText })

                console.log("Comment created:", response.data);
                setShowCreateReplyOverlay(false);
                setReplyContent(EditorState.createEmpty());
                setEntryInfo((prevState) => {
                    const updatedEntry = { ...prevState };
                    updatedEntry.comments = [...prevState.comments, response.data.comment];
                    updatedEntry.comments_count += 1;
                    return updatedEntry;
                });

            } catch (err) {
                console.error(err)
            };
        }
    }


    async function submitCommentReply(commentId) {
        if (commentReplyContent) {
            try {
                const contentState = commentReplyContent.getCurrentContent(); // Get current content from the editor
                const sanitizedText = DOMPurify.sanitize(stateToHTML(contentState));
                const response = await callApi(`openspace/exchange/entry/comment/${commentId}/reply/`, 'POST', { content: sanitizedText });

                console.log("Reply created:", response.data);

                setCommentReplyContent('');
                setActiveReplyCommentId(null);

                setEntryInfo((prevState) => {
                    // Deep clone the entry state to ensure immutability
                    const updatedComments = prevState.comments.map(comment => {
                        if (comment.id === commentId) {
                            // Create a new comment object with updated replies
                            return {
                                ...comment,
                                replies: [...comment.replies, response.data.reply],
                            };
                        }
                        return comment; // Return unchanged comments
                    });

                    return {
                        ...prevState,
                        comments: updatedComments,
                        comments_count: prevState.comments_count + 1, // Increment comments count
                    };
                });
            } catch (err) {
                console.error(err);
            }
        }
    }



    return (
        <div className='openspace-entry'>
            <div className="entry-left-panel">
                <LeftPanel entryInfo={entryInfo} exchangeTrendingEntries={exchangeTrendingEntries} />
            </div>
            <div className="entry-center-panel">
                <div className="entry-center-panel-content">
                    <div className="entry-center-panel-title">
                        <h2>{entryInfo.title}</h2>
                    </div>
                    {entryInfo.content !== '' &&
                        <div className="entry-center-panel-context">
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entryInfo.content) }} />
                        </div>
                    }
                    <div className="entry-center-panel-controls-and-info">
                        <div className="entry-center-panel-controls">
                            <EntryControls
                                upVoteClick={() => voteEntry(entryInfo?.uuid, 'upvote')}
                                downVoteClick={() => voteEntry(entryInfo?.uuid, 'downvote')}
                                replyClick={() => setShowCreateReplyOverlay(!showCreateReplyOverlay)}
                            />
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
                        <WriteReply
                            title={'Write a Reply'}
                            placeholder={"Enter reply..."}
                            showEditor={showCreateReplyOverlay}
                            onContentChange={(state) => setReplyContent(state)}
                            onSubmit={() => commentEntry()}
                        />
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
                                        <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.content) }} />
                                    </div>

                                    <div className="entry-comment-controls">
                                        <EntryControls replyClick={() => setActiveReplyCommentId(activeReplyCommentId === comment.id ? null : comment.id)} />
                                    </div>
                                    <div className={`entry-write-comment-reply`}>
                                        <WriteReply
                                            title={'Write a Reply'}
                                            placeholder={"Enter reply..."}
                                            showEditor={activeReplyCommentId === comment.id}
                                            onContentChange={(state) => setCommentReplyContent(state)}
                                            onSubmit={() => submitCommentReply(comment.id)}
                                        />
                                    </div>

                                    {comment?.replies?.length > 0 &&
                                        <div className="entry-comment-reply-container">
                                            {comment?.replies.map((reply, index) => (
                                                <div key={index} className="entry-comment-per-reply">
                                                    <div className="entry-comment-per-reply-author">
                                                        <Link to={`/profile/${comment.author}`} >
                                                            <ProfilePicture />
                                                            <p>@{reply.author}</p>
                                                        </Link>
                                                    </div>
                                                    <div className="entry-comment-per-reply-content">
                                                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.content) }} />
                                                    </div>

                                                    <div className="entry-comment-per-reply-controls">
                                                        <EntryControls replyClick={() => setActiveReplyCommentId(activeReplyCommentId === reply.id ? null : reply.id)} />
                                                    </div>

                                                    <div className={`entry-comment-per-sub-reply-write`}>
                                                        <WriteReply
                                                            title={'Write a Reply'}
                                                            placeholder={"Enter reply..."}
                                                            showEditor={activeReplyCommentId === reply.id}
                                                            onContentChange={(state) => setCommentReplyContent(state)}
                                                            onSubmit={() => submitCommentReply(reply.id)}
                                                        />
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    }
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