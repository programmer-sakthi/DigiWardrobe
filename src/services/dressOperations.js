import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { toast } from "react-toastify";
import { db } from "../config/firebase";

/**
 * Deletes a dress document from Firestore and its associated image from Firebase Storage.
 * @param {string} dressId - The ID of the dress document to delete.
 * @param {string} imageSrc - The image source path in Firebase Storage.
 * @returns {Promise<void>}
 */
export const deleteDress = async (dressId, imageSrc) => {
  try {
    const docRef = doc(db, "DressCollection", dressId);

    // Delete the document from Firestore
    await deleteDoc(docRef);

    // Delete the image from Firebase Storage
    const storage = getStorage();
    const imageRef = ref(storage, imageSrc);
    await deleteObject(imageRef);

    toast.success("Dress deleted successfully");
  } catch (error) {
    console.error("Error deleting document or image: ", error);
    toast.error("Failed to delete dress");
    throw error;
  }
};

/**
 * Updates a dress document in Firestore with new data.
 * @param {string} dressId - The ID of the dress document to update.
 * @param {Object} updatedData - The updated dress data.
 * @returns {Promise<void>}
 */
export const updateDress = async (dressId, updatedData) => {
  try {
    const docRef = doc(db, "DressCollection", dressId);

    // Ensure price is a number
    const dataToUpdate = {
      ...updatedData,
      price: Number(updatedData.price),
    };

    await updateDoc(docRef, dataToUpdate);
    toast.success("Dress updated successfully");
  } catch (error) {
    console.error("Error updating document: ", error);
    toast.error("Failed to update dress");
    throw error;
  }
};
