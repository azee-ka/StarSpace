import React from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "../../../../utils/profilePicture/getProfilePicture";
import EntryControls from "../entryControls/entryControl";


const Comment = ({ comment }) => {
    return (
        <div>
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
    );
}

export default Comment;