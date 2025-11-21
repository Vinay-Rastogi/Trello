const BoardCard = ({ board, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 20,
        border: "1px solid #888",
        cursor: "pointer",
        width: 200,
        height: 120,
        borderRadius: 8
      }}
    >
      <h3>{board.title}</h3>
    </div>
  );
}

export default BoardCard;
