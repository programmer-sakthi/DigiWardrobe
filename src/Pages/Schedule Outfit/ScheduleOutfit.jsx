import React, { useEffect, useState } from "react";
import {
  fetchOutfitsForSchedule,
  fetchScheduledOutfits,
  scheduleOutfit,
} from "../../services/scheduleOperations";
import AddOutfitForDate from "./AddOutfitForDate";
import CalendarWithOutfits from "./CalendarWithOutfits";
import { Card } from "./Card";
import classes from "./ScheduleOutfit.module.css";

const ScheduleOutfit = () => {
  const [outfits, setOutfits] = useState([]);
  const [showAddOutfitForDateModal, setShowAddOutfitForDateModal] =
    useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedOutfits, setSelectedOutfits] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedOutfits, fetchedScheduledOutfits] = await Promise.all([
          fetchOutfitsForSchedule(),
          fetchScheduledOutfits(),
        ]);

        setOutfits(fetchedOutfits);
        setSelectedOutfits(fetchedScheduledOutfits);
      } catch (error) {
        console.error("Error loading schedule data:", error);
      }
    };

    loadData();
  }, []);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const addSelectedOutfits = async (outfit) => {
    try {
      const updatedSelectedOutfits = await scheduleOutfit(
        date,
        outfit,
        selectedOutfits
      );
      setSelectedOutfits(updatedSelectedOutfits);
    } catch (error) {
      console.error("Error scheduling outfit:", error);
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
    return outfits.filter(
      (outfit) => !assignedOutfits.some((assigned) => assigned.id === outfit.id)
    );
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
