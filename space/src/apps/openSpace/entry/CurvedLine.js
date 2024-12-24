// CurvedLine.js
import React, { useRef, useEffect, useState } from "react";

const CurvedLine = ({ commentId, replyId, commentRefs }) => {
    const [pathData, setPathData] = useState('');

    useEffect(() => {
        const commentElement = commentRefs.current[commentId];
        const replyElement = commentRefs.current[replyId];

        if (!commentElement || !replyElement) return;

        const commentRect = commentElement.getBoundingClientRect();
        const replyRect = replyElement.getBoundingClientRect();

        const curveControlPointX = (commentRect.x + replyRect.x) / 2;
        const curveControlPointY = Math.min(commentRect.y, replyRect.y) - 30;

        const pathData = `M${commentRect.x + commentRect.width / 2},${commentRect.y + commentRect.height} Q${curveControlPointX},${curveControlPointY} ${replyRect.x + replyRect.width / 2},${replyRect.y}`;
        setPathData(pathData);
    }, [commentId, replyId, commentRefs]);

    return (
        pathData && (
            <svg className="curved-line" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
                <path d={pathData} stroke="gray" fill="transparent" strokeWidth="2" />
            </svg>
        )
    );
};

export default CurvedLine;
