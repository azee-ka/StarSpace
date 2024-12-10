import React, { useState } from "react";
import axios from "axios";
import "./createExchange.css";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../apiUrl";
import { useAuth } from "../../../reducers/auth/useAuth";
import getConfig from "../../../config";

const CreateExchange = () => {
    const { authState } = useAuth();
    const config = getConfig(authState, "multipart/form-data" );
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("General");
    const [banner, setBanner] = useState(null);
    const [primaryColor, setPrimaryColor] = useState("#1f1c2c");
    const [secondaryColor, setSecondaryColor] = useState("#928dab");
    const [isPublic, setIsPublic] = useState(true);
    const [allowAnonymous, setAllowAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);  // For loading state
    const [error, setError] = useState("");  // To handle errors

    const navigate = useNavigate();  // Initialize useNavigate for navigation after successful creation

    const handleBannerUpload = (e) => {
        setBanner(e.target.files[0]);  // Set the file object, not the URL
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Start loading when submission is in progress
        
        const exchangeData = new FormData();
        
        // Append regular data fields
        exchangeData.append('name', name);
        exchangeData.append('description', description);
        exchangeData.append('category', category);
        exchangeData.append('primaryColor', primaryColor);
        exchangeData.append('secondaryColor', secondaryColor);
        exchangeData.append('isPublic', isPublic);
        exchangeData.append('allowAnonymous', allowAnonymous);
        // exchangeData.append('moderators', JSON.stringify(moderators));
        if (banner) {
            exchangeData.append('banner', banner);
        }
    
        try {
            // Send data to the API using axios
            console.log('config', config)
            const response = await axios.post(`${API_BASE_URL}api/openspace/exchange/create/`, exchangeData, config);
            console.log(response);
            const exchangeId = response.data.uuid;
        
            // Navigate to the newly created exchange page
            navigate(`/openspace/exchange/${exchangeId}`);
        } catch (error) {
            // Handle error if the request fails
            if (error.response) {
                // Server responded with a status other than 2xx
                setError(error.response.data.detail || "Something went wrong!");
            } else if (error.request) {
                // Request was made but no response received
                setError("No response from the server. Please try again.");
            } else {
                // Something else went wrong
                setError("Failed to create exchange. Please try again.");
            }
        } finally {
            // Stop loading after the request is complete
            setLoading(false);
        }
    };
    

    return (
        <div className="create-exchange-page">
            <h1>Create Your Exchange</h1>
            <form onSubmit={handleSubmit}>
                <section className="section general-settings">
                    <h2>General Settings</h2>
                    <div className="form-group">
                        <label>Exchange Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter exchange name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your exchange"
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option>General</option>
                            <option>Technology</option>
                            <option>Art</option>
                            <option>Gaming</option>
                            <option>Education</option>
                        </select>
                    </div>
                </section>

                <section className="section visual-customization">
                    <h2>Visual Customization</h2>
                    <div className="form-group">
                        <label>Banner Image</label>
                        <input type="file" onChange={handleBannerUpload} />
                        {banner && <img src={banner} alt="Banner Preview" className="banner-preview" />}
                    </div>
                    <div className="form-group color-picker">
                        <label>Primary Color</label>
                        <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                        />
                        <label>Secondary Color</label>
                        <input
                            type="color"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                        />
                    </div>
                </section>

                <section className="section membership-controls">
                    <h2>Membership Controls</h2>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                            />
                            <p>Public Exchange</p>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={allowAnonymous}
                                onChange={(e) => setAllowAnonymous(e.target.checked)}
                            />
                            <p>Allow Anonymous Posts</p>
                        </label>
                    </div>
                </section>
                <button type="submit" className="submit-button">
                    Create Exchange
                </button>
            </form>
        </div>
    );
};

export default CreateExchange;
