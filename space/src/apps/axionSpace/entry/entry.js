import axios from "axios";
import DOMPurify from 'dompurify';
import './entry.css';
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../../../apiUrl";
import getConfig from "../../../config";
import { useAuth } from "../../../hooks/useAuth";
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
import Comment from "./comment/comment";
import CurvedLine from "./CurvedLine";

const Entry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { entryId } = useParams();
    const { authState } = useAuth();
    const { callApi } = useApi();

    const commentRefs = useRef({});


    const [parentExchangeInfo, setParentExchangeInfo] = useState({});
    const [entryInfo, setEntryInfo] = useState({});

    const [showCreateReplyOverlay, setShowCreateReplyOverlay] = useState(false);
    const [replyContent, setReplyContent] = useState(EditorState.createEmpty()); // Store EditorState directly

    const [commentReplyContent, setCommentReplyContent] = useState(EditorState.createEmpty());
    const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);

    const [exchangeTrendingEntries, setExchangeTrendingEntries] = useState([]);


    useEffect(() => {
        // Pass authState to apiCall
        callApi(`axionspace/entry/${entryId}/get-details/`)
            .then((response) => {
                setEntryInfo(response.data);
                console.log(response.data);
            }).catch(console.error);

    }, [entryId, authState]);

    useEffect(() => {
        if (!entryInfo?.exchange_uuid) return;

        callApi(`axionspace/exchange/${entryInfo?.exchange_uuid}/entries/`,)
            .then((response) => {
                setExchangeTrendingEntries(response.data);
                // console.log(response.data);
            }).catch(console.error);

        callApi(`axionspace/exchange/${entryInfo?.exchange_uuid}/minimal-info/`)
            .then((response) => {
                setParentExchangeInfo(response.data);
                // console.log(response.data);
            }).catch(console.error);

    }, [entryId, entryInfo, authState]);


    async function voteEntry(entryUUID, voteType) {
        try {
            const response = await callApi(`axionspace/exchange/entry/${entryUUID}/vote/`, 'POST', { vote_type: voteType });
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
    };

    async function voteComment(comment_id, voteType) {
        try {
            const response = await callApi(`axionspace/exchange/entry/comment/${comment_id}/vote/`, 'POST', { vote_type: voteType });
            const { upvotes, downvotes, net_votes } = response.data;
            console.log(response.data)
            // Update the entry info state with the new vote counts from the API response
            setEntryInfo((prevState) => {
                const updatedComments = prevState.comments.map((comment) => {
                    if (comment.id === comment_id) {
                        return { ...comment, upvotes, downvotes, net_votes };
                    }
                    return comment;
                });

                return { ...prevState, comments: updatedComments };
            });
        } catch (err) {
            console.error(err);
        }
    }

    async function voteReply(reply_id, voteType) {
        try {
            const response = await callApi(`axionspace/exchange/entry/comment/${reply_id}/vote/`, 'POST', { vote_type: voteType });
            const { upvotes, downvotes, net_votes } = response.data;

            // Update the entry info state with the new vote counts from the API response
            setEntryInfo((prevState) => {
                const updatedComments = prevState.comments.map((comment) => {
                    // Map through each comment's replies to find and update the specific reply
                    const updatedReplies = comment.replies.map((reply) => {
                        if (reply.id === reply_id) {
                            return { ...reply, upvotes, downvotes, net_votes }; // Update the reply's vote counts
                        }
                        return reply;
                    });

                    return { ...comment, replies: updatedReplies }; // Return the updated comment with updated replies
                });

                return { ...prevState, comments: updatedComments };
            });
        } catch (err) {
            console.error(err);
        }
    };

    async function commentEntry() {
        if (replyContent) {
            try {
                const contentState = replyContent.getCurrentContent(); // Get current content from the editor
                const sanitizedText = DOMPurify.sanitize(stateToHTML(contentState));
                const response = await callApi(`axionspace/exchange/entry/${entryId}/comment/`, 'POST', { content: sanitizedText })

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



    async function handleSubmitReply(commentId, parentReplyId = null) {
        if (commentReplyContent) {
            try {
                const contentState = commentReplyContent.getCurrentContent();
                const sanitizedText = DOMPurify.sanitize(stateToHTML(contentState));
                const response = await callApi(
                    `axionspace/exchange/entry/comment/${commentId}/reply/`,
                    'POST',
                    { content: sanitizedText, parent_reply_id: parentReplyId }
                );

                setCommentReplyContent(EditorState.createEmpty());
                setActiveReplyCommentId(null);

                setEntryInfo((prevState) => {
                    const updatedComments = prevState.comments.map(comment => {
                        if (comment.id === commentId) {
                            if (parentReplyId) {
                                // Handle nested reply within a reply
                                return {
                                    ...comment,
                                    replies: comment.replies.map(reply =>
                                        reply.id === parentReplyId
                                            ? { ...reply, replies: [...reply.replies, response.data.reply] }
                                            : reply
                                    ),
                                };
                            }
                            return {
                                ...comment,
                                replies: [...comment.replies, response.data.reply],
                            };
                        }
                        return comment;
                    });

                    return {
                        ...prevState,
                        comments: updatedComments,
                        comments_count: prevState.comments_count + 1,
                    };
                });
            } catch (err) {
                console.error(err);
            }
        }
    }


    const handleReplyChange = (content) => {
        setCommentReplyContent(content);
    };




    return (
        <div className='axionspace-entry'>
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
                                <Link to={`/profile/${entryInfo?.author?.username}`} >
                                    <ProfilePicture />
                                    @{entryInfo?.author?.username}
                                </Link>
                            </div>
                            <div className="entry-center-panel-info-content">
                                <p>Created</p>
                                <p>{formatDateTime(entryInfo?.created_at)}</p>
                            </div>
                            <div className="entry-center-panel-info-content">
                                <p>Posted in</p>
                                <Link to={`/axionspace/exchange/${parentExchangeInfo?.uuid}`}>{parentExchangeInfo?.name}</Link>
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
                                <div key={index} className="entry-center-panel-comments-inner" >
                                    <Comment
                                        comment={comment}
                                        onReplyClick={handleReplyChange}
                                        onSubmitReply={handleSubmitReply}
                                        activeReplyCommentId={activeReplyCommentId}
                                        setActiveReplyCommentId={setActiveReplyCommentId}
                                        voteComment={voteComment}
                                        voteReply={voteReply}
                                    />
                                    {comment.replies.map((reply, replyIndex) => (
                                        <CurvedLine
                                            key={replyIndex}
                                            commentId={comment.id}
                                            replyId={reply.id}
                                            commentRefs={commentRefs}
                                        />
                                    ))}
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