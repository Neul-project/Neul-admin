import TitleCompo from "@/components/TitleCompo";
import { DashStyled } from "./styled";
import axiosInstance from "@/lib/axios";
import { useState } from "react";

const DashBoard = () => {
  const [patientgender, setPatientGender] = useState("");

  axiosInstance.get("/activity/targetlist").then((res) => {
    console.log("전체 admin당 피보호자 리스트", res.data);
  });

  return (
    <DashStyled>
      <TitleCompo title="대시보드" />
      <div></div>
    </DashStyled>
  );
};
export default DashBoard;
