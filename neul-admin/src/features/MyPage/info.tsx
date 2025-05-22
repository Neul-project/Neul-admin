import ChoiceWorkday from "../ChoiceWorkday";
import MyInfo from "../MyInfo";

export const items = [
  { label: "개인정보", key: "1", children: <MyInfo /> },
  {
    label: "근무일",
    key: "2",
    children: <ChoiceWorkday />,
  },
];
