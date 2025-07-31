import React, { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../../config/firebase";
import AddOutfitForDate from "./AddOutfitForDate";
import CalendarWithOutfits from "./CalendarWithOutfits";
import { Card } from "./Card";
import classes from './ScheduleOutfit.module.css'

const ScheduleOutfit = () => {
  const [outfits, setOutfits] = useState([]);
  const [showAddOutfitForDateModal, setShowAddOutfitForDateModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedOutfits, setSelectedOutfits] = useState({});

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const outfitCollectionRef = collection(db, "OutfitCollection");
        const outfitDocs = await getDocs(outfitCollectionRef);
        const fetchedOutfits = outfitDocs.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((ele) => ele.uid === auth.currentUser.uid);

        setOutfits(fetchedOutfits);
      } catch (error) {
        toast.error(`Error fetching outfits: ${error.message}`);
      }
    };

    const fetchScheduledOutfits = async () => {
      try {
        const scheduleDocRef = doc(db, "ScheduleOutfitCollection", auth.currentUser.uid);
        const scheduleDoc = await getDoc(scheduleDocRef);
        if (scheduleDoc.exists()) {
          setSelectedOutfits(scheduleDoc.data().scheduledOutfits || {});
        }
      } catch (error) {
        toast.error(`Error fetching scheduled outfits: ${error.message}`);
      }
    };

    fetchOutfits();
    fetchScheduledOutfits();
  }, []);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const addSelectedOutfits = async (outfit) => {
    const formattedDate = date.toDateString();
    const updatedSelectedOutfits = {
      ...selectedOutfits,
      [formattedDate]: [...(selectedOutfits[formattedDate] || []), outfit],
    };
    setSelectedOutfits(updatedSelectedOutfits);

    try {
      await setDoc(doc(db, "ScheduleOutfitCollection", auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        scheduledOutfits: updatedSelectedOutfits
      }, { merge: true });
      toast.success("Outfit scheduled successfully!");
    } catch (error) {
      toast.error(`Error scheduling outfit: ${error.message}`);
    }

    setShowAddOutfitForDateModal(false);
  };

  const handleCloseModal = () => {
    setShowAddOutfitForDateModal(false);
  };

  const renderOutfitsForDate = () => {
    const formattedDate = date.toDateString();
    return selectedOutfits[formattedDate] ? (
      <div className="outfit-grid">
        {selectedOutfits[formattedDate].map((outfit, index) => (
          <Card key={index} outfitImage={outfit.imageURL} />
        ))}
      </div>
    ) : (
      <p className="no-outfits">No outfits for this date</p>
    );
  };

  const getAvailableOutfits = () => {
    const formattedDate = date.toDateString();
    const assignedOutfits = selectedOutfits[formattedDate] || [];
    return outfits.filter(outfit => !assignedOutfits.some(assigned => assigned.id === outfit.id));
  };

  return (
    <div className={classes.ScheduleOutfit}>
      {showAddOutfitForDateModal && (
        <AddOutfitForDate
          outfits={getAvailableOutfits()}
          onOutfitClick={addSelectedOutfits}
          handleClose={handleCloseModal}
        />
      )}
      <h2 className="schedule-title">Schedule Your Outfits</h2>
      <CalendarWithOutfits onDateChange={handleDateChange} />
      <button
        className={classes.AddOutfitButton}
        onClick={() => setShowAddOutfitForDateModal(true)}
      >
        Add Outfits for this Date
      </button>
      <h2 className>Selected Outfits for {date.toDateString()}</h2>
      {renderOutfitsForDate()}
    </div>
  );
};

export default ScheduleOutfit;