import { useState } from "react";
import API from "../api/api";
import styles from "./RecommendationPanel.module.css";

const RecommendationPanel = ({ boardId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const res = await API.post(`/boards/${boardId}/recommend`);
      setData(res.data);
    } catch (err) {
      console.error("Recommendation Error:", err);
    }
    setLoading(false);
  };

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Smart Recommendations</h2>

      <button
        className={styles.generateBtn}
        onClick={getRecommendations}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Generate"}
      </button>

      {!data && (
        <p className={styles.empty}>Click Generate to analyze this board.</p>
      )}

      {data && (
        <div className={styles.results}>
          <div className={styles.total}>
            <span>📊 Total Cards Scanned:</span>{" "}
            <strong>{data.totalCards}</strong>
          </div>

          <div className={styles.divider} />

          {data.recommendations.map((card) => (
            <div key={card.id} className={styles.cardItem}>
              <h3 className={styles.cardTitle}>{card.title}</h3>

              {/* Due Date */}
              <div className={styles.field}>
                <span className={styles.label}>Suggested Due Date</span>
                <span className={styles.value}>
                  {card.suggestedDueDate
                    ? new Date(card.suggestedDueDate).toLocaleString()
                    : "No suggestion"}
                </span>
              </div>

              {/* Movement */}
              <div className={styles.field}>
                <span className={styles.label}>Suggested Movement</span>
                <span className={styles.badge}>{card.suggestedMovement}</span>
              </div>

              {/* Related Cards */}
              <div className={styles.field}>
                <span className={styles.label}>Related Cards</span>

                {card.relatedCards.length === 0 ? (
                  <p className={styles.none}>No similar cards found</p>
                ) : (
                  <ul className={styles.relatedList}>
                    {card.relatedCards.map((rel) => (
                      <li key={rel._id} className={styles.relatedItem}>
                        {rel.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationPanel;
