import React, { useState } from "react";
import { addLaundry } from "../../services/laundryOperations";
import AddLaundryModal from "./AddLaundryModal";

const AddLaundry = ({ onLaundryUpdate }) => {
  const [showAddLaundryModal, setShowAddLaundryModal] = useState(false);

  const handleAddLaundry = async (laundry) => {
    console.log(laundry);
    try {
      await addLaundry(laundry);
      onLaundryUpdate(); // Call this to update the laundry list after adding
    } catch (error) {
      console.error("Error adding laundry:", error);
    }
  };

  return (
    <div>
      {showAddLaundryModal && (
        <AddLaundryModal
          onClose={() => setShowAddLaundryModal(false)}
          handleAddLaundryClick={handleAddLaundry}
        />
      )}
      <button
        style={{ background: "blue" }}
        onClick={() => setShowAddLaundryModal(!showAddLaundryModal)}
      >
        Add Laundry
      </button>
    </div>
  );
};

export default AddLaundry;
