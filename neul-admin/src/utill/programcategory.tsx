export const categorylist = [
  { value: "1", label: "건강" },
  { value: "2", label: "체험" },
  { value: "3", label: "직업" },
];

//참여대상
export const targetlist = [
  { value: "teenager", label: "청소년" },
  { value: "adult", label: "성인" },
];

// value -> label 매핑 함수 (표시용)
export const getCategoryLabel = (value: string) => {
  const match = categorylist.find((opt) => opt.value === value);
  return match ? match.label : value;
};

// value -> label 매핑 함수 (표시용)
export const getParticipationLabel = (value: string) => {
  const match = targetlist.find((opt) => opt.value === value);
  return match ? match.label : value;
};
