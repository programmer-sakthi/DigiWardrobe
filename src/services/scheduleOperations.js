import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../config/firebase";

/**
 * Fetches all outfits from Firestore for the current user.
 * @returns {Promise<Array>} Array of outfit objects.
 */
export const fetchOutfitsForSchedule = async () => {
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
 * Fetches scheduled outfits for the current user.
 * @returns {Promise<Object>} Object containing scheduled outfits by date.
 */
export const fetchScheduledOutfits = async () => {
  try {
    const scheduleDocRef = doc(
      db,
      "ScheduleOutfitCollection",
      auth.currentUser.uid
    );
    const scheduleDoc = await getDoc(scheduleDocRef);
    if (scheduleDoc.exists()) {
      return scheduleDoc.data().scheduledOutfits || {};
    }
    return {};
  } catch (error) {
    console.error("Error fetching scheduled outfits:", error);
    toast.error(`Error fetching scheduled outfits: ${error.message}`);
    throw error;
  }
};

/**
 * Schedules an outfit for a specific date.
 * @param {Date} date - The date to schedule the outfit for.
 * @param {Object} outfit - The outfit to schedule.
 * @param {Object} currentScheduledOutfits - Current scheduled outfits object.
 * @returns {Promise<Object>} Updated scheduled outfits object.
 */
export const scheduleOutfit = async (date, outfit, currentScheduledOutfits) => {
  try {
    const formattedDate = date.toDateString();
    const updatedSelectedOutfits = {
      ...currentScheduledOutfits,
      [formattedDate]: [
        ...(currentScheduledOutfits[formattedDate] || []),
        outfit,
      ],
    };

    await setDoc(
      doc(db, "ScheduleOutfitCollection", auth.currentUser.uid),
      {
        uid: auth.currentUser.uid,
        scheduledOutfits: updatedSelectedOutfits,
      },
      { merge: true }
    );

    toast.success("Outfit scheduled successfully!");
    return updatedSelectedOutfits;
  } catch (error) {
    console.error("Error scheduling outfit:", error);
    toast.error(`Error scheduling outfit: ${error.message}`);
    throw error;
  }
};
