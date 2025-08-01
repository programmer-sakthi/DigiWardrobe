import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { uploadProfileImage } from "../../services/profileOperations";
import classes from "./Profile.module.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // For upload loading state
  const [imageLoading, setImageLoading] = useState(false); // For image loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (user === null) {
    return <div style={{ color: "White" }}>Loading .....</div>;
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    setLoading(true); // Set loading state for upload
    setImageLoading(true); // Set loading state for image display

    try {
      // Upload the image and get the new URL
      const imageSrc = await uploadProfileImage(file);

      // Update local user state
      const updatedUser = { ...user, photoURL: imageSrc };
      setUser(updatedUser);

      // Set image loading to true to show placeholder until loaded
      setImageLoading(true);

      // Load the new image to ensure it is ready before displaying
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setImageLoading(false); // Image has loaded
        setLoading(false); // Upload is complete
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false); // Reset loading state on error
    }
  };

  return (
    <div className={classes.profileContainer}>
      <div className={classes.profilePicContainer}>
        {imageLoading && (
          <div className={classes.loadingOverlay}>Loading...</div>
        )}{" "}
        {/* Loading overlay */}
        <img
          src={user.photoURL}
          alt="Profile pic"
          style={{ display: imageLoading ? "none" : "block" }}
        />
        <input type="file" onChange={handleImageChange} disabled={loading} />
        {loading && <p style={{ color: "white" }}>Uploading...</p>}{" "}
        {/* Display upload message */}
      </div>
      <h5>Name: {user.displayName}</h5>
      <h5>Email: {user.email}</h5>
      <h5>User Created on: {user.metadata.creationTime}</h5>
    </div>
  );
};

export default Profile;
