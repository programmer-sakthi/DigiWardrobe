export const Card = ({ dressList }) => {
  return (
    <div className="card-container">
      <img
        src={dressList.imgSrc}
        alt={dressList.imgSrc}
        style={{
          width: "100%",
          borderRadius: "1rem 1rem 0 0",
          height: "100px",
        }}
      />
    </div>
  );
};
