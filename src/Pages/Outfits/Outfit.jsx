import React, { useEffect, useState } from "react";
import {
  createOutfit,
  deleteOutfit,
  fetchOutfits,
} from "../../services/outfitOperations";
import AddOutfit from "./AddOutfit";
import classes from "./Outfit.module.css";
import OutfitCard from "./OutfitCard";

const Outfit = () => {
  const [outfits, setOutfits] = useState([]);
  const [showAddOutfit, setShowAddOutfit] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  const handleCreateOutfit = async (outfit) => {
    setShowAddOutfit(false);
    try {
      await createOutfit(outfit);
      setOutfits([...outfits, outfit]);
    } catch (error) {
      console.error("Error creating outfit:", error);
    }
  };

  const handleDeleteOutfit = async (id) => {
    try {
      await deleteOutfit(id);
      setOutfits(outfits.filter((outfit) => outfit.id !== id));
      closeOutfitCard(); // Close the outfit card if the deleted outfit was selected
    } catch (error) {
      console.error("Error deleting outfit:", error);
    }
  };

  useEffect(() => {
    const loadOutfits = async () => {
      try {
        const fetchedOutfits = await fetchOutfits();
        setOutfits(fetchedOutfits);
      } catch (error) {
        console.error("Error loading outfits:", error);
      }
    };

    loadOutfits(); // Fetch outfits when component mounts
  }, []); // fetched all the outfits from firebase

  const handleAddOutfit = () => {
    setShowAddOutfit(true);
  };

  const closeModal = () => {
    setShowAddOutfit(false);
  };

  const openOutfitCard = (outfit) => {
    setSelectedOutfit(outfit);
  };

  const closeOutfitCard = () => {
    setSelectedOutfit(null);
  };

  return (
    <div className={classes.container}>
      {showAddOutfit && (
        <AddOutfit handleAdd={handleCreateOutfit} closeModal={closeModal} />
      )}
      <div className={classes.buttonContainer}>
        <button className={classes.button} onClick={handleAddOutfit}>
          Add Outfit
        </button>
      </div>
      <h1 className={classes.title}>Your Outfits:</h1>
      <div className={classes.outfitGrid}>
        {outfits.map((outfit) => (
          <div
            key={outfit.id}
            onClick={() => openOutfitCard(outfit)}
            className={classes.outfitItem}
          >
            {outfit.imageURL ? (
              <img
                src={outfit.imageURL}
                alt={outfit.name}
                className={classes.outfitImage}
              />
            ) : (
              <h1 className={classes.outfitName}>{outfit.name}</h1>
            )}
            <h2 className={classes.outfitName}>{outfit.name}</h2>
          </div>
        ))}
      </div>
      {selectedOutfit && (
        <>
          <div className={classes.overlay} onClick={closeOutfitCard}></div>
          <OutfitCard
            outfit={selectedOutfit}
            onClose={closeOutfitCard}
            onDelete={handleDeleteOutfit}
          />
        </>
      )}
    </div>
  );
};

export default Outfit;
