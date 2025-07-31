import React from "react";
import classes from "./AddOutfitForDate.module.css";

const AddOutfitForDate = ({ outfits, onOutfitClick, handleClose }) => {
  return (
    <div className={classes.AddOutfitForDateContainer}>
      <h3 style={{ color : "black"}}>Add Outfit for the Date</h3>
      <p>Click to add an outfit for the date</p>
      <div>
        {outfits.map((outfit) => {
          return (
            <div
              key={outfit.id}
              onClick={() => {
                onOutfitClick(outfit);
              }}
            >
              {outfit.imageURL ? (
                <img
                  src={outfit.imageURL}
                  alt={outfit.name}
                  className={classes.outfitImage}
                  style={{ height: "100px", width: "100px" }}
                />
              ) : (
                <h1 className={classes.outfitName}>{outfit.name}</h1>
              )}
              <h2 className={classes.outfitName}>{outfit.name}</h2>
            </div>
          );
        })}
      </div>
      <button onClick={handleClose} className={classes.closeButton}>Close</button>
    </div>
  );
};

export default AddOutfitForDate;
