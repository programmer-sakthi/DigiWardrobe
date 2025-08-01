import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { auth, db, storage } from "../config/firebase";

/**
 * Fetches all outfits from Firestore for the current user.
 * @returns {Promise<Array>} Array of outfit objects.
 */
export const fetchOutfits = async () => {
  try {
    const outfitCollectionRef = collection(db, "OutfitCollection");
    const outfitDocs = await getDocs(outfitCollectionRef);
    const fetchedOutfits = outfitDocs.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((ele) => ele.uid === auth.currentUser.uid);

    return fetchedOutfits;
  } catch (error) {
    console.error("Error fetching outfits:", error);
    toast.error(`Error fetching outfits: ${error.message}`);
    throw error;
  }
};

/**
 * Creates a new outfit in Firestore.
 * @param {Object} outfit - The outfit data to create.
 * @returns {Promise<void>}
 */
export const createOutfit = async (outfit) => {
  try {
    const outfitCollectionRef = collection(db, "OutfitCollection");

    const newOutfit = {
      name: outfit.name,
      dresses: outfit.dresses,
      imageURL: outfit.image,
      uid: outfit.uid,
    };

    await addDoc(outfitCollectionRef, newOutfit);
    toast.success("Outfit added successfully!");
  } catch (error) {
    console.error("Error adding outfit:", error);
    toast.error(`Error adding outfit: ${error.message}`);
    throw error;
  }
};

/**
 * Deletes an outfit from Firestore.
 * @param {string} outfitId - The ID of the outfit to delete.
 * @returns {Promise<void>}
 */
export const deleteOutfit = async (outfitId) => {
  try {
    const outfitDocRef = doc(db, "OutfitCollection", outfitId);
    await deleteDoc(outfitDocRef);
    toast.success("Outfit deleted successfully!");
  } catch (error) {
    console.error("Error deleting outfit:", error);
    toast.error(`Error deleting outfit: ${error.message}`);
    throw error;
  }
};

/**
 * Uploads an outfit image to Firebase Storage.
 * @param {File} image - The image file to upload.
 * @returns {Promise<string>} The download URL of the uploaded image.
 */
export const uploadOutfitImage = async (image) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const imgURL = `outfits/${user.uid}/${image.name}_${v4()}`;
    const imageRef = ref(storage, imgURL);
    await uploadBytes(imageRef, image);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading outfit image:", error);
    throw error;
  }
};
