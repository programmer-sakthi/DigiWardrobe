import { useRef } from "react";
import { updateDress } from "../../services/dressOperations";
import classes from "./Card.module.css";

export const EditModal = ({ dressList, onClose, onUpdate }) => {
  const formRef = useRef();

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get the updated form data from refs
      const updatedData = {
        title: formRef.current.title.value,
        description: formRef.current.description.value,
        category: formRef.current.category.value,
        subCategory: formRef.current.subCategory.value,
        size: formRef.current.size.value,
        material: formRef.current.material.value,
        color: formRef.current.color.value,
        price: formRef.current.price.value,
        purchaseDate: formRef.current.purchaseDate.value,
        purchasedFrom: formRef.current.purchasedFrom.value,
      };

      await updateDress(dressList.id, updatedData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating dress: ", error);
    }
  };

  return (
    <div
      className={`${classes.ModalContainer} ${classes.show}`}
      onClick={onClose}
    >
      <div className={classes.Modal} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleEditSubmit} ref={formRef}>
          <h4>Edit Dress Details</h4>

          <input
            type="text"
            name="title"
            defaultValue={dressList.title}
            placeholder="Title"
          />
          <input
            type="text"
            name="description"
            defaultValue={dressList.description}
            placeholder="Description"
            required
          />
          <input
            type="text"
            name="category"
            defaultValue={dressList.category}
            placeholder="Category"
            required
          />
          <input
            type="text"
            name="subCategory"
            defaultValue={dressList.subCategory}
            placeholder="SubCategory"
            required
          />
          <input
            type="text"
            name="size"
            defaultValue={dressList.size}
            placeholder="Size"
            required
          />
          <input
            type="text"
            name="material"
            defaultValue={dressList.material}
            placeholder="Material"
            required
          />
          <input
            type="text"
            name="color"
            defaultValue={dressList.color}
            placeholder="Color"
            required
          />
          <input
            type="number"
            name="price"
            defaultValue={dressList.price}
            placeholder="Price"
            required
          />
          <input
            type="date"
            name="purchaseDate"
            defaultValue={dressList.purchaseDate.split("T")[0]}
            required
          />
          <input
            type="text"
            name="purchasedFrom"
            defaultValue={dressList.purchasedFrom}
            placeholder="Purchased From"
            required
          />

          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};
