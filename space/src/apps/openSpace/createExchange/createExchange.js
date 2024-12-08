import React, { useState } from "react";
import "./createExchange.css";

const CreateExchange = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("General");
    const [banner, setBanner] = useState(null);
    const [primaryColor, setPrimaryColor] = useState("#1f1c2c");
    const [secondaryColor, setSecondaryColor] = useState("#928dab");
    const [isPublic, setIsPublic] = useState(true);
    const [allowAnonymous, setAllowAnonymous] = useState(false);
    const [moderators, setModerators] = useState("");

    const handleBannerUpload = (e) => {
        setBanner(URL.createObjectURL(e.target.files[0]));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const exchangeData = {
            name,
            description,
            category,
            banner,
            primaryColor,
            secondaryColor,
            isPublic,
            allowAnonymous,
            moderators: moderators.split(",").map((mod) => mod.trim()),
        };
        console.log("Exchange Data:", exchangeData);
        // Here, you'd send this data to the server via API
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
                            Public Exchange
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={allowAnonymous}
                                onChange={(e) => setAllowAnonymous(e.target.checked)}
                            />
                            Allow Anonymous Posts
                        </label>
                    </div>
                </section>

                <section className="section moderation-settings">
                    <h2>Moderation Settings</h2>
                    <div className="form-group">
                        <label>Moderators (comma-separated usernames)</label>
                        <input
                            type="text"
                            value={moderators}
                            onChange={(e) => setModerators(e.target.value)}
                            placeholder="Add moderators"
                        />
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
