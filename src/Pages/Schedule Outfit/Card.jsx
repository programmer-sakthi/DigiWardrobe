export const Card = ({ outfitImage }) => {
  return (
    <div className="card-container">
      <img
        src={outfitImage}
        alt="Your outft"
        style={{
          width: "100px",
          borderRadius: "1rem 1rem 0 0",
          height: "100px",
        }}
      />
    </div>
  );
};
