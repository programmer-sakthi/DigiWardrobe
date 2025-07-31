import React, { useState } from "react";
import Calendar from "react-calendar";
import "./CalendarWithOutfits.css";

const CalendarWithOutfits = ({onDateChange}) => {
  
  const [date, setDate] = useState(new Date());

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    onDateChange(selectedDate);
  };

  return (
    <div className="calendar-container">
      <Calendar onChange={handleDateChange} value={date} />
    </div>
  );
};

export default CalendarWithOutfits;
