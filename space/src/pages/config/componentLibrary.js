import React from "react";

// Example Components
export const PostFeed = ({ style }) => (
  <div style={style}>
    <h3>Post Feed</h3>
    <p>Displaying posts...</p>
  </div>
);

export const ProfileCard = ({ style }) => (
  <div style={style}>
    <h3>Profile Card</h3>
    <p>User Info...</p>
  </div>
);

// Centralized Library
export const componentLibrary = {
  PostFeed: {
    Component: PostFeed,
    defaultProps: { style: { width: "100%", height: "400px", background: "#f9f9f9" } },
    api: "/api/posts",
  },
  ProfileCard: {
    Component: ProfileCard,
    defaultProps: { style: { width: "300px", height: "200px", background: "#fff" } },
    api: "/api/users/{id}",
  },
};
