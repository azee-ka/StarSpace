import React from "react";
import "./frontPage.css";

const FrontPage = () => {
    return (
        <div className="front-page">
            {/* Hero Section */}
            <section className="hero-section">
                <h1>4Space. A New Dimension of Possibilities.</h1>
                <p>Explore, collaborate, and innovate with a platform designed to inspire curiosity and drive progress.</p>
            </section>

            {/* Features Section */}
            <section className="feature-section">
                <div className="feature-card">
                    <h2>OpenSpace</h2>
                    <p>Engage in dynamic discussions with like-minded individuals. Share knowledge, spark ideas, and create together.</p>
                </div>

                <div className="feature-card">
                    <h2>ProSpace</h2>
                    <p>For the professionals: access a powerful suite of tools to collaborate on high-level projects and innovations.</p>
                </div>

                <div className="feature-card">
                    <h2>Catalyst Space</h2>
                    <p>Where ideas are transformed into reality. Find collaborators, pitch concepts, and secure funding for groundbreaking projects.</p>
                </div>
            </section>

            {/* Additional Features - Dynamic, Engaging Cards */}
            <section className="feature-section">
                <div className="feature-card">
                    <h2>Learning Hub</h2>
                    <p>Access an extensive library of tutorials, guides, and resources to fuel your learning journey.</p>
                </div>

                <div className="feature-card">
                    <h2>Impact Metrics</h2>
                    <p>Track your contributions, measure your growth, and visualize the difference you're making in the world.</p>
                </div>

                <div className="feature-card">
                    <h2>Events & Community</h2>
                    <p>Join live events, workshops, and discussions to meet passionate creators and innovators.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© {new Date().getFullYear()} 4Space. All Copyrights Reserved.</p>
            </footer>
        </div>
    );
};

export default FrontPage;
