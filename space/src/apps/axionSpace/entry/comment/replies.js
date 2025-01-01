// Replies.js
import React, { useState } from "react";
import DOMPurify from "dompurify";
import Comment from "./comment";
import { Link } from "react-router-dom";
import EntryControls from "../entryControls/entryControl";
import WriteReply from "../writeReply/writeReply";
import ProfilePicture from "../../../../utils/profilePicture/getProfilePicture";
import apiCall from "../../../../utils/api";

const Replies = ({ replies, activeReplyCommentId, setActiveReplyCommentId, onReplyClick, onSubmitReply, voteReply }) => {

    return (
        <div className="entry-comment-reply-container">
            {replies.map((reply, index) => (
                <Reply
                    key={index}
                    reply={reply}
                    activeReplyCommentId={activeReplyCommentId}
                    setActiveReplyCommentId={setActiveReplyCommentId}
                    onReplyClick={onReplyClick}
                    onSubmitReply={onSubmitReply}
                    voteReply={voteReply}
                />
            ))}
        </div>
    );
};

// Recursive Reply Component for each reply and its nested replies
const Reply = ({ reply, activeReplyCommentId, setActiveReplyCommentId, onReplyClick, onSubmitReply, voteReply }) => {
    const [isCollapsed, setIsCollapsed] = useState(true); // Collapse state for nested replies
    console.log('repply', reply)
    const toggleRepliesCollapse = () => setIsCollapsed(prevState => !prevState);

    return (
        <div className="entry-comment-per-reply">
            <div className="entry-comment-per-reply-info">
                <div className="entry-comment-per-reply-author">
                    <Link to={`/profile/${reply.author}`}>
                        <ProfilePicture />
                        <p>@{reply.author}</p>
                    </Link>
                </div>
                <div className="entry-comment-per-reply-stats">
                    <div>
                        <p>{reply.upvotes}</p>
                        <p>Upvotes</p>
                    </div>
                    <div>
                        <p>{reply.downvotes}</p>
                        <p>Downvotes</p>
                    </div>
                    <div>
                        <p>{reply?.replies?.length}</p>
                        <p>Replies</p>
                    </div>
                </div>
            </div>
            <div className="entry-comment-per-reply-content">
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.content) }} />
            </div>

            <div className="entry-comment-per-reply-controls">
                <EntryControls
                    upVoteClick={() => voteReply(reply?.id, 'upvote')}
                    downVoteClick={() => voteReply(reply?.id, 'downvote')}
                    replyClick={() => setActiveReplyCommentId(activeReplyCommentId === reply.id ? null : reply.id)}
                />
            </div>

            <div className={`entry-comment-per-sub-reply-write`}>
                <WriteReply
                    title={'Write a Reply'}
                    placeholder={"Enter reply..."}
                    showEditor={activeReplyCommentId === reply.id}
                    onContentChange={onReplyClick}
                    onSubmit={() => onSubmitReply(reply.id)} // Reply to this reply
                />
            </div>

            {/* Button to collapse/uncollapse nested replies */}
            {reply?.replies?.length > 0 && (
                <div className="toggle-replies-button">
                    <button onClick={toggleRepliesCollapse}>
                        {isCollapsed ? '(+) Show Replies' : '(-) Hide Replies'}
                    </button>
                </div>
            )}

            {/* Render nested replies recursively */}
            {!isCollapsed && reply?.replies?.length > 0 && (
                <Replies
                    replies={reply.replies}
                    activeReplyCommentId={activeReplyCommentId}
                    setActiveReplyCommentId={setActiveReplyCommentId}
                    onReplyClick={onReplyClick}
                    onSubmitReply={onSubmitReply}
                />
            )}
        </div>
    );
};

export default Replies;
