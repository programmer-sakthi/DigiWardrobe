import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { toast } from "react-toastify";
import { auth, db, storage } from "../config/firebase";

/**
 * Fetches all laundry items from Firestore for the current user.
 * @returns {Promise<Array>} Array of laundry objects.
 */
export const fetchLaundry = async () => {
  try {
    const laundryCollectionRef = collection(db, "LaundryCollection");
    const laundryDocs = await getDocs(laundryCollectionRef);
    const fetchedLaundry = laundryDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return fetchedLaundry.filter((ele) => ele.uid === auth.currentUser.uid);
  } catch (error) {
    console.error("Error fetching laundry:", error);
    toast.error(error.message);
    throw error;
  }
};

/**
 * Adds a new laundry item to Firestore.
 * @param {Object} laundry - The laundry data to add.
 * @returns {Promise<void>}
 */
export const addLaundry = async (laundry) => {
  try {
    const laundryCollectionRef = collection(db, "LaundryCollection");
    await addDoc(laundryCollectionRef, laundry);
    toast.success("Laundry added successfully");
  } catch (error) {
    console.error("Error adding laundry:", error);
    toast.error(error.message);
    throw error;
  }
};

/**
 * Deletes a laundry item from Firestore.
 * @param {string} laundryId - The ID of the laundry item to delete.
 * @returns {Promise<void>}
 */
export const deleteLaundry = async (laundryId) => {
  try {
    await deleteDoc(doc(db, "LaundryCollection", laundryId));
    toast.success("Laundry deleted successfully!");
  } catch (error) {
    console.error("Error deleting laundry:", error);
    toast.error(error.message);
    throw error;
  }
};

/**
 * Fetches dresses by category for laundry selection.
 * @param {string} category - The category to filter dresses by.
 * @returns {Promise<Array>} Array of dress objects with image URLs.
 */
export const fetchDressesByCategory = async (category) => {
  try {
    const dressCollectionRef = collection(db, "DressCollection");
    const arr = await getDocs(dressCollectionRef);
    const dressPromises = arr.docs.map(async (doc) => {
      const imageURL = doc.data().imageURL;
      const imageRef = ref(storage, imageURL);
      const imageSrc = await getDownloadURL(imageRef);
      return { id: doc.id, data: { ...doc.data(), imgSrc: imageSrc } };
    });

    const dresses = (await Promise.all(dressPromises)).filter(
      (ele) =>
        ele.data.uid === auth.currentUser.uid && ele.data.category === category
    );

    return dresses;
  } catch (error) {
    console.error("Error fetching dresses by category:", error);
    toast.error("Failed to fetch dresses.");
    throw error;
  }
};
