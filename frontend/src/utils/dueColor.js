export const getDueBadge = (dueDate) => {
  if (!dueDate) return { color: "#6b7280", label: "No Due" };

  const now = new Date();
  const due = new Date(dueDate);

  const diffHours = (due - now) / (1000 * 60 * 60);

  if (diffHours < 0) return { color: "#dc2626", label: "Overdue" }; // red
  if (diffHours <= 48) return { color: "#d97706", label: "Due Soon" }; // yellow
  return { color: "#059669", label: "On Track" }; // green
};
