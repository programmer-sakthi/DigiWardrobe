import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { auth, db, storage } from "../config/firebase";

/**
 * Fetches all dresses from Firestore and downloads their images from Firebase Storage.
 * @param {number} categoryId - The category ID to filter by (0 for all categories).
 * @returns {Promise<Array>} Array of dress objects with image URLs.
 */
export const fetchDresses = async (categoryId = 0) => {
  try {
    const dressDataRef = collection(db, "DressCollection");
    const arr = await getDocs(dressDataRef);

    const dressPromises = arr.docs.map(async (doc) => {
      const imageURL = doc.data().imageURL;
      const imageRef = ref(storage, imageURL);
      const imageSrc = await getDownloadURL(imageRef);

      return {
        id: doc.id,
        imgSrc: imageSrc,
        title: doc.data().title,
        description: doc.data().description,
        category: doc.data().category,
        subCategory: doc.data().subCategory,
        size: doc.data().size,
        material: doc.data().material,
        color: doc.data().color,
        price: doc.data().price,
        purchaseDate: doc.data().purchaseDate,
        purchasedFrom: doc.data().purchasedFrom,
        uid: doc.data().uid,
        dress_id: doc.data().dress_id,
      };
    });

    const dresses = await Promise.all(dressPromises);
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Filter dresses by user and category
    const filteredDresses = dresses.filter((dress) => {
      const matchesUser = dress.uid === currentUser.uid;

      if (categoryId === 0) {
        return matchesUser;
      } else {
        return matchesUser && parseInt(dress.category) === categoryId;
      }
    });

    return filteredDresses;
  } catch (error) {
    console.error("Error fetching dresses:", error);
    throw error;
  }
};
