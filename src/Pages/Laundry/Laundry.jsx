import React, { useEffect, useState } from "react";
import { deleteLaundry, fetchLaundry } from "../../services/laundryOperations";
import AddLaundry from "./AddLaundry";

const Laundry = () => {
  const [allLaundry, setAllLaundry] = useState([]);

  const loadLaundry = async () => {
    try {
      const fetchedLaundry = await fetchLaundry();
      setAllLaundry(fetchedLaundry);
    } catch (error) {
      console.error("Error loading laundry:", error);
    }
  };

  useEffect(() => {
    loadLaundry();
  }, []);

  // Function to delete a laundry entry
  const handleDeleteLaundry = async (id) => {
    try {
      await deleteLaundry(id);
      loadLaundry(); // Refresh the laundry list after deletion
    } catch (error) {
      console.error("Error deleting laundry:", error);
    }
  };

  // This function will be passed down to AddLaundry to update the laundry list after adding
  const handleLaundryUpdate = () => {
    loadLaundry(); // Refresh the laundry list after adding a new one
  };

  return (
    <div>
      <AddLaundry onLaundryUpdate={handleLaundryUpdate} />

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Type</th>
            <th style={tableHeaderStyle}>Description</th>
            <th style={tableHeaderStyle}>Dresses</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allLaundry.length === 0 ? (
            <tr>
              <td colSpan="5" style={tableDataStyle}>
                No laundry records found
              </td>
            </tr>
          ) : (
            allLaundry.map((laundry) => (
              <tr key={laundry.id}>
                <td style={tableDataStyle}>{laundry.date}</td>
                <td style={tableDataStyle}>{laundry.type}</td>
                <td style={tableDataStyle}>{laundry.description}</td>
                <td style={tableDataStyle}>
                  {laundry.dresses?.length > 0 ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      {laundry.dresses.map((dress, index) => (
                        <img
                          key={index}
                          src={dress.data.imgSrc}
                          alt={`Dress ${index + 1}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    "No dresses"
                  )}
                </td>
                <td style={tableDataStyle}>
                  <button
                    onClick={() => handleDeleteLaundry(laundry.id)}
                    style={{
                      backgroundColor: "#ff4d4d",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Style for table header and data
const tableHeaderStyle = {
  backgroundColor: "#f4f4f4",
  padding: "10px",
  borderBottom: "2px solid #ddd",
};

const tableDataStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  color: "white",
};

export default Laundry;
