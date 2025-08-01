import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import { auth, storage } from "../config/firebase";

/**
 * Uploads a profile image to Firebase Storage and updates the user's profile.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} The download URL of the uploaded image.
 */
export const uploadProfileImage = async (file) => {
  try {
    // Check if the user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User is not authenticated.");
    }

    const imageURL = `profilePics/${currentUser.uid}/profilepic`;
    const imageRef = ref(storage, imageURL);

    // Upload the image
    await uploadBytes(imageRef, file);
    toast.success("Image has been successfully uploaded");

    // Get the download URL
    const imageSrc = await getDownloadURL(imageRef);

    // Update user profile with new photo URL
    await updateProfile(currentUser, { photoURL: imageSrc });

    return imageSrc;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    toast.error("Error uploading image: " + error.message);
    throw error;
  }
};
