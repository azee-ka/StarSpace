import axios from "axios";
import './entry.css';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../../../apiUrl";
import getConfig from "../../../config";
import { useAuth } from "../../../reducers/auth/useAuth";
import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";

const Entry = () => {
    const { entryId, exchangeId } = useParams();
    const { authState } = useAuth();
    const config = getConfig(authState);

    const [entryInfo, setEntryInfo] = useState({});

    const fetchEntryInfo = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/openspace/exchange/${exchangeId}/entrie/${entryId}/get-details/`, config);
            console.log(response.data);
            setEntryInfo(response.data);
        } catch (err) {
            console.error('Error fetching entry info', err);
        }
    }

    useEffect(() => {
        fetchEntryInfo();
    }, []);


    return (
        <div className='openspace-entry'>
            <div className="entry-left-panel">
                <div className="entry-left-panel-inner">

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
                    <div className="entry-center-panel-controls">
                        <button className="entry-central-panel-control-btn">
                            <FaArrowCircleUp className="entry-control-icon" />
                            <p>Upvotes</p>
                        </button>
                        <button className="entry-central-panel-control-btn">
                            <FaArrowCircleDown className="entry-control-icon" />
                            <p>Downvotes</p>
                        </button>
                    </div>
                    {entryInfo.comments && entryInfo.comments.length === 0 ? (
                        <div className="entry-center-panel-no-comments">
                            <h3>No Comments!</h3>
                        </div>
                    ) : (
                        <div className="entry-center-panel-comments">

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