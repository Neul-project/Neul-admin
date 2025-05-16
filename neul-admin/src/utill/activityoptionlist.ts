export const activityOptions = [
  { value: "walk", label: "산책" },
  { value: "play", label: "놀이" },
  { value: "exercise", label: "운동" },
];

// value -> label 매핑 함수 (표시용)
export const getActivityLabel = (value: string) => {
  const match = activityOptions.find((opt) => opt.value === value);
  return match ? match.label : value;
};

export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
