// Comment.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import './comment.css';
import ProfilePicture from "../../../../utils/profilePicture/getProfilePicture";
import DOMPurify from "dompurify";
import EntryControls from "../entryControls/entryControl";
import WriteReply from "../writeReply/writeReply";
import Replies from "./replies";

const Comment = ({ comment, onReplyClick, onSubmitReply, activeReplyCommentId, setActiveReplyCommentId, voteComment, voteReply }) => {
    const [isCollapsed, setIsCollapsed] = useState(true); // Collapse state for the current comment's replies

    const toggleRepliesCollapse = () => setIsCollapsed(prevState => !prevState);

    return (
        <div className="entry-center-panel-per-comment">
            <div className="entry-comment-info">
                <div className="entry-comment-author">
                    <Link to={`/profile/${comment.author}`}>
                        <ProfilePicture />
                        <p>@{comment.author}</p>
                    </Link>
                </div>
                <div className="entry-comment-stats">
                    <div>
                        <p>{comment.upvotes}</p>
                        <p>Upvotes</p>
                    </div>
                    <div>
                        <p>{comment.downvotes}</p>
                        <p>Downvotes</p>
                    </div>
                    <div>
                        <p>{comment?.replies?.length}</p>
                        <p>Replies</p>
                    </div>
                </div>
            </div>
            <div className="entry-comment-content">
                <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.content) }} />
            </div>

            <div className="entry-comment-controls">
                <EntryControls
                    upVoteClick={() => voteComment(comment?.id, 'upvote')}
                    downVoteClick={() => voteComment(comment?.id, 'downvote')}
                    replyClick={() => setActiveReplyCommentId(activeReplyCommentId === comment.id ? null : comment.id)} 
                />
            </div>

            <div className={`entry-write-comment-reply ${activeReplyCommentId === comment.id ? 'open' : ''}`}>
                <WriteReply
                    title={'Write a Reply'}
                    placeholder={"Enter reply..."}
                    showEditor={activeReplyCommentId === comment.id}
                    onContentChange={onReplyClick}
                    onSubmit={() => onSubmitReply(comment.id)}
                />
            </div>

            {/* Button to collapse/uncollapse replies */}
            {comment?.replies?.length > 0 && (
                <div className="toggle-replies-button">
                    <button onClick={toggleRepliesCollapse}>
                        {isCollapsed ? '(+) Show Replies' : '(-) Hide Replies'}
                    </button>
                </div>

            )}

            {/* Render replies recursively */}
            {!isCollapsed && comment?.replies?.length > 0 && (
                <Replies
                    replies={comment.replies}
                    activeReplyCommentId={activeReplyCommentId}
                    setActiveReplyCommentId={setActiveReplyCommentId}
                    onReplyClick={onReplyClick}
                    onSubmitReply={onSubmitReply}
                    voteReply={voteReply}
                />
            )}
        </div>
    );
};

export default Comment;
