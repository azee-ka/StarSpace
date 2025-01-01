import React from "react";
import './entryControl.css'
import { FaArrowCircleDown, FaArrowCircleUp, FaReply } from "react-icons/fa";

const EntryControls = ({ upVoteClick, downVoteClick, replyClick }) => {
    return (
        <div className="entry-controls">
            <button onClick={upVoteClick} >
                <FaArrowCircleUp/>
                <p>Upvote</p>
            </button>
            <button onClick={downVoteClick}>
                <FaArrowCircleDown />
                <p>Downvote</p>
            </button>
            <button onClick={replyClick}>
                <FaReply />
                <p>Reply</p>
            </button>
        </div>
    )
};

export default EntryControls;