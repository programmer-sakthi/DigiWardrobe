import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { deleteDress } from "../../services/dressOperations";
import classes from "./Card.module.css";
import { EditModal } from "./EditModal";

export const Card = ({ dressList, fetchFireBase }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowEditModal(false);
  };

  const handleDelete = async () => {
    try {
      await deleteDress(dressList.id, dressList.imgSrc);
      // Refresh the data
      fetchFireBase();
    } catch (error) {
      console.error("Error deleting dress: ", error);
    }
  };

  const Modal = () => (
    <div
      className={`${classes.ModalContainer} ${showModal ? classes.show : ""}`}
      onClick={closeModal}
    >
      <div className={classes.Modal} onClick={(e) => e.stopPropagation()}>
        <div className={classes.ModalHeader}>
          <button onClick={handleDelete}>
            <MdDelete size={"30px"} />
          </button>
          <button onClick={() => setShowEditModal(true)}>
            <MdEdit size={"30px"} />
          </button>
          <button onClick={closeModal}>
            <IoMdClose size={"30px"} />
          </button>
        </div>
        <div className={classes.modalContent}>
          <img
            height="100px"
            width="100px"
            src={dressList.imgSrc}
            alt="dress img"
          />
          <h4>{dressList.title}</h4>
          <table>
            <tbody>
              <tr>
                <td>
                  <h5>Description:</h5>
                </td>
                <td>
                  <h5>{dressList.description}</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h5>Category:</h5>
                </td>
                <td>
                  <h5>{dressList.category}</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h5>SubCategory:</h5>
                </td>
                <td>
                  <h5>{dressList.subCategory}</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h5>Size:</h5>
                </td>
                <td>
                  <h5>{dressList.size}</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h5>Material:</h5>
                </td>
                <td>
                  <h5>{dressList.material}</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h5>Color:</h5>
                </td>
                <td>
                  <h5>{dressList.color}</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h5>Price:</h5>
                </td>
                <td>
                  <h5>{dressList.price}</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h5>Purchase Date:</h5>
                </td>
                <td>
                  <h5>{dressList.purchaseDate}</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h5>Purchased From:</h5>
                </td>
                <td>
                  <h5>{dressList.purchasedFrom}</h5>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {showEditModal && (
          <EditModal
            dressList={dressList}
            onClose={() => setShowEditModal(false)}
            onUpdate={fetchFireBase}
          />
        )}

        <div className={classes.modalFooter}></div>
      </div>
    </div>
  );

  return (
    <div className={classes.cardContainer} onClick={toggleModal}>
      {showModal && <Modal />}
      <img
        src={dressList.imgSrc}
        alt={dressList.title}
        className={classes.cardImg}
      />
    </div>
  );
};
