export const CATEGORIES = [
  "Food", "Travel", "Shopping", "Bills",
  "Entertainment", "Health", "Education", "Other",
];

export const CATEGORY_TONE = {
  Food: "food", Travel: "travel", Shopping: "shopping", Bills: "bills",
  Entertainment: "entertainment", Health: "health", Education: "education", Other: "other",
};

export const CATEGORY_DOT = {
  Food: "#0d9488", Travel: "#2563eb", Shopping: "#db2777", Bills: "#d97706",
  Entertainment: "#7c3aed", Health: "#0891b2", Education: "#65a30d", Other: "#64748b",
};

export const CHART_COLORS = [
  "#0d9488", "#2563eb", "#db2777", "#d97706",
  "#7c3aed", "#0891b2", "#65a30d", "#64748b",
];

export const currency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
