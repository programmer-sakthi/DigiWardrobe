import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { auth, db, storage } from "../config/firebase";

/**
 * Uploads image to Firebase Storage and adds dress data to Firestore.
 * @param {Object} data - Dress data including form values and image file.
 * @returns {Promise<void>}
 */
export const addDress = async (data) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    const { image, ...formData } = data;

    const imageURL = `users/${user.uid}/${image.name + v4()}`;
    const imageRef = ref(storage, imageURL);

    // Upload the image to Firebase Storage
    await uploadBytes(imageRef, image);

    // Prepare the document data
    const dressDoc = {
      ...formData,
      imageURL,
      uid: user.uid,
      dress_id: v4(),
    };

    // Add document to Firestore
    const dressDataRef = collection(db, "DressCollection");
    await addDoc(dressDataRef, dressDoc);

    toast.success("Dress added successfully");
  } catch (error) {
    console.error("Error adding dress:", error);
    toast.error("Failed to add dress");
  }
};
